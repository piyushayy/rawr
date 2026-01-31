"use client";
import { useState } from "react";
import Link from "next/link";
import { ShoppingBag, Menu, X, Heart, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/useCartStore";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

interface NavbarProps {
    user: User | null;
}

export const Navbar = ({ user }: NavbarProps) => {
    const { items, toggleCart } = useCartStore();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
            <nav className="w-full border-b-2 border-rawr-black bg-rawr-white sticky top-0 z-50">
                <div className="container mx-auto px-4 h-20 flex items-center justify-between">
                    {/* Mobile Menu Trigger */}
                    <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleMobileMenu}>
                        <Menu className="w-6 h-6" />
                    </Button>

                    {/* Logo */}
                    <Link href="/" className="text-4xl font-heading font-black tracking-tighter hover:text-rawr-red transition-colors">
                        RAWR
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-6 font-heading font-bold text-lg tracking-wide">
                        <Link href="/shop" className="hover:underline decoration-2 underline-offset-4 decoration-rawr-red">SHOP</Link>
                        <Link href="/drops" className="hover:underline decoration-2 underline-offset-4 decoration-rawr-red">DROPS</Link>
                        <Link href="/community" className="hover:underline decoration-2 underline-offset-4 decoration-rawr-red">COMMUNITY</Link>

                        {/* Search Toggle */}
                        <div className="relative">
                            {isSearchOpen ? (
                                <form onSubmit={handleSearch} className="absolute right-0 top-1/2 -translate-y-1/2 bg-white border-2 border-rawr-black flex items-center w-64">
                                    <input
                                        name="q"
                                        autoFocus
                                        placeholder="SEARCH..."
                                        className="w-full p-2 outline-none font-body text-base bg-transparent"
                                        onBlur={() => setTimeout(() => setIsSearchOpen(false), 200)} // Delay to allow submit
                                    />
                                    <button type="submit" className="p-2 border-l-2 border-rawr-black hover:bg-gray-100">
                                        <Search className="w-4 h-4" />
                                    </button>
                                </form>
                            ) : (
                                <button onClick={() => setIsSearchOpen(true)} className="hover:text-rawr-red transition-colors flex items-center mt-1">
                                    <Search className="w-5 h-5" />
                                </button>
                            )}
                        </div>

                        {user ? (
                            <div className="flex items-center gap-4 border-l-2 border-rawr-black pl-6">
                                <Link href="/account/wishlist" className="hover:text-rawr-red transition-colors" title="My Stash">
                                    <Heart className="w-6 h-6" />
                                </Link>
                                <Link href="/account" className="hover:text-rawr-red transition-colors flex items-center gap-2">
                                    <span className="font-bold text-sm hidden lg:inline-block truncate max-w-[100px]">{user.email?.split('@')[0]}</span>
                                </Link>
                                <Button variant="ghost" size="sm" onClick={handleLogout} className="text-rawr-red hover:text-red-700 hover:bg-transparent font-bold">
                                    LOGOUT
                                </Button>
                            </div>
                        ) : (
                            <Link href="/login" className="hover:underline decoration-2 underline-offset-4 decoration-rawr-red border-l-2 border-rawr-black pl-6">LOGIN</Link>
                        )}
                    </div>

                    {/* Cart */}
                    <div className="flex items-center gap-2">
                        <Button variant="default" className="relative group" onClick={toggleCart}>
                            <ShoppingBag className="w-5 h-5 md:mr-2" />
                            <span className="hidden md:inline">CART ({items.length})</span>
                            <span className="md:hidden">({items.length})</span>
                        </Button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed inset-0 z-40 bg-rawr-white pt-24 px-4 md:hidden"
                    >
                        <div className="flex flex-col gap-8 text-center">
                            <form onSubmit={handleSearch} className="flex border-2 border-rawr-black">
                                <input name="q" placeholder="SEARCH ARCHIVE..." className="w-full p-4 font-bold uppercase outline-none" />
                                <button type="submit" className="p-4 bg-rawr-black text-white">
                                    <Search className="w-6 h-6" />
                                </button>
                            </form>

                            <Link href="/shop" className="text-4xl font-heading font-black uppercase hover:text-rawr-red" onClick={toggleMobileMenu}>Shop</Link>
                            <Link href="/drops" className="text-4xl font-heading font-black uppercase hover:text-rawr-red" onClick={toggleMobileMenu}>Drops</Link>
                            <Link href="/account" className="text-4xl font-heading font-black uppercase hover:text-rawr-red" onClick={toggleMobileMenu}>Account</Link>

                            {user ? (
                                <button className="text-4xl font-heading font-black uppercase hover:text-rawr-red" onClick={() => { handleLogout(); toggleMobileMenu(); }}>Logout</button>
                            ) : (
                                <Link href="/login" className="text-4xl font-heading font-black uppercase hover:text-rawr-red" onClick={toggleMobileMenu}>Login</Link>
                            )}
                            <button className="mt-8 text-xl font-bold uppercase underline flex items-center justify-center gap-2" onClick={toggleMobileMenu}>
                                <X className="w-6 h-6" /> Close
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};
