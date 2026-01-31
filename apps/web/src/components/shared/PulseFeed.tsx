"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";

export const PulseFeed = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [events, setEvents] = useState<string[]>([]);
    const supabase = createClient();

    useEffect(() => {
        const channel = supabase
            .channel('pulse_feed')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'live_events'
                },
                (payload) => {
                    const type = payload.new.type;
                    const meta = payload.new.meta;

                    if (type === 'purchase') {
                        toast.success(`Someone just spent $${meta.total} on GEAR.`);
                    } else if (type === 'review') {
                        toast.info(`New ${meta.rating}★ Review posted!`);
                    } else if (type === 'signup') {
                        toast("New member joined the pack.");
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [supabase]);

    return null; // Headless component, just spawns toasts
};
