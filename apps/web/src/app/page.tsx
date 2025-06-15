import { CategoriesSection } from "./components/home/CategoriesSection";
import { HeroSection } from "./components/home/HeroSection";
import { LatestListingsSection } from "./components/home/LatestListingsSection";

export default function HomePage() {
    return (
        <>
            <HeroSection />
            <CategoriesSection />
            <LatestListingsSection />
            <CallToActionSection />
        </>
    );
}

function CallToActionSection() {
    return (
        <section className="bg-blue-700">
            <div className="container mx-auto px-4 lg:px-6 py-16 text-center">
                <h2 className="text-3xl font-bold text-white mb-4">有閒置的裝備嗎？</h2>
                <p className="text-blue-200 text-lg mb-8 max-w-xl mx-auto">別讓它們在角落積灰塵！拍照、上傳、訂個價，三分鐘就能為你的舊愛找到新主人。</p>
                <button className="px-10 py-4 text-lg font-bold text-blue-700 bg-white hover:bg-blue-50 rounded-full transition-colors shadow-2xl">
                    立即免費刊登
                </button>
            </div>
        </section>
    );
}
