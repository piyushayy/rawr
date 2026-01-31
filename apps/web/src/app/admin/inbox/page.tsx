import { createClient } from "@/utils/supabase/server";
import { Button } from "@/components/ui/button";
import { updateInboxStatus, deleteInboxItem } from "./actions";
import { Mail, MessageCircle, Archive, Trash2, CheckCircle } from "lucide-react";

export default async function AdminInboxPage({ searchParams }: { searchParams: Promise<{ filter?: string }> }) {
    const supabase = await createClient();
    const params = await searchParams;
    const filter = params?.filter || 'all';

    let query = supabase.from("inbox").select("*").neq('type', 'career').order("created_at", { ascending: false });

    // Note: Careers are separate, but we could mix them. 
    // The user asked for "Careers" specifically, so I excluded them here to keep "Inbox" clean, 
    // or I can include filter.
    // Let's show everything EXCEPT careers here (since careers has its own tab).

    if (filter === 'unread') {
        query = query.eq('status', 'unread');
    }

    const { data: messages } = await query;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-heading font-black uppercase">Inbox</h2>
                <div className="flex gap-2">
                    {/* Simple filters could go here */}
                </div>
            </div>

            <div className="space-y-4">
                {messages?.length === 0 && <p className="text-gray-500">No messages found.</p>}

                {messages?.map((msg) => (
                    <div key={msg.id} className={`bg-white border p-6 rounded-lg ${msg.status === 'unread' ? 'border-l-4 border-l-rawr-red shadow-md' : 'border-gray-200 opacity-80'}`}>
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                {msg.type === 'feedback' && <MessageCircle className="w-5 h-5 text-blue-500" />}
                                {msg.type === 'general' && <Mail className="w-5 h-5 text-gray-500" />}
                                {msg.type === 'support' && <CheckCircle className="w-5 h-5 text-green-500" />}

                                <div>
                                    <h4 className="font-bold text-lg">{msg.subject || 'No Subject'}</h4>
                                    <p className="text-sm text-gray-500">{msg.name} ({msg.email})</p>
                                </div>
                            </div>
                            <span className="text-xs font-bold text-gray-400 uppercase">{new Date(msg.created_at).toLocaleDateString()}</span>
                        </div>

                        <p className="text-gray-700 bg-gray-50 p-4 rounded mb-4 whitespace-pre-wrap font-sans">
                            {msg.message}
                        </p>

                        <div className="flex gap-2 justify-end">
                            {msg.status === 'unread' && (
                                <form action={updateInboxStatus.bind(null, msg.id, 'read')}>
                                    <Button size="sm" variant="outline" className="gap-2">
                                        <CheckCircle className="w-4 h-4" /> Mark Read
                                    </Button>
                                </form>
                            )}
                            <form action={updateInboxStatus.bind(null, msg.id, 'archived')}>
                                <Button size="sm" variant="outline" className="gap-2 bg-gray-100 hover:bg-gray-200">
                                    <Archive className="w-4 h-4" /> Archive
                                </Button>
                            </form>
                            <form action={deleteInboxItem.bind(null, msg.id)}>
                                <Button size="sm" variant="destructive" className="gap-2">
                                    <Trash2 className="w-4 h-4" /> Delete
                                </Button>
                            </form>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
