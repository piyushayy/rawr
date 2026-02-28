"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-rawr-black text-rawr-white text-center p-4">
      <h1 className="text-[10rem] md:text-[15rem] font-heading font-black leading-none text-rawr-red">
        404
      </h1>
      <h2 className="text-2xl md:text-4xl font-heading font-bold uppercase mb-8">
        Lost in the Void
      </h2>
      <p className="text-gray-400 max-w-md mb-8 font-body">
        The page you are looking for has been consumed by the hype. It does not
        exist.
      </p>
      <Link href="/">
        <Button
          size="lg"
          className="bg-white text-rawr-black hover:bg-rawr-red hover:text-white uppercase font-black px-12 h-16 text-xl"
        >
          Return to Reality
        </Button>
      </Link>
    </div>
  );
}
