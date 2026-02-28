"use client";

import { useMemo, useState } from "react";
import Image from "next/image";

type ProductImageGalleryProps = {
  name: string;
  images: string[];
};

const ProductImageGallery = ({ name, images }: ProductImageGalleryProps) => {
  const validImages = useMemo(
    () => images.filter((image) => typeof image === "string" && image.trim().length > 0),
    [images]
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = validImages[activeIndex] ?? validImages[0];

  return (
    <div className="space-y-3">
      <div className="relative aspect-4/3 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
        {activeImage ? (
          <Image
            src={activeImage}
            alt={name}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        ) : null}
      </div>

      {validImages.length > 1 ? (
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
          {validImages.map((image, index) => {
            const isActive = index === activeIndex;

            return (
              <button
                key={`${name}-image-${index}`}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`relative aspect-square overflow-hidden rounded-xl border bg-slate-100 transition ${
                  isActive ? "border-primary ring-2 ring-primary/20" : "border-slate-200 hover:border-slate-300"
                }`}
                aria-label={`View ${name} image ${index + 1}`}
                aria-pressed={isActive}
              >
                <Image
                  src={image}
                  alt={`${name} image ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 20vw, 120px"
                />
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
};

export default ProductImageGallery;
