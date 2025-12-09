'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { randomUUID } from 'crypto'

export async function startConversationAction(
  sellerId: string,
  productId?: string
) {
  const supabase = await createClient()

  // 1. 驗身分
  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: '請先登入才能私訊喔！' }
  }

  if (user.id === sellerId) {
    return { error: '這是你自己的商品，不能跟自己聊天啦' }
  }

  let conversationId: string

  // 2. 找房間：檢查有無舊情
  // (如果 RPC 沒建立成功，這裡會報錯，我們用 try-catch 包起來保險一點)
  try {
    const { data: existingConversations } = await supabase.rpc(
      'find_conversation_between_users',
      {
        user1_id: user.id,
        user2_id: sellerId
      }
    )

    if (existingConversations && existingConversations.length > 0) {
      // 抓到了！直接用舊的
      conversationId = existingConversations[0].conversation_id
      console.log('Found existing conversation:', conversationId)

      // 直接跳轉，不執行後面的建立邏輯
      // (這裡不 return，讓它繼續跑下面的「傳送商品卡片」邏輯)
    } else {
      // 沒找到，準備建立新的
      throw new Error('No conversation found')
    }
  } catch (e) {
    // 3. 沒房間 (或 RPC 失敗) -> 建立新房間
    // ✨✨✨ 關鍵修改：自己產 ID ✨✨✨
    conversationId = randomUUID()
    console.log('Creating new conversation with ID:', conversationId)

    // A. 建立 Conversation (不使用 .select())
    const { error: createError } = await supabase
      .from('conversations')
      .insert({ id: conversationId }) // 直接指定 ID

    if (createError) {
      console.error('Create conv error:', createError)
      return { error: '建立聊天室失敗，請稍後再試' }
    }

    // B. 把兩個人抓進去 (Participants)
    const { error: joinError } = await supabase
      .from('conversation_participants')
      .insert([
        { conversation_id: conversationId, user_id: user.id },
        { conversation_id: conversationId, user_id: sellerId }
      ])

    if (joinError) {
      console.error('Join error:', joinError)
      return { error: '加入聊天室成員失敗' }
    }
  }

  // 4. 自動發送「商品卡片」
  if (productId) {
    const { data: product } = await supabase
      .from('products')
      .select('id, title, price, images, status')
      .eq('id', productId)
      .single()

    if (product) {
      const { error: msgError } = await supabase.from('messages').insert({
        conversation_id: conversationId,
        sender_id: user.id,
        content: `詢問商品：${product.title}`,
        message_type: 'product_card',
        metadata: {
          product_id: product.id,
          title: product.title,
          price: product.price,
          image: product.images?.[0] || null,
          status: product.status
        }
      })

      if (msgError) {
        console.error('Send card error:', msgError)
      } else {
        // 更新聊天室時間
        await supabase
          .from('conversations')
          .update({ updated_at: new Date().toISOString() })
          .eq('id', conversationId)
      }
    }
  }

  // 5. 導航到聊天室
  redirect(`/chat/${conversationId}`)
}
