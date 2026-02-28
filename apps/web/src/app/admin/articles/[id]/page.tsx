import { createClient } from "@/utils/supabase/server";
import ArticleForm from "../ArticleForm";
import { notFound } from "next/navigation";

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: article } = await supabase
    .from("articles")
    .select("*")
    .eq("id", id)
    .single();

  if (!article) {
    notFound();
  }

  return (
    <div className="p-8">
      <h1 className="text-4xl font-heading font-black uppercase mb-8">
        Edit Manifesto
      </h1>
      <ArticleForm article={article} />
    </div>
  );
}
