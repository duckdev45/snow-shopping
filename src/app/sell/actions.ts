'use server'

import {createClient} from '@/lib/supabase/server'
import {productSchema, type ProductFormData} from '@/lib/schemas/product'
import {revalidatePath} from 'next/cache'

// 建立新商品
export async function createProductAction(data: ProductFormData) {
    const supabase = await createClient()

    // 1. 確認登入者是誰
    const {
        data: {user}
    } = await supabase.auth.getUser()
    if (!user) {
        return {success: false, error: '請先登入'}
    }

    // 2. 後端再驗證一次資料 (Zod)
    const result = productSchema.safeParse(data)
    if (!result.success) {
        return {success: false, error: '資料格式錯誤'}
    }

    // 3. 寫入資料庫
    const {data: product, error} = await supabase
        .from('products')
        .insert({
            seller_id: user.id,
            title: result.data.title,
            description: result.data.description,
            price: result.data.price,
            category: result.data.category,
            condition: result.data.condition,
            images: result.data.images,
            status: 'active', // 預設上架中
            brand: result.data.brand,
            location: result.data.location,
        })
        .select()
        .single()

    if (error) {
        console.error('Insert Error:', error)
        return {success: false, error: '資料庫寫入失敗'}
    }

    // 4. 回傳成功 ID
    return {success: true, id: product.id}
}

// 更新商品資料
export async function updateProductAction(
    productId: string,
    data: ProductFormData
) {
    const supabase = await createClient()

    // 1. 確認登入者
    const {
        data: {user}
    } = await supabase.auth.getUser()
    if (!user) {
        return {success: false, error: '請先登入'}
    }

    // 2. 驗證資料格式
    const result = productSchema.safeParse(data)
    if (!result.success) {
        return {success: false, error: '資料格式錯誤'}
    }

    // 3. 執行更新 (Supabase RLS 會確保只能改自己的)
    const {error} = await supabase
        .from('products')
        .update({
            title: result.data.title,
            description: result.data.description,
            price: result.data.price,
            category: result.data.category,
            condition: result.data.condition,
            images: result.data.images,
            brand: result.data.brand,
            location: result.data.location,
            updated_at: new Date().toISOString() // 更新時間
        })
        .eq('id', productId)
        .eq('seller_id', user.id) // 再次確保是本人

    if (error) {
        console.error('Update Error:', error)
        return {success: false, error: '更新失敗'}
    }

    return {success: true, id: productId}
}

// 下架商品 (soft delete)
export async function deactivateProductAction(productId: string) {
    const supabase = await createClient()

    const {
        data: {user}
    } = await supabase.auth.getUser()

    if (!user) {
        return {success: false, error: '請先登入'}
    }

    // 執行更新：只改 status，不做 DELETE
    // 加上 eq('seller_id', user.id) 是最基本的資安，防止別人透過 API 亂刪你的商品
    const {error} = await supabase
        .from('products')
        .update({
            status: 'sold',
            updated_at: new Date().toISOString()
        })
        .eq('id', productId)
        .eq('seller_id', user.id)

    if (error) {
        console.error('Deactivate Error:', error)
        return {success: false, error: '下架失敗'}
    }

    // 強制讓 Profile 頁面和 Browse 頁面重新抓資料
    revalidatePath('/profile')
    revalidatePath('/browse')
    revalidatePath(`/products/${productId}`)

    return {success: true}
}
