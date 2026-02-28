"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Maximize2, X } from "lucide-react";

export const ProductGallery = ({
  images,
  title,
}: {
  images: string[];
  title: string;
}) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  return (
    <div className="space-y-4">
      {/* Main Image View */}
      <div
        className="relative aspect-[3/4] w-full border-2 border-rawr-black bg-gray-100 overflow-hidden group cursor-zoom-in"
        onClick={() => setIsZoomed(true)}
      >
        <Image
          src={images[selectedImage]}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          priority
        />
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Maximize2 className="text-white drop-shadow-lg w-12 h-12" />
        </div>
      </div>

      {/* Thumbnails */}
      <div className="grid grid-cols-4 gap-2">
        {images.map((img, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className={`relative aspect-square border-2 ${selectedImage === index ? "border-rawr-red ring-2 ring-rawr-red/20" : "border-transparent hover:border-gray-300"} transition-all`}
          >
            <Image
              src={img}
              alt={`View ${index + 1}`}
              fill
              className="object-cover"
            />
          </button>
        ))}
      </div>

      {/* Lightbox / Zoom Modal */}
      <AnimatePresence>
        {isZoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={() => setIsZoomed(false)}
          >
            <button
              className="absolute top-4 right-4 text-white hover:text-rawr-red p-2"
              onClick={() => setIsZoomed(false)}
            >
              <X className="w-8 h-8" />
            </button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-4xl h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={images[selectedImage]}
                alt={title}
                fill
                className="object-contain"
              />
            </motion.div>

            {/* Lightbox Thumbnails */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4 max-w-full overflow-x-auto p-4 bg-black/50 rounded-full backdrop-blur-md">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImage(index);
                  }}
                  className={`relative w-12 h-12 rounded-lg overflow-hidden border-2 ${selectedImage === index ? "border-rawr-red" : "border-transparent opacity-50 hover:opacity-100"}`}
                >
                  <Image
                    src={img}
                    alt={`Thumb ${index}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
