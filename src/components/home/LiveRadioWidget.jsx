import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Radio, Play, Pause, Volume2 } from "lucide-react";

export default function LiveRadioWidget() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioRef, setAudioRef] = useState(null);

  const toggleRadio = () => {
    if (audioRef) {
      if (isPlaying) {
        audioRef.pause();
      } else {
        audioRef.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <section className="py-16 bg-gradient-to-r from-orange-500 to-orange-600">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="bg-white/10 border-orange-400 backdrop-blur-sm">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex-shrink-0">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                  <Radio className="w-10 h-10 text-white" />
                </div>
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-bold text-white mb-2">
                  Rádio Igreja 24h
                </h3>
                <p className="text-orange-100 text-lg mb-4">
                  Música cristã, pregações e conteúdo edificante o dia todo
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-white text-orange-600 border-white hover:bg-orange-50"
                    onClick={toggleRadio}
                  >
                    {isPlaying ? (
                      <Pause className="w-5 h-5 mr-2" />
                    ) : (
                      <Play className="w-5 h-5 mr-2" />
                    )}
                    {isPlaying ? 'Pausar' : 'Ouvir Agora'}
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-orange-200 text-white hover:bg-orange-600"
                  >
                    <Volume2 className="w-5 h-5 mr-2" />
                    Programação
                  </Button>
                </div>
              </div>
              
              <div className="flex-shrink-0">
                <div className="bg-white/20 rounded-lg p-4">
                  <div className="text-white text-center">
                    <div className="text-sm opacity-75">Agora tocando</div>
                    <div className="font-semibold">Louvor & Adoração</div>
                    <div className="text-sm opacity-75">Música Cristã</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Hidden Audio Element */}
      <audio
        ref={setAudioRef}
        preload="none"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onError={() => setIsPlaying(false)}
      >
        <source src="https://streams.example.com/radio" type="audio/mpeg" />
        Seu navegador não suporta áudio HTML5.
      </audio>
    </section>
  );
}