'use client'

import React, {useEffect, useState, useRef} from 'react'
import {createClient} from '@/lib/supabase/client'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {Send, Image as ImageIcon} from 'lucide-react'
import {cn} from '@/lib/utils'
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
        messagesEndRef.current?.scrollIntoView({behavior: 'smooth'})
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

        const {error} = await supabase.from('messages').insert({
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
        // ✨✨✨ 關鍵修改：確保容器佔滿高度 ✨✨✨
        <div className="flex h-full flex-col bg-slate-50">

            {/* 訊息顯示區：flex-1 自動伸縮，overflow-y-auto 負責內部捲動 */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {messages.map((msg) => {
                    const isMe = msg.sender_id === currentUser.id
                    return (
                        <div key={msg.id} className={cn("flex w-full", isMe ? "justify-end" : "justify-start")}>
                            <div className={cn("flex max-w-[85%] flex-col gap-1", isMe ? "items-end" : "items-start")}>

                                {/* 顯示商品卡片 */}
                                {msg.message_type === 'product_card' && msg.metadata ? (
                                    <div className="overflow-hidden rounded-xl border bg-white shadow-sm w-64">
                                        {msg.metadata.image && (
                                            <div className="relative h-32 w-full bg-gray-100">
                                                <Image src={msg.metadata.image} alt="product" fill
                                                       className="object-cover"/>
                                            </div>
                                        )}
                                        <div className="p-3">
                                            <p className="text-xs text-blue-600 font-bold mb-1">詢問商品</p>
                                            <p className="font-bold text-gray-900 line-clamp-1">{msg.metadata.title}</p>
                                            <p className="text-gray-500 text-sm">NT$ {msg.metadata.price?.toLocaleString()}</p>
                                        </div>
                                    </div>
                                ) : (
                                    /* 顯示純文字 */
                                    <div className={cn(
                                        "px-4 py-2.5 text-[15px] leading-relaxed break-words shadow-sm max-w-full",
                                        isMe ? "bg-blue-600 text-white rounded-2xl rounded-tr-sm" : "bg-white text-gray-800 rounded-2xl rounded-tl-sm"
                                    )}>
                                        {msg.content}
                                    </div>
                                )}

                                <span className="text-[10px] text-gray-400 px-1">
                  {new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
                </span>
                            </div>
                        </div>
                    )
                })}
                {/* 底部定位點 */}
                <div ref={messagesEndRef} className="pb-2"/>
            </div>

            {/* 輸入框區：flex-none 固定高度，z-20 確保浮在最上層 */}
            <div className="flex-none border-t bg-white p-3 pb-safe z-20">
                {/* pb-safe 是為了避開 iPhone 底部橫條，如果沒有這 class，可以用 pb-6 或 pb-8 */}
                <form
                    onSubmit={handleSendMessage}
                    className="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-2 py-2 shadow-sm focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-200 transition-all"
                >
                    <Button type="button" size="icon" variant="ghost"
                            className="h-10 w-10 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-200 flex-shrink-0">
                        <ImageIcon className="h-5 w-5"/>
                    </Button>

                    <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="輸入訊息..."
                        className="flex-1 border-none bg-transparent shadow-none focus-visible:ring-0 text-base h-10"
                    />

                    <Button
                        type="submit"
                        size="icon"
                        className={cn(
                            "h-10 w-10 rounded-full transition-all duration-200 shadow-sm flex-shrink-0",
                            newMessage.trim() ? "bg-blue-600 hover:bg-blue-700 scale-100" : "bg-gray-200 text-gray-400 scale-90"
                        )}
                        disabled={!newMessage.trim()}
                    >
                        <Send className="h-5 w-5 ml-0.5"/>
                    </Button>
                </form>
            </div>
        </div>
    )
}
