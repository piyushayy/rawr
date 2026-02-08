
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Timer, Save } from "lucide-react";
import { updateDrop, getActiveDrop } from "./actions";

export default function DropsAdminPage() {
    const [title, setTitle] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("12:00");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        getActiveDrop().then(data => {
            if (data) {
                setTitle(data.title);
                const d = new Date(data.drop_date);
                setDate(d.toISOString().split('T')[0]);
                setTime(d.toTimeString().slice(0, 5));
            }
        });
    }, []);

    async function handleSave() {
        setIsLoading(true);
        const fullDate = new Date(`${date}T${time}:00`);

        const res = await updateDrop(title, fullDate.toISOString());

        setIsLoading(false);
        if (res.success) toast.success("DROP UPDATED");
        else toast.error("Failed to update drop");
    }

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <h1 className="text-4xl font-heading font-black uppercase flex items-center gap-4">
                <Timer className="w-10 h-10 text-rawr-red" /> Drop Command
            </h1>

            <div className="bg-white border border-gray-200 p-8 shadow-sm space-y-6">
                <div>
                    <label className="block text-sm font-bold uppercase mb-2">Drop Title</label>
                    <Input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="font-black text-xl uppercase"
                        placeholder="SYSTEM REBOOT"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold uppercase mb-2">Date</label>
                        <Input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold uppercase mb-2">Time</label>
                        <Input
                            type="time"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                        />
                    </div>
                </div>

                <div className="bg-gray-100 p-4 font-mono text-xs">
                    PREVIEW: <span className="text-rawr-red font-bold">{new Date(`${date}T${time}:00`).toLocaleString()}</span>
                </div>

                <Button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="w-full h-14 bg-rawr-black text-white font-bold uppercase tracking-widest text-lg hover:bg-gray-800"
                >
                    <Save className="w-5 h-5 mr-2" /> Sync Global Timer
                </Button>
            </div>
        </div>
    );
}
