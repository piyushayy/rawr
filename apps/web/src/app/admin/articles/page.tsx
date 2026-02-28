import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import Image from "next/image";
import DeleteArticleButton from "./DeleteArticleButton";

export default async function AdminArticlesPage() {
  const supabase = await createClient();
  const { data: articles } = await supabase
    .from("articles")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-heading font-black uppercase">
          The Manifesto (Blog)
        </h1>
        <Link href="/admin/articles/new">
          <Button className="bg-rawr-black text-white hover:bg-gray-800">
            <Plus className="w-4 h-4 mr-2" /> Write Article
          </Button>
        </Link>
      </div>

      <div className="bg-white border-2 border-rawr-black overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-rawr-black text-white uppercase font-bold text-sm">
            <tr>
              <th className="p-4">Image</th>
              <th className="p-4">Title</th>
              <th className="p-4">Status</th>
              <th className="p-4">Date</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {articles?.map((article) => (
              <tr key={article.id} className="hover:bg-gray-50">
                <td className="p-4 w-24">
                  <div className="relative w-16 h-16 bg-gray-100 rounded overflow-hidden border border-gray-300">
                    {article.image_url && (
                      <Image
                        src={article.image_url}
                        alt={article.title}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                </td>
                <td className="p-4 font-bold">
                  {article.title}
                  <p className="text-xs text-gray-400 font-normal mt-1">
                    /{article.slug}
                  </p>
                </td>
                <td className="p-4">
                  {article.published ? (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded font-bold uppercase">
                      Published
                    </span>
                  ) : (
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded font-bold uppercase">
                      Draft
                    </span>
                  )}
                </td>
                <td className="p-4 text-sm text-gray-500">
                  {new Date(article.created_at).toLocaleDateString()}
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/manifesto/${article.slug}`} target="_blank">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 text-gray-500"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Link href={`/admin/articles/${article.id}`}>
                      <Button variant="outline" size="icon" className="h-8 w-8">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </Link>
                    <DeleteArticleButton id={article.id} />
                  </div>
                </td>
              </tr>
            ))}
            {articles?.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">
                  No articles written yet. The world is waiting for your
                  manifesto.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
