import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionLink?: string;
}

export const EmptyState = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionLink,
}: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-4 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg">
      <div className="bg-white p-6 rounded-full border-2 border-gray-200 mb-6">
        <Icon className="w-12 h-12 text-gray-400" />
      </div>
      <h3 className="text-2xl font-heading font-black uppercase mb-2 text-rawr-black">
        {title}
      </h3>
      <p className="text-gray-500 mb-8 max-w-sm font-body font-medium">
        {description}
      </p>
      {actionLabel && actionLink && (
        <Link href={actionLink}>
          <Button className="bg-rawr-black text-white hover:bg-rawr-red uppercase font-bold px-8">
            {actionLabel}
          </Button>
        </Link>
      )}
    </div>
  );
};
