'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function toggleFavoriteAction(
  productId: string,
  pathToRevalidate?: string
) {
  const supabase = await createClient()

  // 檢查登入
  const {
    data: { user }
  } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: '請先登入' }
  }

  // 檢查是否已經收藏
  const { data: existing } = await supabase
    .from('favorites')
    .select('*')
    .eq('user_id', user.id)
    .eq('product_id', productId)
    .single()

  let isFavorited: boolean

  if (existing) {
    // A. 如果有 -> 刪除 (取消收藏)
    await supabase
      .from('favorites')
      .delete()
      .eq('user_id', user.id)
      .eq('product_id', productId)
    isFavorited = false
  } else {
    // B. 如果沒有 -> 新增 (加入收藏)
    await supabase.from('favorites').insert({
      user_id: user.id,
      product_id: productId
    })
    isFavorited = true
  }

  // 更新快取 (讓愛心變色)
  if (pathToRevalidate) {
    revalidatePath(pathToRevalidate)
  }
  revalidatePath('/profile') // Profile 頁面的收藏列表也要更新

  return { success: true, isFavorited }
}
