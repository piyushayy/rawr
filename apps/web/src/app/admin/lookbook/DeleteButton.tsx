"use client";

import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { deleteLookbookEntry } from "./actions";
import { toast } from "sonner";
import { useState } from "react";

export default function DeleteButton({ id }: { id: string }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Remove this look?")) return;

    setLoading(true);
    try {
      await deleteLookbookEntry(id);
      toast.success("Look removed.");
    } catch (e) {
      toast.error("Failed to delete.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="destructive"
      size="icon"
      className="h-8 w-8 hover:bg-red-600"
      onClick={handleDelete}
      disabled={loading}
    >
      <Trash2 className="w-4 h-4" />
    </Button>
  );
}
