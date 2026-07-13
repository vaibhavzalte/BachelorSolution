'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight, X, Play, Film } from 'lucide-react';
import { ListingMediaItem } from '@/types/listing.types';
import { cn } from '@/lib/utils';

interface ListingMediaGalleryProps {
  open: boolean;
  onClose: () => void;
  media: ListingMediaItem[];
  initialIndex?: number;
  title: string;
}

export default function ListingMediaGallery({
  open,
  onClose,
  media,
  initialIndex = 0,
  title,
}: ListingMediaGalleryProps) {
  const [intActiveIndex, setIntActiveIndex] = useState(initialIndex);
  const [arrEmblaRef, objEmblaApi] = useEmblaCarousel({ loop: true, startIndex: initialIndex });

  const onSelect = useCallback(() => {
    if (!objEmblaApi) return;
    setIntActiveIndex(objEmblaApi.selectedScrollSnap());
  }, [objEmblaApi]);

  useEffect(() => {
    if (!objEmblaApi) return;
    onSelect();
    objEmblaApi.on('select', onSelect);
    objEmblaApi.on('reInit', onSelect);
    return () => {
      objEmblaApi.off('select', onSelect);
      objEmblaApi.off('reInit', onSelect);
    };
  }, [objEmblaApi, onSelect]);

  useEffect(() => {
    if (open && objEmblaApi) {
      objEmblaApi.scrollTo(initialIndex, true);
      setIntActiveIndex(initialIndex);
    }
  }, [open, initialIndex, objEmblaApi]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (objEvent: KeyboardEvent) => {
      if (objEvent.key === 'Escape') onClose();
      if (objEvent.key === 'ArrowLeft') objEmblaApi?.scrollPrev();
      if (objEvent.key === 'ArrowRight') objEmblaApi?.scrollNext();
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose, objEmblaApi]);

  const scrollPrev = useCallback(() => objEmblaApi?.scrollPrev(), [objEmblaApi]);
  const scrollNext = useCallback(() => objEmblaApi?.scrollNext(), [objEmblaApi]);
  const scrollTo = useCallback(
    (intIndex: number) => objEmblaApi?.scrollTo(intIndex),
    [objEmblaApi],
  );

  if (!open || typeof document === 'undefined') return null;

  const objActiveItem = media[intActiveIndex];

  return createPortal(
    <div className="fixed inset-0 z-[100] flex flex-col bg-black/95 backdrop-blur-sm animate-in fade-in-0 duration-200">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 sm:px-6 shrink-0">
        <div className="min-w-0 flex-1 pr-4">
          <p className="text-sm font-semibold text-white truncate">{title}</p>
          <p className="text-xs text-white/50 mt-0.5">
            {intActiveIndex + 1} of {media.length}
            {objActiveItem?.type === 'video' && ' · Video'}
          </p>
        </div>
        <button
          onClick={onClose}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors shrink-0"
          aria-label="Close gallery"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Main carousel */}
      <div className="relative flex-1 flex items-center justify-center min-h-0 px-12 sm:px-16">
        {media.length > 1 && (
          <>
            <button
              onClick={scrollPrev}
              className="absolute left-2 sm:left-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
              aria-label="Previous"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={scrollNext}
              className="absolute right-2 sm:right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
              aria-label="Next"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        <div className="w-full h-full max-h-[70vh] overflow-hidden" ref={arrEmblaRef}>
          <div className="flex h-full">
            {media.map((objItem, intIndex) => (
              <div
                key={`${objItem.url}-${intIndex}`}
                className="flex-[0_0_100%] min-w-0 h-full flex items-center justify-center px-2"
              >
                <div className="relative w-full h-full max-w-4xl mx-auto rounded-2xl overflow-hidden bg-black/40">
                  {objItem.type === 'video' ? (
                    <video
                      src={objItem.url}
                      controls
                      playsInline
                      className="w-full h-full max-h-[70vh] object-contain"
                    />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={objItem.url}
                      alt={`${title} - ${intIndex + 1}`}
                      className="w-full h-full max-h-[70vh] object-contain"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Thumbnail strip */}
      {media.length > 1 && (
        <div className="shrink-0 px-4 pb-4 sm:px-6 sm:pb-6">
          <div className="flex gap-2 overflow-x-auto scrollbar-none justify-center py-2">
            {media.map((objItem, intIndex) => {
              const boolIsActive = intIndex === intActiveIndex;
              return (
                <button
                  key={`thumb-${objItem.url}-${intIndex}`}
                  onClick={() => scrollTo(intIndex)}
                  className={cn(
                    'relative h-14 w-14 sm:h-16 sm:w-16 shrink-0 rounded-xl overflow-hidden border-2 transition-all duration-200',
                    boolIsActive
                      ? 'border-white scale-105 shadow-lg shadow-white/20'
                      : 'border-white/20 opacity-60 hover:opacity-90 hover:border-white/40',
                  )}
                  aria-label={`View item ${intIndex + 1}`}
                >
                  {objItem.type === 'video' ? (
                    <div className="h-full w-full bg-zinc-800 flex items-center justify-center">
                      <Film className="h-4 w-4 text-white/70" />
                    </div>
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={objItem.url}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  )}
                  {objItem.type === 'video' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <Play className="h-3 w-3 text-white fill-white" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Dot indicators */}
          <div className="flex justify-center gap-1.5 mt-2">
            {media.map((_, intIndex) => (
              <button
                key={`dot-${intIndex}`}
                onClick={() => scrollTo(intIndex)}
                className={cn(
                  'h-1.5 rounded-full transition-all duration-200',
                  intIndex === intActiveIndex ? 'w-5 bg-white' : 'w-1.5 bg-white/30 hover:bg-white/50',
                )}
                aria-label={`Go to slide ${intIndex + 1}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>,
    document.body,
  );
}
