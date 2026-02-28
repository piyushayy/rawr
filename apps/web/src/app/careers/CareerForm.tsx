"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { submitApplication } from "./actions";

export default function CareerForm({ position }: { position: string }) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    // Append position just in case
    if (!formData.get("position")) {
      formData.append("position", position);
    }

    const result = await submitApplication(formData);
    setLoading(false);

    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success(result.message);
      // reset form?
      // document.getElementById('career-form').reset();
    }
  }

  return (
    <form
      action={handleSubmit}
      className="space-y-4 max-w-lg mx-auto bg-gray-50 p-8 border-2 border-rawr-black"
    >
      <h3 className="font-heading font-bold uppercase text-xl mb-4">
        Apply for {position}
      </h3>
      <input type="hidden" name="position" value={position} />

      <div className="space-y-2">
        <label className="font-bold uppercase text-sm">Full Name</label>
        <input
          name="name"
          required
          className="w-full p-3 border-2 border-gray-200 focus:border-rawr-black outline-none font-bold"
        />
      </div>

      <div className="space-y-2">
        <label className="font-bold uppercase text-sm">Email</label>
        <input
          name="email"
          type="email"
          required
          className="w-full p-3 border-2 border-gray-200 focus:border-rawr-black outline-none font-bold"
        />
      </div>

      <div className="space-y-2">
        <label className="font-bold uppercase text-sm">Why You?</label>
        <textarea
          name="coverLetter"
          required
          rows={5}
          placeholder="Tell us why you belong at a place called RAWR..."
          className="w-full p-3 border-2 border-gray-200 focus:border-rawr-black outline-none font-bold"
        />
      </div>

      <Button type="submit" disabled={loading} className="w-full h-12 text-lg">
        {loading ? "SENDING..." : "SUBMIT APPLICATION"}
      </Button>
    </form>
  );
}
