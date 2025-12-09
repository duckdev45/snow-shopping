import {notFound} from 'next/navigation'
import Link from 'next/link'
import {createClient} from '@/lib/supabase/server'
import {ChatWindow} from '@/components/chat/chat-window'
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar'
import {Button} from '@/components/ui/button'
import {ArrowLeft} from 'lucide-react'
import {Card, CardHeader} from '@/components/ui/card'
import ChatUnauthorized from '../ChatUnauthorized'

interface ChatPageProps {
    params: Promise<{
        id: string
    }>
}

export default async function ChatPage({params}: ChatPageProps) {
    const {id} = await params
    const supabase = await createClient()

    // 1. 驗證登入
    const {
        data: {user}
    } = await supabase.auth.getUser()
    if (!user) return <ChatUnauthorized/>

    // 2. 驗證是否為房間成員，順便撈出「對方」是誰
    const {data: participant, error} = await supabase
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
    const {data: messages} = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', id)
        .order('created_at', {ascending: true})

    return (
        // ✨✨✨ 關鍵修改：RWD 佈局鎖定 ✨✨✨
        // Mobile: fixed + inset-0 + top-[72px]。直接釘死在畫面上，高度鎖定，不再跟隨 Body 捲動。
        // Desktop: 恢復成 flex 置中佈局
        <div
            className="fixed inset-0 top-[72px] bg-white md:static md:top-0 md:flex md:min-h-screen md:items-center md:justify-center md:bg-gray-50/50 md:pt-24 md:pb-10 md:px-4">

            {/* 卡片本體 */}
            <Card
                className="flex h-full w-full flex-col border-0 shadow-none rounded-none md:h-[650px] md:max-w-[380px] md:border md:border-gray-200 md:shadow-2xl md:rounded-3xl overflow-hidden bg-white">

                {/* Header */}
                <CardHeader className="flex-none border-b px-4 py-3 bg-white/95 backdrop-blur z-10 space-y-0">
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="icon" asChild
                                className="h-8 w-8 rounded-full -ml-2 hover:bg-gray-100 text-gray-600">
                            <Link href="/chat">
                                <ArrowLeft className="h-5 w-5"/>
                            </Link>
                        </Button>

                        <div className="flex items-center gap-2.5">
                            <Avatar className="h-9 w-9 border border-gray-100">
                                <AvatarImage src={otherUser?.avatar_url}/>
                                <AvatarFallback className="bg-blue-50 text-blue-600 font-bold text-xs">
                                    {avatarFallback}
                                </AvatarFallback>
                            </Avatar>

                            <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-900 leading-none">
                        {displayName}
                    </span>
                                <span className="text-[10px] text-green-600 font-medium flex items-center gap-1 mt-0.5">
                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></span>
                        線上
                    </span>
                            </div>
                        </div>
                    </div>
                </CardHeader>

                {/* 內容區：讓 ChatWindow 填滿剩下的高度 */}
                <div className="flex-1 overflow-hidden flex flex-col relative">
                    <ChatWindow
                        conversationId={id}
                        currentUser={user}
                        initialMessages={messages || []}
                    />
                </div>
            </Card>
        </div>
    )
}
