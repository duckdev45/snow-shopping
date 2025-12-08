'use client'

import {TermsOfServiceDialog} from '@/components/layout/TermsOfServiceDialog'

export function SiteFooter() {
    return (
        <footer className='text-gray-400'>
            <div className='pt-2 pb-4 text-center text-[12px]'>
                <p>
                    &copy; {new Date().getFullYear()} 雪拼 Snow Shopping. All Rights
                    Reserved &nbsp; | &nbsp;
                    <TermsOfServiceDialog>
                        <a href='#' className='underline'>
                            服務條款 </a>
                    </TermsOfServiceDialog>
                </p>
            </div>
        </footer>
    )
}
