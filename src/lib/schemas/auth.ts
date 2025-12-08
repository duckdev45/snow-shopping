import { z } from 'zod'

export const authSchema = z.object({
  email: z.string().email({ message: '請輸入有效的 Email' }),
  password: z.string().min(6, { message: '密碼至少要6個字' })
})

export type AuthFormData = z.infer<typeof authSchema>
