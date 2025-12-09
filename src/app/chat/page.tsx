import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { MessageCircle, ArrowLeft, ChevronRight } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { zhTW } from 'date-fns/locale'
import { Button } from '@/components/ui/button'

export default async function ChatListPage() {
  const supabase = await createClient()

  // 1. 驗證登入
  const {
    data: { user }
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // 2. 撈取所有「我參與的」聊天室
  const { data: conversations, error } = await supabase
    .from('conversations')
    .select(
      `
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
    `
    )
    .order('updated_at', { ascending: false })
    .limit(1, { foreignTable: 'messages' })
    .order('created_at', { foreignTable: 'messages', ascending: false })

  if (error) {
    return <div className='p-10 text-center'>載入失敗，請稍後再試</div>
  }

  return (
    // ✨ 修改 1: 縮窄容器寬度 (max-w-lg)，並增加頂部留白
    <div className='container mx-auto min-h-screen max-w-lg px-4 pt-28 pb-20'>
      {/* ✨ 修改 2: 新增標題導航列 */}
      <div className='mb-8 flex items-center gap-4'>
        <Button
          variant='ghost'
          size='icon'
          asChild
          className='-ml-2 rounded-full hover:bg-gray-100'>
          <Link href='/'>
            <ArrowLeft className='h-6 w-6 text-gray-700' />
          </Link>
        </Button>
        <h1 className='text-2xl font-bold tracking-tight text-gray-900'>
          我的訊息
        </h1>
      </div>

      <div className='flex flex-col gap-3'>
        {conversations && conversations.length > 0 ? (
          conversations.map((room) => {
            // A. 找出「對方」是誰
            const otherParticipant = room.participants?.find(
              (p: any) => p.user_id !== user.id
            )
            const profileData = otherParticipant?.profiles
            const otherUser = Array.isArray(profileData)
              ? profileData[0]
              : profileData

            // 顯示名稱與頭像
            const displayName =
              otherUser?.full_name || otherUser?.username || '未知使用者'
            const avatarFallback = displayName?.[0] || 'U'

            // B. 處理最新訊息預覽
            const lastMsg = room.messages?.[0]
            const isUnread =
              lastMsg && !lastMsg.is_read && lastMsg.sender_id !== user.id

            return (
              <Link
                key={room.id}
                href={`/chat/${room.id}`}
                // ✨ 修改 3: 卡片樣式優化 (更圓潤、陰影、懸浮效果)
                className='group relative flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98]'>
                {/* 未讀紅點 (絕對定位在左上角，像 App icon badge) */}
                {isUnread && (
                  <span className='absolute top-3 right-3 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white'></span>
                )}

                {/* 頭像 */}
                <Avatar className='h-14 w-14 border-2 border-white shadow-sm'>
                  <AvatarImage src={otherUser?.avatar_url} />
                  <AvatarFallback className='bg-gradient-to-br from-blue-50 to-blue-100 font-bold text-blue-600'>
                    {avatarFallback}
                  </AvatarFallback>
                </Avatar>

                {/* 內容區 */}
                <div className='min-w-0 flex-1'>
                  {' '}
                  {/* min-w-0 確保 truncate 生效 */}
                  <div className='mb-1 flex items-baseline justify-between'>
                    <h3 className='truncate text-[15px] font-bold text-gray-900'>
                      {displayName}
                    </h3>

                    {/* 時間 */}
                    {lastMsg && (
                      <span className='ml-2 flex-shrink-0 text-xs font-medium text-gray-400'>
                        {formatDistanceToNow(new Date(lastMsg.created_at), {
                          addSuffix: false, // 拿掉 "前" 字比較簡潔
                          locale: zhTW
                        }).replace('大約 ', '')}
                      </span>
                    )}
                  </div>
                  <p
                    className={`truncate pr-4 text-sm ${isUnread ? 'font-bold text-gray-900' : 'text-gray-500'}`}>
                    {lastMsg ? (
                      lastMsg.message_type === 'product_card' ? (
                        <span className='flex items-center gap-1.5 text-blue-600'>
                          <MessageCircle className='h-3.5 w-3.5' />
                          詢問商品
                        </span>
                      ) : (
                        <span>
                          {lastMsg.sender_id === user.id && (
                            <span className='text-gray-400'>你：</span>
                          )}
                          {lastMsg.content}
                        </span>
                      )
                    ) : (
                      <span className='text-gray-300 italic'>
                        開始新的對話...
                      </span>
                    )}
                  </p>
                </div>

                {/* 右箭頭 (引導視覺) */}
                <ChevronRight className='-ml-2 h-5 w-5 text-gray-300 opacity-0 transition-opacity group-hover:opacity-100' />
              </Link>
            )
          })
        ) : (
          <div className='flex flex-col items-center justify-center py-24 text-center'>
            <div className='mb-6 rounded-full bg-gray-50 p-6'>
              <MessageCircle className='h-12 w-12 text-gray-300' />
            </div>
            <h3 className='text-lg font-bold text-gray-900'>還沒有訊息</h3>
            <p className='mx-auto mt-2 max-w-xs text-sm leading-relaxed text-gray-500'>
              看到喜歡的裝備嗎？
              <br />
              直接私訊賣家，開啟你的第一筆交易吧！
            </p>
            <Button
              asChild
              className='mt-8 rounded-full px-8 shadow-lg shadow-blue-100'
              variant='default'>
              <Link href='/browse'>去逛逛裝備</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
