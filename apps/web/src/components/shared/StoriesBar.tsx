"use client";

import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";

const STORIES = [
  {
    id: 1,
    title: "NEW DROP",
    image:
      "https://images.unsplash.com/photo-1523396864712-ecc4a383d633?q=80&w=2070&auto=format&fit=crop",
    link: "/drops",
  },
  {
    id: 2,
    title: "BTS",
    image:
      "https://images.unsplash.com/photo-1576995853123-5a297da4030e?q=80&w=3000&auto=format&fit=crop",
    link: "/manifesto",
  },
  {
    id: 3,
    title: "COMMUNITY",
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=2000&auto=format&fit=crop",
    link: "/community",
  },
  {
    id: 4,
    title: "LOOKBOOK",
    image:
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=2832&auto=format&fit=crop",
    link: "/lookbook",
  },
];

export const StoriesBar = () => {
  return (
    <div className="bg-rawr-white border-b-2 border-rawr-black py-4 overflow-x-auto scrollbar-hide">
      <div className="container mx-auto px-4 flex gap-6 min-w-max">
        {/* Add Story Button (Mock) */}
        <div className="flex flex-col items-center gap-2 group cursor-pointer">
          <div className="w-16 h-16 rounded-full border-2 border-dashed border-gray-400 flex items-center justify-center bg-gray-50 group-hover:border-rawr-black transition-colors">
            <Plus className="w-6 h-6 text-gray-400 group-hover:text-rawr-black" />
          </div>
          <span className="text-[10px] font-bold text-gray-500 uppercase">
            You
          </span>
        </div>

        {STORIES.map((story) => (
          <Link
            key={story.id}
            href={story.link}
            className="flex flex-col items-center gap-2 group"
          >
            <div className="relative w-16 h-16 p-[2px] rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600">
              <div className="w-full h-full rounded-full border-2 border-white overflow-hidden relative bg-white">
                <Image
                  src={story.image}
                  alt={story.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wide group-hover:text-rawr-red transition-colors">
              {story.title}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};
