import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, ChevronLeft, ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function VideoCarousel({ videos, isLoading }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (videos.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % videos.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [videos.length]);

  const nextVideo = () => {
    setCurrentIndex((prev) => (prev + 1) % videos.length);
  };

  const prevVideo = () => {
    setCurrentIndex((prev) => (prev - 1 + videos.length) % videos.length);
  };

  if (isLoading) {
    return (
      <div className="relative max-w-4xl mx-auto">
        <Skeleton className="w-full h-96 rounded-2xl" />
        <div className="flex justify-center mt-4 gap-2">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="w-3 h-3 rounded-full" />
          ))}
        </div>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="relative max-w-4xl mx-auto">
        <Card className="bg-gray-100 border-2 border-dashed border-gray-300">
          <CardContent className="p-12 text-center">
            <Play className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Nenhum vídeo em destaque
            </h3>
            <p className="text-gray-500">
              Vídeos em destaque aparecerão aqui em breve
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="relative max-w-4xl mx-auto">
      <div className="relative overflow-hidden rounded-2xl shadow-2xl">
        {videos.map((video, index) => (
          <div
            key={video.id}
            className={`transition-transform duration-500 ease-in-out ${
              index === currentIndex ? 'translate-x-0' : 'translate-x-full'
            }`}
            style={{
              transform: `translateX(${(index - currentIndex) * 100}%)`,
              position: index === currentIndex ? 'relative' : 'absolute',
              top: 0,
              left: 0,
              width: '100%',
            }}
          >
            <div className="relative aspect-video bg-gray-900">
              {video.thumbnail_url ? (
                <img
                  src={video.thumbnail_url}
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                  <Play className="w-16 h-16 text-white opacity-70" />
                </div>
              )}
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-2xl font-bold text-white mb-2">{video.title}</h3>
                <p className="text-gray-200 mb-4 max-w-2xl">{video.description}</p>
                <Button
                  size="lg"
                  className="gradient-orange text-white hover:opacity-90"
                  onClick={() => window.open(video.video_url, "_blank")}
                >
                  <Play className="w-5 h-5 mr-2" />
                  Assistir Agora
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      {videos.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white"
            onClick={prevVideo}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white"
            onClick={nextVideo}
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </>
      )}

      {/* Indicators */}
      {videos.length > 1 && (
        <div className="flex justify-center mt-4 gap-2">
          {videos.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-orange-600 scale-110'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
}