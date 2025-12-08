'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Settings } from 'lucide-react'

// 定義雪齡選項
const SNOW_EXP = ['滑雪菜鳥', '滑雪大神', '滑雪中毒', '雪場專業喝咖啡']

export function EditProfileDialog({ profile }: { profile: any }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  // 簡單用 state 控制表單，不一定要用 react-hook-form
  const [fullName, setFullName] = useState(profile?.full_name || '')
  const [exp, setExp] = useState(profile?.snow_experience || '滑雪菜鳥')

  const handleUpdate = async () => {
    setLoading(true)
    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: fullName,
        snow_experience: exp,
        updated_at: new Date().toISOString()
      })
      .eq('id', profile.id)

    setLoading(false)
    if (!error) {
      setOpen(false)
      router.refresh() // 重新整理頁面抓新資料
    } else {
      alert('更新失敗')
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='outline'>
          <Settings className='mr-2 h-4 w-4' />
          編輯資料
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>編輯個人檔案</DialogTitle>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='name' className='text-right'>
              顯示名稱
            </Label>
            <Input
              id='name'
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className='col-span-3'
            />
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='exp' className='text-right'>
              雪齡
            </Label>
            <Select value={exp} onValueChange={setExp}>
              <SelectTrigger className='col-span-3'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SNOW_EXP.map((e) => (
                  <SelectItem key={e} value={e}>
                    {e}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button type='submit' onClick={handleUpdate} disabled={loading}>
            {loading ? '儲存中...' : '儲存變更'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
