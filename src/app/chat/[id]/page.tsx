import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { ChatWindow } from '@/components/chat/chat-window'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { Card, CardHeader } from '@/components/ui/card'
import ChatUnauthorized from '../ChatUnauthorized'

interface ChatPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function ChatPage({ params }: ChatPageProps) {
  const { id } = await params
  const supabase = await createClient()

  // 1. 驗證登入
  const {
    data: { user }
  } = await supabase.auth.getUser()
  if (!user) return <ChatUnauthorized />

  // 2. 驗證是否為房間成員，順便撈出「對方」是誰
  const { data: participant, error } = await supabase
    .from('conversation_participants')
    .select(
      `
      user_id,
      profiles (
        full_name,
        username,
        avatar_url
      )
    `
    )
    .eq('conversation_id', id)
    .neq('user_id', user.id)
    .single()

  if (error || !participant) {
    notFound()
  }

  // 處理 Supabase 回傳可能是陣列的問題
  const profileData = participant.profiles
  const otherUser = Array.isArray(profileData) ? profileData[0] : profileData

  const displayName =
    otherUser?.full_name || otherUser?.username || '未知使用者'
  const avatarFallback = displayName?.[0] || 'U'

  // 3. 撈取歷史訊息
  const { data: messages } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', id)
    .order('created_at', { ascending: true })

  return (
    // ✨ 外層容器：跟列表頁一樣的背景與置中
    <div className='flex min-h-screen items-center justify-center bg-gray-50/50 pt-26'>
      {/* ✨ 核心卡片：限制寬度與高度，模擬手機視窗 */}
      <Card className='flex h-[680px] w-full max-w-[400px] flex-col overflow-hidden rounded-3xl border-gray-200 bg-white shadow-2xl'>
        {/* --- 頂部導航欄 (App Header) --- */}
        <CardHeader className='z-10 flex-none gap-0 space-y-0 border-b bg-white/95 px-4 py-2 backdrop-blur'>
          <div className='flex items-center gap-3'>
            <Button
              variant='ghost'
              size='icon'
              asChild
              className='-ml-2 h-8 w-8 rounded-full text-gray-600 hover:bg-gray-100'>
              <Link href='/chat'>
                <ArrowLeft className='h-5 w-5' />
              </Link>
            </Button>

            {/* 對方資料 */}
            <div className='flex items-center gap-2.5'>
              <Avatar className='h-9 w-9 border border-gray-100'>
                <AvatarImage src={otherUser?.avatar_url} />
                <AvatarFallback className='bg-blue-50 text-xs font-bold text-blue-600'>
                  {avatarFallback}
                </AvatarFallback>
              </Avatar>

              <div className='flex flex-col'>
                <span className='text-sm leading-none font-bold text-gray-900'>
                  {displayName}
                </span>
                <span className='mt-0.5 flex items-center gap-1 text-[10px] font-medium text-green-600'>
                  <span className='inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-green-500'></span>
                  線上
                </span>
              </div>
            </div>
          </div>
        </CardHeader>

        {/* --- 聊天主視窗 (Client Component) --- */}
        <ChatWindow
          conversationId={id}
          currentUser={user}
          initialMessages={messages || []}
        />
      </Card>
    </div>
  )
}
