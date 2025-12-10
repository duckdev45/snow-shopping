import {z} from 'zod'

export const productSchema = z
    .object({
        title: z.string().min(3, '標題請大於 3 個字').max(100, '標題太長了'),
        description: z.string().min(10, '描述至少 10 個字'),
        brand: z.string().optional().nullable(), // 設為可選，透過 superRefine 條件式驗證
        price: z.coerce.number().min(1, '免費送嗎？請輸入價格'),
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
        condition: z
            .enum(['brand_new', 'like_new', 'used', 'for_parts'], {
                errorMap: () => ({message: '請選擇商品狀況'})
            })
            .optional()
            .nullable(), // 設為可選，透過 superRefine 條件式驗證
        images: z.array(z.string()).min(1, '請至少上傳一張照片'),
        location: z.string().min(1, '請選擇所在位置'),
        ski_resort: z.string().optional().nullable(), // 雪場欄位
        agreeTerms: z.literal(true, {
            errorMap: () => ({message: "您必須同意條款才能刊登"}),
        }),
    })
    .superRefine((data, ctx) => {
        if (data.category === 'lift-ticket') {
            // 如果是纜車票，ski_resort 必須有值
            if (!data.ski_resort) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: '請選擇雪場',
                    path: ['ski_resort']
                })
            }
            // 纜車票不應該有 condition 和 brand
            if (data.condition) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: '纜車票不需選擇裝備狀況',
                    path: ['condition']
                })
            }
            if (data.brand) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: '纜車票不需選擇品牌',
                    path: ['brand']
                })
            }
        } else {
            // 如果不是纜車票，condition 和 brand 必須有值
            if (!data.condition) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: '請選擇商品狀況',
                    path: ['condition']
                })
            }
            if (!data.brand) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: '請選擇品牌',
                    path: ['brand']
                })
            }
            // 非纜車票不應該有 ski_resort
            if (data.ski_resort) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: '此分類不需選擇雪場',
                    path: ['ski_resort']
                })
            }
        }
    })

export type ProductFormData = z.infer<typeof productSchema>
