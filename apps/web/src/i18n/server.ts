import { createInstance } from 'i18next'
import { initReactI18next } from 'react-i18next/initReactI18next'
import HttpBackend from 'i18next-http-backend'
import { getOptions } from './settings'

const initI18next = async (lng: string) => {
  const i18nInstance = createInstance()
  await i18nInstance
    .use(initReactI18next)
    .use(HttpBackend)
    .init(getOptions(lng))
  return i18nInstance
}

export async function useTranslation(lng: string) {
  const i18nextInstance = await initI18next(lng)
  return {
    t: i18nextInstance.getFixedT(lng),
    i18n: i18nextInstance
  }
}