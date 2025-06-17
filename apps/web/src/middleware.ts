import { NextRequest, NextResponse } from 'next/server'
import { fallbackLng, languages } from '@/i18n/settings'

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname

  const pathnameIsMissingLocale = languages.every(
      (loc) => !pathname.startsWith(`/${loc}/`) && pathname !== `/${loc}`
  )

  // 如果 URL 中缺少語系前綴
  if (pathnameIsMissingLocale) {
    // 我們要重導向到預設語系的路徑
    // 確保這一行是使用 ` (反引號) 包起來的樣板字串
    return NextResponse.redirect(
        new URL(`/${fallbackLng}${pathname}`, req.url)
    )
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // 跳過 Next.js 內部路徑、API、和包含「點」（.）的靜態檔案
    '/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js|.*\\..*).*)'
  ]
}