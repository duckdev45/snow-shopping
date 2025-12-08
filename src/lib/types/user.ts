import { z } from 'zod'

export const UserSchema = z.object({
  id: z.string().cuid(),
  email: z.string().email({ message: 'Email 格式錯誤' }),
  name: z.string().min(2, { message: '名字太短' }),
  createdAt: z.date()
})

export type User = z.infer<typeof UserSchema>
