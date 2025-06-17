export const fallbackLng = 'zh'
export const languages = [fallbackLng, 'en']
export const cookieName = 'i18next'

export function getOptions (lng = fallbackLng) {
  return {
    // debug: true, // 開發時可開啟，觀察 i18next 運作
    supportedLngs: languages,
    fallbackLng,
    lng,
  }
}