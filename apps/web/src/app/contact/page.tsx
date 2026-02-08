
import { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
    title: "Contact Us | RAWR",
    description: "Get in touch with the team.",
};

export default function ContactPage() {
    return (
        <div className="bg-rawr-white min-h-screen py-20">
            <div className="container mx-auto px-4 max-w-4xl">
                <h1 className="text-5xl md:text-7xl font-heading font-black uppercase text-center mb-16 text-rawr-black">
                    Holla At Us
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Info */}
                    <div className="space-y-8">
                        <div className="bg-white border-2 border-rawr-black p-8 shadow-[8px_8px_0px_0px_#050505]">
                            <h2 className="text-2xl font-bold uppercase mb-6 flex items-center gap-2">
                                <MapPin className="text-rawr-red" /> HQ
                            </h2>
                            <p className="text-gray-600 font-medium">
                                RAWR Archive<br />
                                123 Streetwear Blvd<br />
                                Los Angeles, CA 90012<br />
                                Earth
                            </p>
                        </div>

                        <div className="bg-white border-2 border-rawr-black p-8 shadow-[8px_8px_0px_0px_#050505]">
                            <h2 className="text-2xl font-bold uppercase mb-6 flex items-center gap-2">
                                <Mail className="text-rawr-red" /> Email
                            </h2>
                            <p className="text-gray-600 font-medium mb-4">
                                For general inquiries, orders, or just to say pinned.
                            </p>
                            <a href="mailto:support@rawr.gg" className="text-xl font-bold underline decoration-rawr-red decoration-2 underline-offset-4 hover:text-rawr-red">
                                support@rawr.gg
                            </a>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="bg-rawr-black text-white p-8 border-2 border-rawr-black shadow-[8px_8px_0px_0px_#888888]">
                        <h2 className="text-2xl font-bold uppercase mb-6">Send a Message</h2>
                        <form className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold uppercase mb-2 text-gray-400">Name</label>
                                <input className="w-full bg-white/10 border border-white/20 p-3 outline-none focus:border-rawr-red text-white" placeholder="YOUR NAME" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold uppercase mb-2 text-gray-400">Email</label>
                                <input className="w-full bg-white/10 border border-white/20 p-3 outline-none focus:border-rawr-red text-white" placeholder="YOUR EMAIL" type="email" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold uppercase mb-2 text-gray-400">Subject</label>
                                <select className="w-full bg-white/10 border border-white/20 p-3 outline-none focus:border-rawr-red text-white">
                                    <option>Order Issue</option>
                                    <option>Collaboration</option>
                                    <option>Just saying hi</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold uppercase mb-2 text-gray-400">Message</label>
                                <textarea className="w-full bg-white/10 border border-white/20 p-3 outline-none focus:border-rawr-red text-white h-32" placeholder="TYPE SHIT..." />
                            </div>
                            <Button className="w-full bg-rawr-red hover:bg-red-600 text-white font-bold uppercase tracking-widest py-6">
                                Send Message
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
