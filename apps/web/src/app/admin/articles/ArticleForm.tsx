'use client';

import { createArticle, updateArticle } from "./actions";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// Simple auto-resize textarea
const Textarea = ({ ...props }) => (
    <textarea
        {...props}
        className="w-full p-4 border-2 border-rawr-black bg-gray-50 focus:outline-none focus:ring-4 focus:ring-rawr-black/10 transition-all font-mono text-sm min-h-[200px]"
    />
);

const Input = ({ ...props }) => (
    <input
        {...props}
        className="w-full p-3 border-2 border-rawr-black bg-white focus:outline-none focus:ring-4 focus:ring-rawr-black/10 transition-all font-bold"
    />
);

export default function ArticleForm({ article }: { article?: any }) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (formData: FormData) => {
        setLoading(true);
        try {
            const action = article ? updateArticle.bind(null, article.id) : createArticle;
            const result = await action(formData);

            if (result?.error) {
                toast.error(result.error);
            } else {
                toast.success(article ? "Article updated!" : "Article created!");
                // Let the server action handle redirect, or do it here if needed
            }
        } catch (e) {
            console.error(e);
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form action={handleSubmit} className="space-y-8 max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="font-bold uppercase text-sm">Title</label>
                    <Input name="title" placeholder="Heads Will Roll" defaultValue={article?.title} required />
                </div>
                <div className="space-y-2">
                    <label className="font-bold uppercase text-sm">Slug (Optional)</label>
                    <Input name="slug" placeholder="heads-will-roll" defaultValue={article?.slug} />
                </div>
            </div>

            <div className="space-y-2">
                <label className="font-bold uppercase text-sm">Cover Image URL</label>
                <Input name="image_url" placeholder="https://..." defaultValue={article?.image_url} />
            </div>

            <div className="space-y-2">
                <label className="font-bold uppercase text-sm">Excerpt</label>
                <textarea
                    name="excerpt"
                    className="w-full p-3 border-2 border-rawr-black bg-white focus:outline-none focus:ring-4 focus:ring-rawr-black/10 transition-all h-24"
                    placeholder="Short summary for the card preview..."
                    defaultValue={article?.excerpt}
                />
            </div>

            <div className="space-y-2">
                <label className="font-bold uppercase text-sm">Content (Markdown Supported)</label>
                <Textarea name="content" placeholder="# The Beginning..." defaultValue={article?.content} required />
                <p className="text-xs text-gray-500">Use basic markdown for formatting.</p>
            </div>

            <div className="flex items-center gap-4 bg-gray-100 p-4 border border-gray-300">
                <input
                    type="checkbox"
                    name="published"
                    id="published"
                    defaultChecked={article?.published}
                    className="w-5 h-5 accent-rawr-black"
                />
                <label htmlFor="published" className="font-bold uppercase cursor-pointer">Publish Immediately</label>
            </div>

            <Button
                type="submit"
                disabled={loading}
                className="w-full h-14 text-xl bg-rawr-black text-white hover:bg-gray-800"
            >
                {loading ? "SAVING..." : (article ? "UPDATE MANIFESTO" : "PUBLISH MANIFESTO")}
            </Button>
        </form>
    );
}
