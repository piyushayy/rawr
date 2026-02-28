import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CustomerNotesForm } from "./CustomerNotesForm";
import Link from "next/link";
import {
  ArrowLeft,
  Mail,
  Clock,
  ShieldCheck,
  Tag,
  ShoppingBag,
  MessageSquare,
  Activity,
} from "lucide-react";
import Image from "next/image";

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  // Fetch Profile + Orders
  const { data: profile } = await supabase
    .from("profiles")
    .select(
      `
            *,
            orders (
                *,
                order_items (
                    *,
                    products (title, images)
                )
            )
        `,
    )
    .eq("id", id)
    .single();

  if (!profile) {
    notFound();
  }

  // Sort orders
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const orders =
    profile.orders?.sort(
      (a: any, b: any) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    ) || [];

  // ==========================================
  // CRM ADVANCED FEATURE ENGINE
  // ==========================================

  // 1. Calculate CRM Metrics (LTV, AOV)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const completedOrders = orders.filter(
    (o: any) =>
      o.status === "completed" ||
      o.status === "shipped" ||
      o.status === "processing",
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const totalLifetimeValue = completedOrders.reduce(
    (acc: number, o: any) => acc + Number(o.total || 0),
    0,
  );
  const aov =
    completedOrders.length > 0
      ? totalLifetimeValue / completedOrders.length
      : 0;

  // 2. VIP Tier Mapping
  let tierName = "Initiate";
  let tierTheme = "bg-gray-100 text-gray-800 border-gray-300";
  let tierProgress = Math.min((totalLifetimeValue / 150) * 100, 100);
  let nextTierGoal = 150;

  if (totalLifetimeValue >= 1000) {
    tierName = "Clout God";
    tierTheme =
      "bg-gradient-to-r from-purple-500 to-indigo-500 text-white border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.5)]";
    tierProgress = 100;
    nextTierGoal = 1000;
  } else if (totalLifetimeValue >= 500) {
    tierName = "Whale";
    tierTheme =
      "bg-yellow-100 text-yellow-900 border-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.3)]";
    tierProgress = Math.min((totalLifetimeValue / 1000) * 100, 100);
    nextTierGoal = 1000;
  } else if (totalLifetimeValue >= 150) {
    tierName = "Acolyte";
    tierTheme = "bg-blue-100 text-blue-900 border-blue-400";
    tierProgress = Math.min((totalLifetimeValue / 500) * 100, 100);
    nextTierGoal = 500;
  }

  // 3. Automated Tag Inference Engine
  const dynamicTags = [];
  if (totalLifetimeValue >= 500)
    dynamicTags.push({
      label: "High Value",
      color: "bg-yellow-200 text-yellow-800 border-yellow-400",
    });
  if (orders.length >= 3)
    dynamicTags.push({
      label: "Loyal",
      color: "bg-green-200 text-green-800 border-green-400",
    });
  if (profile.clout_score > 500)
    dynamicTags.push({
      label: "Influencer",
      color: "bg-purple-200 text-purple-800 border-purple-400",
    });
  if (orders.length > 0 && totalLifetimeValue === 0)
    dynamicTags.push({
      label: "Refund Risk",
      color: "bg-red-200 text-red-800 border-red-400",
    });

  // 4. Action Audit Trail (Merging multiple events into a timeline)
  const timelineEvents = [
    {
      id: "join",
      type: "joined",
      date: new Date(profile.created_at).getTime(),
      data: { message: "Joined RAWR" },
      icon: ShieldCheck,
      color: "text-blue-500 bg-blue-100 border-blue-200",
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...orders.map((o: any) => ({
      id: o.id,
      type: "order",
      date: new Date(o.created_at).getTime(),
      data: o,
      icon: ShoppingBag,
      color: "text-green-500 bg-green-100 border-green-200",
    })),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...(profile.support_tickets || []).map((t: any) => ({
      id: t.id,
      type: "ticket",
      date: new Date(t.created_at).getTime(),
      data: t,
      icon: MessageSquare,
      color: "text-orange-500 bg-orange-100 border-orange-200",
    })),
  ].sort((a, b) => b.date - a.date);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Link
          href="/admin/customers"
          className="text-gray-500 hover:text-black flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Back to CRM
        </Link>
        <div className="flex items-center gap-2">
          <span
            className={`px-4 py-1.5 text-xs font-black uppercase border-2 ${tierTheme}`}
          >
            {tierName} TIER
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Column: Profile Card & Upgrades */}
        <div className="space-y-6">
          <div className="bg-white border-2 border-rawr-black p-6">
            <div className="text-center">
              <div
                className={`w-32 h-32 mx-auto rounded-full mb-4 overflow-hidden relative border-4 ${totalLifetimeValue >= 1000 ? "border-purple-500" : "border-gray-200"}`}
              >
                {profile.avatar_url ? (
                  <Image
                    src={profile.avatar_url}
                    alt="User"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl font-black text-gray-400 bg-gray-100">
                    ?
                  </div>
                )}
              </div>
              <h1 className="text-2xl font-black uppercase">
                {profile.full_name}
              </h1>
              <p className="text-gray-500 text-sm mb-4 font-body">
                {profile.email}
              </p>
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                {dynamicTags.map((tag) => (
                  <span
                    key={tag.label}
                    className={`text-xs px-2 py-0.5 border font-bold uppercase ${tag.color}`}
                  >
                    <Tag className="w-3 h-3 inline mr-1" />
                    {tag.label}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 p-4 border border-gray-200 mb-6 space-y-4">
              <div>
                <div className="flex justify-between text-xs font-bold uppercase mb-1">
                  <span>LTV: ${totalLifetimeValue.toFixed(2)}</span>
                  <span className="text-gray-400">
                    Next Tier: ${nextTierGoal}
                  </span>
                </div>
                <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-rawr-black h-full transition-all duration-1000"
                    style={{ width: `${tierProgress}%` }}
                  />
                </div>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-4">
                <div className="text-center">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    AOV
                  </p>
                  <p className="text-lg font-black">${aov.toFixed(2)}</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Clout
                  </p>
                  <p className="text-lg font-black text-rawr-red">
                    {profile.clout_score || 0}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Orders
                  </p>
                  <p className="text-lg font-black">{orders.length}</p>
                </div>
              </div>
            </div>

            <a href={`mailto:${profile.email}`}>
              <Button className="w-full gap-2 py-6 border-2 border-rawr-black shadow-[4px_4px_0_0_#050505] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
                <Mail className="w-5 h-5" /> DIRECT COMMUNICATE
              </Button>
            </a>
          </div>

          {/* Admin Notes Box */}
          <div className="bg-yellow-50 border-2 border-yellow-400 p-6 relative">
            <div className="absolute top-0 right-0 p-2">
              <Tag className="w-6 h-6 text-yellow-200" />
            </div>
            <h3 className="font-bold uppercase text-yellow-900 mb-4 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" /> CRM Intel
            </h3>
            <CustomerNotesForm
              userId={id}
              initialNotes={profile.admin_notes || ""}
            />
          </div>
        </div>

        {/* Center / Right Column: Combined Event Stream & Orders */}
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-white border-2 border-rawr-black p-6">
            <h3 className="font-heading font-black uppercase text-2xl flex items-center gap-2 mb-8">
              <Activity className="w-6 h-6 text-rawr-red" />
              Customer Timeline
            </h3>

            <div className="relative border-l-2 border-gray-200 ml-4 space-y-8 pb-4">
              {timelineEvents.map((event, index) => {
                const Icon = event.icon;
                return (
                  <div
                    key={`${event.type}-${event.id}-${index}`}
                    className="relative pl-8"
                  >
                    {/* Timeline Node */}
                    <div
                      className={`absolute -left-[17px] top-0 w-8 h-8 rounded-full border-2 border-white flex items-center justify-center ${event.color}`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>

                    {/* Timeline Content */}
                    <div className="bg-gray-50 border border-gray-200 p-4 rounded-sm hover:border-rawr-black transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-bold uppercase text-xs tracking-widest text-gray-500">
                          {event.type}
                        </p>
                        <span className="flex items-center gap-1 text-xs font-mono text-gray-400">
                          <Clock className="w-3 h-3" />
                          {new Date(event.date).toLocaleDateString()}{" "}
                          {new Date(event.date).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>

                      {/* Event specific rendering */}
                      {event.type === "joined" && (
                        <p className="font-bold text-lg">
                          {event.data.message}
                        </p>
                      )}

                      {event.type === "order" && (
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <p className="font-bold text-lg leading-none">
                              Placed Order #{event.data.id.slice(0, 8)}
                            </p>
                            <p className="font-black text-green-600">
                              +${event.data.total}
                            </p>
                          </div>
                          <div className="flex gap-2 overflow-x-auto">
                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                            {event.data.order_items?.map((item: any) => (
                              <div
                                key={item.id}
                                className="w-10 h-10 bg-white border border-gray-200 shrink-0 relative"
                                title={item.products?.title}
                              >
                                {item.products?.images?.[0] && (
                                  <Image
                                    src={item.products.images[0]}
                                    alt={item.products.title}
                                    fill
                                    className="object-cover"
                                  />
                                )}
                              </div>
                            ))}
                          </div>
                          <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-200">
                            <span
                              className={`text-[10px] px-2 py-0.5 uppercase font-bold ${event.data.status === "completed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}
                            >
                              {event.data.status}
                            </span>
                            <Link
                              href={`/admin/orders/${event.data.id}`}
                              className="text-xs font-bold text-blue-600 hover:underline"
                            >
                              View Order
                            </Link>
                          </div>
                        </div>
                      )}

                      {event.type === "ticket" && (
                        <div>
                          <p className="font-bold text-lg">
                            {event.data.subject}
                          </p>
                          <p className="text-sm text-gray-600 mt-1 pl-3 border-l-2 border-gray-300 italic">
                            "{event.data.message}"
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
