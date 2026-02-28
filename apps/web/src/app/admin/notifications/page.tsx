"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Send, Users, ShieldAlert } from "lucide-react";
import { sendBroadcast } from "./actions";

export default function NotificationsPage() {
  const [isLoading, setIsLoading] = useState(false);

  // Quick blast templates
  const templates = [
    {
      title: "Drop is Live",
      subject: "THE DROP IS OPEN 🚨",
      body: "It's live. Go get it before it's gone.\n\n[Link]",
    },
    {
      title: "Restock",
      subject: "RESTOCK ALERT ⚡",
      body: "We just added new heat to the site. Check it out.",
    },
    {
      title: "Newsletter",
      subject: "WEEKLY REPORT 📜",
      body: "Here is what we found this week...",
    },
  ];

  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [segment, setSegment] = useState("all");

  async function handleSend() {
    if (!subject || !body) return toast.error("Fill in the fields, genius.");

    setIsLoading(true);
    const res = await sendBroadcast(segment, subject, body);
    setIsLoading(false);

    if (res?.error) toast.error(res.error);
    if (res?.success) toast.success(`Sent to ${res.count} users.`);
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-heading font-black uppercase mb-8 flex items-center gap-4">
        <Send className="w-8 h-8 text-rawr-red" /> Broadcast Station
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Templates */}
        <div className="space-y-4">
          <h3 className="font-bold uppercase text-gray-500 text-sm">
            Templates
          </h3>
          {templates.map((t, i) => (
            <div
              key={i}
              onClick={() => {
                setSubject(t.subject);
                setBody(t.body);
              }}
              className="bg-white p-4 border border-gray-200 hover:border-rawr-black cursor-pointer transition-colors shadow-sm"
            >
              <div className="font-bold uppercase text-sm mb-1">{t.title}</div>
              <div className="text-xs text-gray-500 truncate">{t.subject}</div>
            </div>
          ))}

          <div className="bg-yellow-50 p-4 border border-yellow-200 mt-8">
            <div className="flex items-center gap-2 text-yellow-800 font-bold uppercase mb-2">
              <ShieldAlert className="w-4 h-4" /> Warning
            </div>
            <p className="text-xs text-yellow-800 leading-relaxed">
              This sends an actual email to REAL users via Resend. Don't spam.
              Proceed with caution.
            </p>
          </div>
        </div>

        {/* Composer */}
        <div className="md:col-span-2 bg-white border border-gray-200 p-8 shadow-sm space-y-6">
          <div>
            <label className="block text-sm font-bold uppercase mb-2">
              Target Audience
            </label>
            <div className="flex gap-2">
              {["all", "elite", "members"].map((s) => (
                <button
                  key={s}
                  onClick={() => setSegment(s)}
                  className={`px-4 py-2 border uppercase font-bold text-xs ${segment === s ? "bg-rawr-black text-white border-rawr-black" : "bg-gray-100 text-gray-500 border-gray-200"}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold uppercase mb-2">
              Subject Line
            </label>
            <Input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="font-bold"
              placeholder="URGENT: DROP LIVE"
            />
          </div>

          <div>
            <label className="block text-sm font-bold uppercase mb-2">
              Email Body (HTML Supported)
            </label>
            <Textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="h-64 font-mono text-sm"
              placeholder="Write your manifesto here..."
            />
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
            <div className="text-xs text-gray-400 font-mono">
              READY TO TRANSMIT
            </div>
            <Button
              onClick={handleSend}
              disabled={isLoading}
              className="bg-rawr-red hover:bg-red-600 text-white font-bold uppercase px-8"
            >
              {isLoading ? "Transmitting..." : "Send Blast"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
