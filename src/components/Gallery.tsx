"use client";

import React from "react";
import useEmblaCarousel from "embla-carousel-react";
import { FaAngleLeft, FaAngleRight, FaXmark } from "react-icons/fa6";
import { useKeyPress } from "@/hooks/useKeyPress";
import { useRouter, useSearchParams } from "next/navigation";

type GalleryProps = React.HTMLAttributes<HTMLDivElement> & {
  images: string[];
  imageClassName?: string;
};

export default function Gallery(props: GalleryProps) {
  const { images, imageClassName, ...containerProps } = props;
  const searchParams = useSearchParams();
  const index = parseInt(searchParams.get("view") ?? "");
  const isOpen = !isNaN(index);
  const router = useRouter();

  const [emblaRef, emblaApi] = useEmblaCarousel({ startIndex: index });

  React.useEffect(() => {
    document.body.classList.toggle("overflow-y-hidden", isOpen);
    return () => {
      document.body.classList.remove("overflow-y-hidden");
    };
  }, [isOpen, emblaApi]);

  const openModal = (idx: number) => {
    window.history.pushState(null, "", `?view=${idx}`);
  };

  const closeModal = React.useCallback(() => {
    if (isOpen) router.back();
  }, [router, isOpen]);

  useKeyPress({ key: "Escape", onKeyPressed: closeModal });

  const scrollPrev = React.useCallback(() => {
    emblaApi?.scrollPrev();
  }, [emblaApi]);

  const scrollNext = React.useCallback(() => {
    emblaApi?.scrollNext();
  }, [emblaApi]);

  return (
    <div>
      <div {...containerProps}>
        {images.map((src, idx) => (
          <img
            key={idx}
            src={src}
            alt=""
            className={props.imageClassName}
            onClick={() => openModal(idx)}
          />
        ))}
      </div>

      {isOpen && (
        // modal-open DaisyUI handles root overflow and gutter
        <div className="fixed inset-0 z-50 flex items-center justify-center modal-open">
          <div
            className="inset-0 -z-10 bg-black opacity-75 fixed"
            onClick={closeModal}
          />
          <button
            type="button"
            className="absolute z-30 top-4 right-4 btn btn-circle"
            onClick={closeModal}
          >
            <FaXmark />
          </button>
          <div className="embla select-none">
            <div className="embla__viewport cursor-grab" ref={emblaRef}>
              <div className="embla__container">
                {images.map((src, idx) => (
                  <div key={idx} className="grid place-items-center">
                    <img src={src} className="max-w-[70%]" alt="" />
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-r z-20 from-[rgba(0,0,0,0.75)] to-transparent fixed top-0 bottom-0 left-0 px-2 grid place-items-center">
              <button
                type="button"
                className="btn btn-circle"
                onClick={scrollPrev}
              >
                <FaAngleLeft />
              </button>
            </div>
            <div className="bg-gradient-to-l z-20 from-[rgba(0,0,0,0.75)] to-transparent fixed top-0 bottom-0 right-0 px-2 grid place-items-center">
              <button
                type="button"
                className="btn btn-circle"
                onClick={scrollNext}
              >
                <FaAngleRight />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
