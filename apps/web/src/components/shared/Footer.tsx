import { CurrencySwitcher } from "./CurrencySwitcher";

export const Footer = () => {
    return (
        <footer className="w-full border-t-2 border-rawr-black bg-rawr-black text-rawr-white py-12">
            <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="col-span-1 md:col-span-2">
                    <h2 className="text-6xl font-heading font-black mb-4 tracking-tighter text-rawr-red">RAWR</h2>
                    <p className="font-body text-sm max-w-md text-gray-400">
                        WE DO NOT RESTOCK. WE DO NOT APOLOGIZE.
                        <br />
                        SCARCITY IS THE PRODUCT.
                    </p>
                </div>

                <div className="flex flex-col gap-4">
                    <h3 className="font-heading font-bold text-xl uppercase text-rawr-white">Help</h3>
                    <a href="/terms" className="font-body text-sm hover:text-rawr-red transition-colors">Terms</a>
                    <a href="/privacy" className="font-body text-sm hover:text-rawr-red transition-colors">Privacy</a>
                    <a href="/careers" className="font-body text-sm hover:text-rawr-red transition-colors">Careers</a>
                </div>

                <div className="flex flex-col gap-4">
                    <h3 className="font-heading font-bold text-xl uppercase text-rawr-white">Social</h3>
                    <a href="#" className="font-body text-sm hover:text-rawr-red transition-colors">Instagram</a>
                    <a href="#" className="font-body text-sm hover:text-rawr-red transition-colors">TikTok</a>
                </div>
            </div>
            <div className="border-t border-gray-800 mt-12 pt-8 text-center">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="font-body text-xs text-gray-500 uppercase">© {new Date().getFullYear()} RAWR STORE. ALL RIGHTS RESERVED.</p>
                    <CurrencySwitcher />
                </div>
            </div>
        </footer>
    );
};
