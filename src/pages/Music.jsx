import React, { useState, useEffect } from "react";
import { Music as MusicEntity } from "@/api/entities";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, Pause, Music as MusicIcon, Heart, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Music() {
  const [musics, setMusics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [audioRef, setAudioRef] = useState(null);

  useEffect(() => {
    loadMusics();
  }, []);

  const loadMusics = async () => {
    try {
      const data = await MusicEntity.list("-created_date");
      setMusics(data);
    } catch (error) {
      console.error("Error loading musics:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePlay = (music) => {
    if (currentlyPlaying?.id === music.id) {
      if (audioRef) {
        audioRef.pause();
        setCurrentlyPlaying(null);
      }
    } else {
      if (audioRef) {
        audioRef.src = music.audio_url;
        audioRef.play();
        setCurrentlyPlaying(music);
      }
    }
  };

  const playlists = [
    { id: "all", name: "Todas", count: musics.length },
    { id: "louvor", name: "Louvor", count: musics.filter(m => m.playlist === "louvor").length },
    { id: "adoracao", name: "Adoração", count: musics.filter(m => m.playlist === "adoracao").length },
    { id: "instrumental", name: "Instrumental", count: musics.filter(m => m.playlist === "instrumental").length },
    { id: "kids", name: "Infantil", count: musics.filter(m => m.playlist === "kids").length },
    { id: "especial", name: "Especial", count: musics.filter(m => m.playlist === "especial").length }
  ];

  const getFilteredMusics = (playlist) => {
    return playlist === "all" ? musics : musics.filter(m => m.playlist === playlist);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Músicas
          </h1>
          <p className="text-xl text-gray-600">
            Louvores e adoração para edificar seu coração
          </p>
        </div>

        {/* Playlists */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 mb-8">
            {playlists.map((playlist) => (
              <TabsTrigger key={playlist.id} value={playlist.id} className="flex flex-col">
                <span className="font-medium">{playlist.name}</span>
                <span className="text-xs text-gray-500">({playlist.count})</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {playlists.map((playlist) => (
            <TabsContent key={playlist.id} value={playlist.id}>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                  Array(6).fill(0).map((_, i) => (
                    <Card key={i}>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                          <Skeleton className="w-16 h-16 rounded-lg" />
                          <div className="flex-1">
                            <Skeleton className="h-4 w-3/4 mb-2" />
                            <Skeleton className="h-3 w-1/2 mb-2" />
                            <Skeleton className="h-3 w-1/3" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  getFilteredMusics(playlist.id).map((music) => (
                    <Card key={music.id} className="hover-lift">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="relative">
                            <div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center">
                              {music.cover_url ? (
                                <img 
                                  src={music.cover_url} 
                                  alt={music.title}
                                  className="w-full h-full object-cover rounded-lg"
                                />
                              ) : (
                                <MusicIcon className="w-8 h-8 text-orange-600" />
                              )}
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-orange-600 hover:bg-orange-700 text-white"
                              onClick={() => togglePlay(music)}
                            >
                              {currentlyPlaying?.id === music.id ? (
                                <Pause className="w-4 h-4" />
                              ) : (
                                <Play className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 truncate">
                              {music.title}
                            </h3>
                            <p className="text-sm text-gray-600 mb-2">
                              {music.artist}
                            </p>
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="secondary" className="text-xs">
                                {music.playlist}
                              </Badge>
                              {music.duration && (
                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                  <Clock className="w-3 h-3" />
                                  {music.duration}
                                </div>
                              )}
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-gray-500 hover:text-red-500 p-0"
                            >
                              <Heart className="w-4 h-4 mr-1" />
                              Favoritar
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Audio Player */}
        <audio
          ref={setAudioRef}
          onEnded={() => setCurrentlyPlaying(null)}
          onError={() => setCurrentlyPlaying(null)}
          controls
          className="hidden"
        />

        {/* Current Playing */}
        {currentlyPlaying && (
          <div className="fixed bottom-4 left-4 right-4 bg-white shadow-lg rounded-lg p-4 border-t border-orange-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <MusicIcon className="w-6 h-6 text-orange-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">
                  {currentlyPlaying.title}
                </h4>
                <p className="text-sm text-gray-600">
                  {currentlyPlaying.artist}
                </p>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => togglePlay(currentlyPlaying)}
              >
                <Pause className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}