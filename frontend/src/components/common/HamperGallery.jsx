import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../../utils/cn";

/**
 * Fills its (relatively positioned) parent with a swipe-free image gallery:
 * arrows + dots, only shown when there is more than one image.
 */
export default function HamperGallery({ images = [], alt = "" }) {
  const [index, setIndex] = useState(0);
  const count = images.length;
  const go = (e, step) => {
    e.preventDefault();
    e.stopPropagation();
    setIndex((i) => (i + step + count) % count);
  };

  return (
    <>
      {images.map((src, i) => (
        <img
          key={src}
          src={src}
          alt={i === index ? alt : ""}
          loading="lazy"
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-opacity duration-500",
            i === index ? "opacity-100" : "opacity-0",
          )}
        />
      ))}
      {count > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => go(e, -1)}
            aria-label="Previous photo"
            className="absolute left-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full bg-white/85 text-brand-dark shadow transition-colors hover:bg-white"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={(e) => go(e, 1)}
            aria-label="Next photo"
            className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full bg-white/85 text-brand-dark shadow transition-colors hover:bg-white"
          >
            <ChevronRight size={16} />
          </button>
          <div className="absolute inset-x-0 bottom-2.5 flex justify-center gap-1.5">
            {images.map((src, i) => (
              <button
                key={src}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setIndex(i);
                }}
                aria-label={`Show photo ${i + 1}`}
                className={cn(
                  "h-1.5 rounded-full bg-white transition-all",
                  i === index ? "w-5 opacity-100" : "w-1.5 opacity-60",
                )}
              />
            ))}
          </div>
        </>
      )}
    </>
  );
}
