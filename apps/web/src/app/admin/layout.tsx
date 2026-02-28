import { checkAdmin } from "@/utils/admin";
import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  MessageSquare,
  Settings,
  LogOut,
  Briefcase,
  FileText,
  Camera,
} from "lucide-react";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await checkAdmin();

  const navItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Products", href: "/admin/products", icon: Package },
    { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
    { label: "Drops", href: "/admin/drops", icon: Camera }, // Icons can be adjusted
    { label: "Reviews", href: "/admin/reviews", icon: MessageSquare },
    { label: "Customers", href: "/admin/customers", icon: Users },
    { label: "Inbox", href: "/admin/inbox", icon: MessageSquare },
    { label: "Manifesto", href: "/admin/articles", icon: FileText },
    { label: "Lookbook", href: "/admin/lookbook", icon: Camera },
    { label: "Careers", href: "/admin/careers", icon: Briefcase },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100 font-body">
      {/* Sidebar */}
      <aside className="w-64 bg-rawr-black text-white shrink-0 hidden md:flex flex-col">
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-2xl font-heading font-black tracking-tighter">
            RAWR <span className="text-rawr-red">ADMIN</span>
          </h1>
        </div>

        <nav className="flex-1 py-6 px-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors font-bold text-sm uppercase"
            >
              <item.icon className="w-5 h-5 opacity-70" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors font-bold text-sm uppercase text-gray-400 hover:text-white"
          >
            <LogOut className="w-5 h-5" />
            Exit Application
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
