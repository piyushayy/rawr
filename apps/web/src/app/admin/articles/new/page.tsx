import ArticleForm from "../ArticleForm";

export default function NewArticlePage() {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-heading font-black uppercase mb-8">
        Write Manifesto
      </h1>
      <ArticleForm />
    </div>
  );
}
