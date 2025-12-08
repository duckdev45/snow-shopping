import {z} from 'zod'

export const productSchema = z.object({
    title: z.string().min(3, '標題請大於 3 個字').max(100, '標題太長了'),
    description: z.string().min(10, '描述至少 10 個字'),
    brand: z.string().min(1, "請選擇品牌"),
    price: z.coerce.number().min(1, '免費送我嗎？請輸入價格'),
    category: z.enum(
        [
            'snowboard',
            'ski',
            'boots',
            'goggles',
            'helmet',
            'apparel',
            'lift-ticket',
            'other'
        ],
        {
            errorMap: () => ({message: '請選擇一個分類'})
        }
    ),
    condition: z.enum(['brand_new', 'like_new', 'used', 'for_parts'], {
        errorMap: () => ({message: '請選擇商品狀況'})
    }),
    // 圖片我們在前端處理完上傳，這裡只收 URL 陣列
    images: z.array(z.string()).min(1, '請至少上傳一張照片')
})

export type ProductFormData = z.infer<typeof productSchema>
