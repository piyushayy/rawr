
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ContactPage() {
    return (
        <div className="bg-rawr-white min-h-screen">
            <div className="bg-rawr-black text-white py-20 border-b-2 border-white">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-6xl font-heading font-black uppercase mb-4">
                        Contact Command
                    </h1>
                    <p className="text-xl text-gray-400 font-bold max-w-2xl mx-auto">
                        We are listening. Speak.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12 max-w-2xl">
                <form className="space-y-6 bg-white p-8 border-2 border-rawr-black shadow-[8px_8px_0px_0px_#050505]">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold uppercase">Name</label>
                            <Input placeholder="YOUR NAME" className="border-2 border-gray-200 bg-gray-50 focus:border-rawr-black" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold uppercase">Email</label>
                            <Input type="email" placeholder="EMAIL@ADDRESS.COM" className="border-2 border-gray-200 bg-gray-50 focus:border-rawr-black" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold uppercase">Subject</label>
                        <select className="w-full h-10 px-3 py-2 bg-gray-50 border-2 border-gray-200 rounded-md focus:outline-none focus:border-rawr-black text-sm">
                            <option>Order Inquiry</option>
                            <option>Returns/Exchange</option>
                            <option>Product Question</option>
                            <option>Other</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold uppercase">Message</label>
                        <Textarea
                            placeholder="Type your message here..."
                            className="min-h-[150px] border-2 border-gray-200 bg-gray-50 focus:border-rawr-black"
                        />
                    </div>

                    <Button className="w-full bg-rawr-black text-white hover:bg-rawr-red uppercase font-bold text-lg h-12">
                        Transmit Message
                    </Button>
                </form>

                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <div>
                        <h3 className="font-bold uppercase text-rawr-black">Email</h3>
                        <p className="text-gray-500">support@rawr.store</p>
                    </div>
                    <div>
                        <h3 className="font-bold uppercase text-rawr-black">HQ</h3>
                        <p className="text-gray-500">Los Angeles, CA</p>
                    </div>
                    <div>
                        <h3 className="font-bold uppercase text-rawr-black">Hours</h3>
                        <p className="text-gray-500">Mon-Fri: 9AM - 6PM PST</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
