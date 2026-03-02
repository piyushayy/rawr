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
              <p className="text-gray-600 font-medium whitespace-pre-line leading-relaxed">
                RAWR Archive
                New Delhi, India
                Earth
              </p>
            </div>

            <div className="bg-white border-2 border-rawr-black p-8 shadow-[8px_8px_0px_0px_#050505] space-y-6">
              <div>
                <h2 className="text-2xl font-bold uppercase mb-2 flex items-center gap-2">
                  <Mail className="text-rawr-red" /> Email
                </h2>
                <a
                  href="mailto:supportrawr@gmail.com"
                  className="text-lg font-bold underline decoration-rawr-red decoration-2 underline-offset-4 hover:text-rawr-red"
                >
                  supportrawr@gmail.com
                </a>
              </div>

              <div>
                <h2 className="text-2xl font-bold uppercase mb-2 flex items-center gap-2">
                  <Phone className="text-rawr-red" /> Phone
                </h2>
                <p className="text-lg font-bold">9911390066</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-rawr-black text-white p-8 border-2 border-rawr-black shadow-[8px_8px_0px_0px_#888888]">
            <h2 className="text-2xl font-bold uppercase mb-6">
              Send a Message
            </h2>
            {/* To hook up Google Forms, replace YOUR_GOOGLE_FORM_URL and add the correct 'name' attributes (e.g. entry.12345) to input fields */}
            <form action="YOUR_GOOGLE_FORM_URL" method="POST" target="_blank" className="space-y-4">
              <div>
                <label className="block text-sm font-bold uppercase mb-2 text-gray-400">
                  Name
                </label>
                <input
                  name="entry.123456789" // Replace with real Google Form entry ID
                  required
                  className="w-full bg-white/10 border border-white/20 p-3 outline-none focus:border-rawr-red text-white"
                  placeholder="YOUR NAME"
                />
              </div>
              <div>
                <label className="block text-sm font-bold uppercase mb-2 text-gray-400">
                  Email
                </label>
                <input
                  name="entry.987654321" // Replace with real Google Form entry ID
                  required
                  className="w-full bg-white/10 border border-white/20 p-3 outline-none focus:border-rawr-red text-white"
                  placeholder="YOUR EMAIL"
                  type="email"
                />
              </div>
              <div>
                <label className="block text-sm font-bold uppercase mb-2 text-gray-400">
                  Message
                </label>
                <textarea
                  name="entry.555555555" // Replace with real Google Form entry ID
                  required
                  className="w-full bg-white/10 border border-white/20 p-3 outline-none focus:border-rawr-red text-white h-32"
                  placeholder="Tell us what's up..."
                />
              </div>
              <Button type="submit" className="w-full bg-rawr-red hover:bg-red-600 text-white font-bold uppercase tracking-widest py-6">
                Submit via Google Forms
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
