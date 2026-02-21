"use client";
import { useState } from "react";
import Link from "next/link";
import { ShoppingBag, Menu, X, Heart, Search } from "lucide-react";
import { MegaMenu } from "./MegaMenu";
import { InstantSearch } from "./InstantSearch";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/useCartStore";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
// import { CloutProgressBar } from "./CloutProgressBar"; // Unused

interface NavbarProps {
    user: User | null;
    clout?: number;
}

export const Navbar = ({ user, clout = 0 }: NavbarProps) => {
    const { items, toggleCart } = useCartStore();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const router = useRouter();

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    const handleLogout = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        router.refresh();
    };

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const query = formData.get("q");
        if (query) {
            router.push(`/search?query=${query}`);
            setIsSearchOpen(false);
        }
    };

    return (
        <>
            <div className="bg-rawr-black text-white text-xs md:text-sm font-bold uppercase tracking-widest relative overflow-hidden py-2 border-b-2 border-rawr-black z-[60]">
                <motion.div
                    className="flex whitespace-nowrap gap-8"
                    animate={{ x: [0, -1000] }}
                    transition={{ repeat: Infinity, ease: "linear", duration: 15 }}
                >
                    {[...Array(10)].map((_, i) => (
                        <span key={i} className="flex-shrink-0">🚀 FREE SHIPPING ON ORDERS LATER THAN $200 🚀 WEAR IT OR FEAR IT ☠️ LIMITED QUOTAS ☠️</span>
                    ))}
                </motion.div>
            </div>
            <nav className="w-full border-b-2 border-rawr-black bg-rawr-white sticky top-0 z-50">
                <div className="container mx-auto px-4 h-20 flex items-center justify-between">
                    {/* Logo (Left) */}
                    <Link href="/" className="text-4xl font-heading font-black tracking-tighter hover:text-rawr-red transition-colors flex-shrink-0">
                        RAWR
                    </Link>

                    {/* Desktop Nav (Center) */}
                    <div className="hidden md:flex flex-1 items-center justify-center gap-8 font-heading font-bold text-lg tracking-wide">
                        <div className="relative h-full flex items-center" onMouseEnter={() => setIsMegaMenuOpen(true)} onMouseLeave={() => setIsMegaMenuOpen(false)}>
                            <Link href="/shop" className="hover:underline decoration-2 underline-offset-4 decoration-rawr-red py-6">SHOP</Link>
                            <AnimatePresence>
                                {isMegaMenuOpen && <MegaMenu isOpen={isMegaMenuOpen} onClose={() => setIsMegaMenuOpen(false)} />}
                            </AnimatePresence>
                        </div>
                        <Link href="/drops" className="hover:underline decoration-2 underline-offset-4 decoration-rawr-red">DROPS</Link>
                        <Link href="/archive" className="hover:underline decoration-2 underline-offset-4 decoration-rawr-red text-rawr-red">THE VAULT</Link>
                        <Link href="/manifesto" className="hover:underline decoration-2 underline-offset-4 decoration-rawr-red">ABOUT US</Link>
                    </div>

                    {/* Right Side: Account, Search, Cart & Burger */}
                    <div className="flex items-center gap-4 flex-shrink-0">
                        <div className="hidden md:flex items-center gap-4 mr-4 border-r-2 border-gray-200 pr-4">
                            {/* Search Toggle */}
                            <div className="relative">
                                {isSearchOpen ? (
                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-80 z-50">
                                        <InstantSearch onClose={() => setIsSearchOpen(false)} />
                                    </div>
                                ) : (
                                    <button onClick={() => setIsSearchOpen(true)} className="hover:text-rawr-red transition-colors flex items-center">
                                        <Search className="w-6 h-6" />
                                    </button>
                                )}
                            </div>

                            {user ? (
                                <div className="flex items-center gap-4">
                                    <Link href="/account/wishlist" className="hover:text-rawr-red transition-colors" title="My Stash">
                                        <Heart className="w-6 h-6" />
                                    </Link>
                                    <Link href="/account" className="font-bold underline decoration-2 underline-offset-4 decoration-rawr-red text-xs hover:text-rawr-red uppercase tracking-widest pl-2 border-l-2 border-rawr-black">
                                        ACCOUNT
                                    </Link>
                                </div>
                            ) : (
                                <Link href="/login" className="hover:text-rawr-red transition-colors font-bold text-xs uppercase tracking-widest pl-2 border-l-2 border-rawr-black">LOGIN</Link>
                            )}
                        </div>
                        {/* Cart Button with Name Logic */}
                        <Button variant="default" className="relative group min-w-[120px]" onClick={toggleCart}>
                            <ShoppingBag className="w-5 h-5 mr-2" />
                            <span className="hidden md:inline uppercase font-black truncate">
                                CART ({items.length})
                            </span>
                            <span className="md:hidden">({items.length})</span>
                        </Button>

                        {/* Burger (Now on Right, Visible Desktop) */}
                        <Button variant="ghost" size="icon" onClick={toggleMobileMenu} className="hover:bg-transparent hover:text-rawr-red">
                            {isMobileMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
                        </Button>
                    </div>
                </div>
            </nav>

            {/* Mega Menu / Drawer Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: "100%" }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: "100%" }}
                        transition={{ type: "tween", duration: 0.3 }}
                        className="fixed inset-0 z-40 bg-black/95 text-white pt-24 px-4 overflow-y-auto"
                    >
                        <div className="container mx-auto">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 font-heading uppercase">
                                {/* Column 1: Categories */}
                                <div className="space-y-4">
                                    <h3 className="text-rawr-red font-black text-xl mb-6">Categories</h3>
                                    {["All New", "Dresses", "Tops", "Bottoms", "Lingerie", "Outerwear", "Shoes", "Accessories", "Clothing", "Plus"].map(item => (
                                        <Link key={item} href={`/shop?category=${item.toLowerCase()}`} onClick={toggleMobileMenu} className="block text-2xl font-bold hover:text-rawr-red hover:pl-2 transition-all">
                                            {item}
                                        </Link>
                                    ))}
                                </div>

                                {/* Column 2: Featured */}
                                <div className="space-y-4">
                                    <h3 className="text-rawr-red font-black text-xl mb-6">Featured</h3>
                                    {["Most Wanted", "Back In Stock", "Matching Separates", "Boots & Booties"].map(item => (
                                        <Link key={item} href={`/shop?collection=${item.toLowerCase().replace(/ /g, '-')}`} onClick={toggleMobileMenu} className="block text-2xl font-bold hover:text-rawr-red hover:pl-2 transition-all">
                                            {item}
                                        </Link>
                                    ))}
                                </div>

                                {/* Column 3: Brands/Other */}
                                <div className="space-y-4">
                                    <h3 className="text-rawr-red font-black text-xl mb-6">Menu</h3>
                                    <Link href="/shop" onClick={toggleMobileMenu} className="block text-2xl font-bold hover:text-rawr-red">Shop All</Link>
                                    <Link href="/drops" onClick={toggleMobileMenu} className="block text-2xl font-bold hover:text-rawr-red">Drops</Link>
                                    <Link href="/archive" onClick={toggleMobileMenu} className="block text-2xl font-bold hover:text-rawr-red text-rawr-red">The Vault</Link>
                                    <Link href="/manifesto" onClick={toggleMobileMenu} className="block text-2xl font-bold hover:text-rawr-red">Brand Story</Link>
                                    {user && <Link href="/account" onClick={toggleMobileMenu} className="block text-2xl font-bold hover:text-rawr-red">My Account</Link>}
                                </div>

                                {/* Column 4: Search/Actions */}
                                <div className="space-y-6">
                                    <InstantSearch onClose={toggleMobileMenu} />

                                    {!user && (
                                        <Link href="/login" onClick={toggleMobileMenu} className="inline-block bg-white text-black px-8 py-3 font-black text-xl hover:bg-rawr-red hover:text-white transition-colors">
                                            LOGIN / JOIN
                                        </Link>
                                    )}

                                    <div className="mt-12 text-sm text-gray-500 font-body normal-case">
                                        <p>© 2026 RAWR STORE.</p>
                                        <p>WEAR IT OR FEAR IT.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};
