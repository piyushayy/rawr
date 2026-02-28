"use client";

import { useState } from "react";
import Image from "next/image";
import { Heart, MessageSquare, Share2 } from "lucide-react";
import { toggleLike } from "./actions"; // We'll move this import or pass action
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface FeedPostProps {
  post: {
    id: string;
    image_url: string;
    caption?: string;
    likes_count: number;
    created_at: string;
    user?: {
      email?: string; // Fallback
      full_name?: string;
      avatar_url?: string;
      // Join via profiles relation ideally
      // or if we select specific fields
    };
    isLiked?: boolean; // We will calculate this on server or client
  };
  currentUserId?: string;
}

// Helper to toggle like action
import { toggleLike as serverToggleLike } from "./actions";

export const FeedPost = ({ post, currentUserId }: FeedPostProps) => {
  const [isLiked, setIsLiked] = useState(post.isLiked || false);
  const [likesCount, setLikesCount] = useState(post.likes_count || 0);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleLike = async () => {
    if (!currentUserId) {
      toast.error("Join the hierarchy to interact.");
      return;
    }

    // Optimistic Update
    const newIsLiked = !isLiked;
    setIsLiked(newIsLiked);
    setLikesCount((prev) => (newIsLiked ? prev + 1 : prev - 1));

    if (newIsLiked) setIsAnimating(true);

    const res = await serverToggleLike(post.id);
    if (res?.error) {
      // Revert
      setIsLiked(!newIsLiked);
      setLikesCount((prev) => (!newIsLiked ? prev + 1 : prev - 1));
      toast.error(res.error);
    }
  };

  return (
    <article className="border-2 border-rawr-black bg-white mb-8 group">
      {/* Header */}
      <div className="p-4 flex items-center gap-3 border-b-2 border-rawr-black bg-gray-50">
        <div className="w-10 h-10 rounded-full bg-rawr-black overflow-hidden border border-gray-300 relative">
          {post.user?.avatar_url ? (
            <Image
              src={post.user.avatar_url}
              alt="User"
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white font-bold text-xs">
              {post.user?.full_name?.[0] || "R"}
            </div>
          )}
        </div>
        <div>
          <p className="font-heading font-bold uppercase text-sm">
            {post.user?.full_name || "Anonymous Recruit"}
          </p>
          <p className="text-xs text-gray-500 font-mono">
            {new Date(post.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Image */}
      <div
        className="relative aspect-square md:aspect-[4/5] bg-gray-200 overflow-hidden"
        onDoubleClick={handleLike}
      >
        <Image
          src={post.image_url}
          alt="Community Post"
          fill
          className="object-cover"
        />

        {/* Heart Pop Animation */}
        {isAnimating && (
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            onAnimationEnd={() => setIsAnimating(false)}
          >
            <Heart className="w-24 h-24 text-white fill-white animate-ping opacity-80" />
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="p-4 border-t-2 border-rawr-black space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handleLike}
              className="hover:text-rawr-red transition-colors flex items-center gap-2 group/like"
            >
              <Heart
                className={`w-6 h-6 transition-all ${isLiked ? "fill-rawr-red text-rawr-red" : "text-rawr-black group-hover/like:text-rawr-red"}`}
              />
              <span className="font-bold font-mono">{likesCount}</span>
            </button>
            <button className="hover:text-rawr-black/70 transition-colors">
              <MessageSquare className="w-6 h-6" />
            </button>
          </div>
          <button className="hover:text-rawr-black/70 transition-colors">
            <Share2 className="w-6 h-6" />
          </button>
        </div>

        {post.caption && (
          <div className="text-sm md:text-base font-medium">
            <span className="font-bold uppercase mr-2">
              {post.user?.full_name || "User"}:
            </span>
            {post.caption}
          </div>
        )}
      </div>
    </article>
  );
};
