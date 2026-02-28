"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { checkAdmin } from "@/utils/admin";

export async function createArticle(formData: FormData) {
  await checkAdmin();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

  const title = formData.get("title") as string;
  const slug =
    (formData.get("slug") as string) ||
    title
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");
  const content = formData.get("content") as string;
  const excerpt = formData.get("excerpt") as string;
  const image_url = formData.get("image_url") as string;
  const published = formData.get("published") === "on";

  const { error } = await supabase.from("articles").insert({
    title,
    slug,
    content,
    excerpt,
    image_url,
    published,
    author_id: user.id,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/articles");
  revalidatePath("/manifesto");
  redirect("/admin/articles");
}

export async function updateArticle(id: string, formData: FormData) {
  await checkAdmin();
  const supabase = await createClient();

  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const content = formData.get("content") as string;
  const excerpt = formData.get("excerpt") as string;
  const image_url = formData.get("image_url") as string;
  const published = formData.get("published") === "on";

  const { error } = await supabase
    .from("articles")
    .update({
      title,
      slug,
      content,
      excerpt,
      image_url,
      published,
    })
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/articles");
  revalidatePath("/manifesto");
  redirect("/admin/articles");
}

export async function deleteArticle(id: string) {
  await checkAdmin();
  const supabase = await createClient();

  const { error } = await supabase.from("articles").delete().eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/articles");
}
