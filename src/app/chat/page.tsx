import {createClient} from '@/lib/supabase/server'
import Link from 'next/link'
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar'
import {MessageCircle, ArrowLeft, ChevronRight} from 'lucide-react'
import {formatDistanceToNow} from 'date-fns'
import {zhTW} from 'date-fns/locale'
import {Button} from '@/components/ui/button'
import {Card, CardHeader, CardTitle, CardContent} from '@/components/ui/card'
import ChatUnauthorized from './ChatUnauthorized'

export default async function ChatListPage() {
    const supabase = await createClient()

    // 1. 驗證登入
    const {data: {user}} = await supabase.auth.getUser()
    if (!user) return <ChatUnauthorized />

    // 2. 撈取所有「我參與的」聊天室
    const {data: conversations, error} = await supabase
        .from('conversations')
        .select(`
      id,
      updated_at,
      participants:conversation_participants(
        user_id,
        profiles(full_name, username, avatar_url)
      ),
      messages(
        content,
        message_type,
        created_at,
        is_read,
        sender_id
      )
    `)
        .order('updated_at', {ascending: false})
        .limit(1, {foreignTable: 'messages'})
        .order('created_at', {foreignTable: 'messages', ascending: false})

    if (error) {
        return <div className="p-10 text-center">載入失敗，請稍後再試</div>
    }

    return (
        // ✨ 外層容器：
        // Mobile: 滿版高度，只有 pt-20 避開 Header
        // Desktop (md): 變成置中佈局，加上背景色
        <div
            className="flex min-h-screen flex-col bg-white pt-20 md:items-center md:justify-center md:bg-gray-50/50 md:pb-10 md:px-4">

            {/* ✨ 核心卡片：
          Mobile: 寬度 100% (w-full), 去除邊框/陰影/圓角, 高度自動填滿 (flex-1)
          Desktop (md): 限制寬度 380px, 固定高度 650px, 加回漂亮的邊框陰影圓角
      */}
            <Card
                className="flex flex-1 flex-col w-full border-0 shadow-none rounded-none md:max-w-[380px] md:h-[650px] md:flex-none md:border md:border-gray-200 md:shadow-2xl md:rounded-3xl overflow-hidden bg-white">

                {/* 卡片標題列 */}
                <CardHeader className="flex-none border-b px-4 py-3 bg-white z-10 sticky top-0">
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="icon" asChild
                                className="h-8 w-8 rounded-full -ml-2 hover:bg-gray-100">
                            <Link href="/">
                                <ArrowLeft className="h-5 w-5 text-gray-600"/>
                            </Link>
                        </Button>
                        <CardTitle className="text-base font-bold text-gray-800 tracking-wide">
                            我的訊息 ({conversations?.length || 0})
                        </CardTitle>
                    </div>
                </CardHeader>

                {/* 卡片內容區 */}
                <CardContent className="flex-1 overflow-y-auto p-0 bg-white md:bg-gray-50/30">
                    {conversations && conversations.length > 0 ? (
                        <div className="divide-y divide-gray-100">
                            {conversations.map((room) => {
                                const otherParticipant = room.participants?.find(
                                    (p: any) => p.user_id !== user.id
                                )
                                const profileData = otherParticipant?.profiles
                                const otherUser = Array.isArray(profileData) ? profileData[0] : profileData

                                const displayName = otherUser?.full_name || otherUser?.username || '未知使用者'
                                const avatarFallback = displayName?.[0] || 'U'

                                const lastMsg = room.messages?.[0]
                                const isUnread = lastMsg && !lastMsg.is_read && lastMsg.sender_id !== user.id

                                return (
                                    <Link
                                        key={room.id}
                                        href={`/chat/${room.id}`}
                                        className="group relative flex items-center gap-3 p-4 transition-all hover:bg-gray-50 active:bg-gray-100"
                                    >
                                        {/* 未讀紅點 */}
                                        {isUnread && (
                                            <span
                                                className="absolute top-4 right-4 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white"></span>
                                        )}

                                        {/* 頭像 */}
                                        <Avatar className="h-12 w-12 border border-gray-100 flex-shrink-0">
                                            <AvatarImage src={otherUser?.avatar_url}/>
                                            <AvatarFallback className="bg-blue-50 text-blue-600 font-bold">
                                                {avatarFallback}
                                            </AvatarFallback>
                                        </Avatar>

                                        {/* 內容區 */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-baseline mb-0.5">
                                                <h3 className="text-sm font-bold text-gray-900 truncate pr-2">
                                                    {displayName}
                                                </h3>
                                                {lastMsg && (
                                                    <span className="text-[10px] text-gray-400 flex-shrink-0">
                            {formatDistanceToNow(new Date(lastMsg.created_at), {
                                addSuffix: false,
                                locale: zhTW,
                            }).replace('大約 ', '')}
                          </span>
                                                )}
                                            </div>

                                            <p className={`truncate text-xs ${isUnread ? 'font-bold text-gray-900' : 'text-gray-500'}`}>
                                                {lastMsg ? (
                                                    lastMsg.message_type === 'product_card' ? (
                                                        <span className="flex items-center gap-1 text-blue-600">
                              <MessageCircle className="h-3 w-3"/>
                              詢問商品
                            </span>
                                                    ) : (
                                                        <span>
                              {lastMsg.sender_id === user.id && '你：'}
                                                            {lastMsg.content}
                            </span>
                                                    )
                                                ) : (
                                                    <span className="text-gray-300 italic">新對話</span>
                                                )}
                                            </p>
                                        </div>

                                        <ChevronRight className="h-4 w-4 text-gray-300"/>
                                    </Link>
                                )
                            })}
                        </div>
                    ) : (
                        // 空狀態
                        <div className="flex h-full flex-col items-center justify-center text-center p-6">
                            <div className="mb-4 rounded-full bg-gray-50 p-4">
                                <MessageCircle className="h-8 w-8 text-gray-300"/>
                            </div>
                            <p className="text-sm text-gray-500">
                                目前沒有訊息<br/>快去私訊賣家吧！
                            </p>
                            <Button asChild size="sm" className="mt-6 rounded-full px-6" variant="outline">
                                <Link href="/browse">去逛逛</Link>
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}