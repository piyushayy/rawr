import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Eye, DollarSign, ShoppingBag, Search, Filter } from "lucide-react";
import { redirect } from "next/navigation";

export default async function CustomerListPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; sort?: string; segment?: string }>;
}) {
  const params = await searchParams;
  const query = params.q || "";
  const sort = params.sort || "joined_desc"; // joined_desc, spend_desc, clout_desc
  const segment = params.segment || "all";

  const supabase = await createClient();

  // Check Admin
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return redirect("/login");
  // We assume layout checks role, but extra safety:
  // We will just proceed, catching errors if RLS fails.

  // Use the optimized SQL view for CRM
  let dbQuery = supabase.from("customer_metrics").select("*");

  // Search
  if (query) {
    dbQuery = dbQuery.or(`full_name.ilike.%${query}%,email.ilike.%${query}%`);
  }

  // Segments
  if (segment === "whales") {
    dbQuery = dbQuery.gte("total_spend", 500);
  } else if (segment === "vip") {
    dbQuery = dbQuery.gte("order_count", 3);
  } else if (segment === "clout_gods") {
    dbQuery = dbQuery.gte("clout_score", 1000);
  } else if (segment === "newbies") {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    dbQuery = dbQuery.gte("joined_at", thirtyDaysAgo.toISOString());
  } else if (segment === "zero_spend") {
    dbQuery = dbQuery.or("total_spend.eq.0,total_spend.is.null");
  }

  // Sort
  switch (sort) {
    case "spend_desc":
      dbQuery = dbQuery.order("total_spend", { ascending: false });
      break;
    case "clout_desc":
      dbQuery = dbQuery.order("clout_score", { ascending: false });
      break;
    case "orders_desc":
      dbQuery = dbQuery.order("order_count", { ascending: false });
      break;
    case "joined_desc":
    default:
      dbQuery = dbQuery.order("joined_at", { ascending: false });
      break;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: customers, error } = await dbQuery.limit(50);

  if (error) {
    console.error("CRM Error:", error);
    return (
      <div className="p-8 text-red-500">
        Error loading customers. Please run `supabase/crm_v2.sql`.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-heading font-black uppercase">
          Customers (CRM)
        </h2>
        {/* Export Button could go here */}
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 border border-gray-200 flex flex-col md:flex-row gap-4 justify-between">
        <form className="flex gap-2 w-full md:w-96">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              name="q"
              defaultValue={query}
              placeholder="Search by name or email..."
              className="w-full pl-9 pr-4 py-2 border border-gray-200 font-sans text-sm outline-none focus:border-rawr-black"
            />
          </div>
          <Button type="submit" variant="default">
            Search
          </Button>
        </form>

        <div className="flex gap-2 items-center">
          <Filter className="w-4 h-4 text-gray-400" />
          <span className="text-xs font-bold uppercase text-gray-500">
            Sort By:
          </span>
          <div className="flex gap-2">
            <Link href={`/admin/customers?sort=joined_desc&q=${query}`}>
              <Button
                size="sm"
                variant={sort === "joined_desc" ? "default" : "outline"}
                className="text-xs h-8"
              >
                Newest
              </Button>
            </Link>
            <Link href={`/admin/customers?sort=spend_desc&q=${query}`}>
              <Button
                size="sm"
                variant={sort === "spend_desc" ? "default" : "outline"}
                className="text-xs h-8"
              >
                Top Spenders
              </Button>
            </Link>
            <Link href={`/admin/customers?sort=clout_desc&q=${query}`}>
              <Button
                size="sm"
                variant={sort === "clout_desc" ? "default" : "outline"}
                className="text-xs h-8"
              >
                Most Clout
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Segments Generator Tab */}
      <div className="bg-white p-4 border border-x-0 border-t-0 md:border md:rounded flex overflow-x-auto whitespace-nowrap hide-scrollbar items-center gap-2 mt-4">
        <span className="font-bold uppercase text-xs text-gray-400 mr-2 tracking-widest">
          <Filter className="w-4 h-4 inline mr-1" /> Segments:
        </span>
        <Link href={`/admin/customers?segment=all&sort=${sort}&q=${query}`}>
          <Button
            size="sm"
            variant={segment === "all" ? "default" : "outline"}
            className="rounded-full h-8 px-4 text-xs font-bold"
          >
            All Customers
          </Button>
        </Link>
        <Link href={`/admin/customers?segment=whales&sort=${sort}&q=${query}`}>
          <Button
            size="sm"
            variant={segment === "whales" ? "destructive" : "outline"}
            className="rounded-full h-8 px-4 text-xs font-bold"
          >
            Whales ($500+)
          </Button>
        </Link>
        <Link href={`/admin/customers?segment=vip&sort=${sort}&q=${query}`}>
          <Button
            size="sm"
            variant={segment === "vip" ? "default" : "outline"}
            className={`rounded-full h-8 px-4 text-xs font-bold ${segment === "vip" ? "bg-purple-600 hover:bg-purple-700 text-white" : ""}`}
          >
            VIP (3+ Orders)
          </Button>
        </Link>
        <Link
          href={`/admin/customers?segment=clout_gods&sort=${sort}&q=${query}`}
        >
          <Button
            size="sm"
            variant={segment === "clout_gods" ? "default" : "outline"}
            className={`rounded-full h-8 px-4 text-xs font-bold ${segment === "clout_gods" ? "bg-blue-600 hover:bg-blue-700 text-white border-blue-600" : ""}`}
          >
            Clout Gods
          </Button>
        </Link>
        <Link href={`/admin/customers?segment=newbies&sort=${sort}&q=${query}`}>
          <Button
            size="sm"
            variant={segment === "newbies" ? "default" : "outline"}
            className="rounded-full h-8 px-4 text-xs font-bold"
          >
            New Blood (30 Days)
          </Button>
        </Link>
        <Link
          href={`/admin/customers?segment=zero_spend&sort=${sort}&q=${query}`}
        >
          <Button
            size="sm"
            variant={segment === "zero_spend" ? "default" : "outline"}
            className="rounded-full h-8 px-4 text-xs font-bold text-gray-500"
          >
            Zero Spend
          </Button>
        </Link>
      </div>

      <div className="bg-white border text-sm border-gray-200 overflow-hidden mt-6">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="p-4 font-bold uppercase text-gray-500">
                Customer
              </th>
              <th className="p-4 font-bold uppercase text-gray-500">
                Clout Score
              </th>
              <th className="p-4 font-bold uppercase text-gray-500">Orders</th>
              <th className="p-4 font-bold uppercase text-gray-500">
                Lifetime Value
              </th>
              <th className="p-4 font-bold uppercase text-gray-500">
                Last Seen
              </th>
              <th className="p-4 font-bold uppercase text-gray-500 text-right">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {customers?.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-500">
                  No customers found.
                </td>
              </tr>
            ) : null}

            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {customers?.map((customer: any) => (
              <tr key={customer.user_id} className="hover:bg-gray-50 group">
                <td className="p-4">
                  <div className="font-bold text-base">
                    {customer.full_name || "Anonymous"}
                  </div>
                  <div className="text-gray-500">
                    {customer.email || "No Email"}
                  </div>
                  {customer.admin_notes && (
                    <div className="mt-1 text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded w-fit max-w-[200px] truncate">
                      Note: {customer.admin_notes}
                    </div>
                  )}
                </td>
                <td className="p-4">
                  <div className="font-mono font-bold text-rawr-red bg-red-50 px-2 py-1 rounded w-fit">
                    {customer.clout_score || 0}
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-gray-300" />
                    <span className="font-bold">{customer.order_count}</span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-1 text-green-700 font-bold">
                    <DollarSign className="w-3 h-3" />
                    <span>{customer.total_spend?.toFixed(2)}</span>
                  </div>
                </td>
                <td className="p-4 text-gray-500">
                  {new Date(customer.joined_at).toLocaleDateString()}
                </td>
                <td className="p-4 text-right">
                  <Link href={`/admin/customers/${customer.user_id}`}>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="hover:bg-black hover:text-white transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-center text-xs text-gray-400 uppercase">
        Showing top 50 matches
      </p>
    </div>
  );
}
