'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import React from 'react'

export function TermsOfServiceDialog({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>服務條款</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          本平台僅為雪友間二手交易之資訊交流空間，對於任何刊登商品之真實性、品質、合法性，本站一概不負責。請交易雙方務必自行查證與評估風險。
        </DialogDescription>
        <DialogFooter>
          <DialogClose asChild>
            <Button type='button'>確定</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
