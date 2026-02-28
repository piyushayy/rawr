import { createClient } from "@/utils/supabase/server";
import { Button } from "@/components/ui/button";
import { updateInboxStatus, deleteInboxItem } from "../inbox/actions";
import { Briefcase, Archive, Trash2, CheckCircle } from "lucide-react";

export default async function AdminCareersPage() {
  const supabase = await createClient();

  const { data: applications } = await supabase
    .from("inbox")
    .select("*")
    .eq("type", "career")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-heading font-black uppercase">
          Careers / Applications
        </h2>
      </div>

      <div className="space-y-4">
        {applications?.length === 0 && (
          <p className="text-gray-500">No applications found.</p>
        )}

        {applications?.map((app) => (
          <div
            key={app.id}
            className={`bg-white border p-6 rounded-lg ${app.status === "unread" ? "border-l-4 border-l-rawr-red shadow-md" : "border-gray-200 opacity-80"}`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <Briefcase className="w-5 h-5 text-rawr-black" />
                <div>
                  <h4 className="font-bold text-lg">{app.name}</h4>
                  <p className="text-sm text-gray-500">{app.email}</p>
                </div>
              </div>
              <span className="text-xs font-bold text-gray-400 uppercase">
                {new Date(app.created_at).toLocaleDateString()}
              </span>
            </div>

            <div className="mb-2">
              <span className="text-xs font-bold uppercase bg-gray-100 px-2 py-1 rounded">
                Position: {app.subject}
              </span>
            </div>

            <p className="text-gray-700 bg-gray-50 p-4 rounded mb-4 whitespace-pre-wrap font-sans">
              {app.message}
            </p>

            <div className="flex gap-2 justify-end">
              {app.status === "unread" && (
                <form action={updateInboxStatus.bind(null, app.id, "read")}>
                  <Button size="sm" variant="outline" className="gap-2">
                    <CheckCircle className="w-4 h-4" /> Mark Reviewed
                  </Button>
                </form>
              )}
              <form action={updateInboxStatus.bind(null, app.id, "archived")}>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-2 bg-gray-100 hover:bg-gray-200"
                >
                  <Archive className="w-4 h-4" /> Archive
                </Button>
              </form>
              <form action={deleteInboxItem.bind(null, app.id)}>
                <Button size="sm" variant="destructive" className="gap-2">
                  <Trash2 className="w-4 h-4" /> Reject/Delete
                </Button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
