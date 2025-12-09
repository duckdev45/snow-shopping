'use client'

import React, { useEffect, useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send, Image as ImageIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import Image from 'next/image'

interface Message {
  id: string
  content: string
  sender_id: string
  created_at: string
  message_type: 'text' | 'product_card'
  metadata?: any
}

interface ChatWindowProps {
  conversationId: string
  currentUser: any
  initialMessages: any[]
}

export function ChatWindow({
  conversationId,
  currentUser,
  initialMessages
}: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [newMessage, setNewMessage] = useState('')
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  // 自動捲動到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // 訂閱 Supabase Realtime
  useEffect(() => {
    const channel = supabase
      .channel(`chat:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [conversationId, supabase])

  // 發送訊息
  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!newMessage.trim()) return

    const content = newMessage.trim()
    setNewMessage('') // 清空輸入框

    const { error } = await supabase.from('messages').insert({
      conversation_id: conversationId,
      sender_id: currentUser.id,
      content: content,
      message_type: 'text'
    })

    if (error) {
      console.error('Send error:', error)
      setNewMessage(content) // 失敗就把字補回來
    }
  }

  return (
    <>
      {/* 訊息列表區 */}
      <div className='scrollbar-thin scrollbar-thumb-gray-200 flex-1 space-y-4 overflow-y-auto bg-slate-50 p-3'>
        {messages.map((msg) => {
          const isMe = msg.sender_id === currentUser.id

          return (
            <div
              key={msg.id}
              className={cn(
                'flex w-full',
                isMe ? 'justify-end' : 'justify-start'
              )}>
              <div
                className={cn(
                  'flex max-w-[85%] flex-col gap-1',
                  isMe ? 'items-end' : 'items-start'
                )}>
                {/* 顯示商品卡片 */}
                {msg.message_type === 'product_card' && msg.metadata ? (
                  <div className='w-64 overflow-hidden rounded-xl border bg-white shadow-sm'>
                    {msg.metadata.image && (
                      <div className='relative h-32 w-full bg-gray-100'>
                        <Image
                          src={msg.metadata.image}
                          alt='product'
                          fill
                          className='object-cover'
                        />
                      </div>
                    )}
                    <div className='p-3'>
                      <p className='mb-1 text-xs font-bold text-blue-600'>
                        詢問商品
                      </p>
                      <p className='line-clamp-1 font-bold text-gray-900'>
                        {msg.metadata.title}
                      </p>
                      <p className='text-sm text-gray-500'>
                        NT$ {msg.metadata.price?.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ) : (
                  /* 顯示純文字 */
                  <div
                    className={cn(
                      'px-4 py-2 text-[15px] leading-relaxed break-words shadow-sm',
                      isMe
                        ? 'rounded-2xl rounded-tr-sm bg-blue-600 text-white'
                        : 'rounded-2xl rounded-tl-sm bg-white text-gray-800'
                    )}>
                    {msg.content}
                  </div>
                )}

                <span className='px-1 text-[10px] text-gray-400'>
                  {new Date(msg.created_at).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* 底部輸入區 */}
      <div className='flex-none border-t bg-white px-4 py-3'>
        <form onSubmit={handleSendMessage} className='flex items-center gap-2'>
          {/* 圖片上傳按鈕 */}
          <Button
            type='button'
            size='icon'
            variant='ghost'
            className='h-9 w-9 flex-shrink-0 rounded-full text-gray-400 hover:bg-gray-100'>
            <ImageIcon className='h-5 w-5' />
          </Button>

          {/* 輸入框 */}
          <div className='relative flex-1'>
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder='輸入訊息...'
              className='w-full rounded-full border-gray-200 bg-gray-100 px-4 py-2 pr-10 text-sm transition-all focus-visible:bg-white focus-visible:ring-1 focus-visible:ring-blue-500'
            />
          </div>

          {/* 發送按鈕 */}
          <Button
            type='submit'
            size='icon'
            className={cn(
              'h-9 w-9 flex-shrink-0 rounded-full shadow-sm transition-all',
              newMessage.trim()
                ? 'scale-100 bg-blue-600 hover:bg-blue-700'
                : 'scale-90 bg-gray-200 text-gray-400'
            )}
            disabled={!newMessage.trim()}>
            <Send className='h-4 w-4' />
          </Button>
        </form>
      </div>
    </>
  )
}
