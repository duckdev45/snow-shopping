export function SiteFooter() {
  return (
    <footer className='text-gray-400'>
      <div className='pt-2 pb-4 text-center text-[12px]'>
        <p>
          本平台僅為雪友間二手交易之資訊交流空間，對於任何刊登商品之真實性、品質、合法性，本站一概不負責。請交易雙方務必自行查證與評估風險
          | &copy; {new Date().getFullYear()} 雪拼 Snow Shopping. All Rights
          Reserved.
        </p>
      </div>
    </footer>
  )
}
