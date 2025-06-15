import type {Metadata} from "next";
import {Inter, Noto_Sans_TC} from "next/font/google";
import "./globals.css";
import {SiteHeader} from "@/app/components/layout/SiteHeader";
import {SiteFooter} from "@/app/components/layout/SiteFooter";

const inter = Inter({subsets: ["latin"], variable: '--font-inter'});
const notoSansTC = Noto_Sans_TC({subsets: ["latin"], weight: ["400", "500", "700"], variable: '--font-noto-sans-tc'});

export const metadata: Metadata = {
    title: "雪拼 Snow Shopping",
    description: "斷捨離你的雪季回憶，為裝備找到下一段旅程。",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="zh-Hant" className={`${inter.variable} ${notoSansTC.variable}`}>
        <body className="font-sans">
        <SiteHeader/>
        <main>{children}</main>
        <SiteFooter/>
        </body>
        </html>
    );
}
