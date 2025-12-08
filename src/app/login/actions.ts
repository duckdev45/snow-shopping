'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { authSchema, type AuthFormData } from '@/lib/schemas/auth'

export async function login(data: AuthFormData) {
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    // 這裡可以直接 throw 或是回傳 error object 讓前端接
    return { error: error.message }
  }

  redirect('/')
}

export async function signup(data: AuthFormData) {
  const supabase = await createClient()

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    return { error: error.message }
  }

  // 註冊成功後，通常需要驗證信，這裡看你的設定
  // 如果 Supabase 沒開 "Confirm email"，就會直接登入
  redirect('/')
}
