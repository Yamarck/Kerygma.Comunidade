import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Heart, Video, Music, Calendar, MapPin } from "lucide-react";
import { Member } from "@/api/entities";
import { PrayerRequest } from "@/api/entities";
import { Video as VideoEntity } from "@/api/entities";
import { Music as MusicEntity } from "@/api/entities";

export default function QuickStats() {
  const [stats, setStats] = useState({
    members: 0,
    prayers: 0,
    videos: 0,
    musics: 0
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [members, prayers, videos, musics] = await Promise.all([
        Member.list(),
        PrayerRequest.list(),
        VideoEntity.list(),
        MusicEntity.list()
      ]);

      setStats({
        members: members.length,
        prayers: prayers.length,
        videos: videos.length,
        musics: musics.length
      });
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  const statsData = [
    {
      title: "Membros",
      value: stats.members,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Pedidos de Oração",
      value: stats.prayers,
      icon: Heart,
      color: "text-red-600",
      bgColor: "bg-red-50"
    },
    {
      title: "Vídeos",
      value: stats.videos,
      icon: Video,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Músicas",
      value: stats.musics,
      icon: Music,
      color: "text-green-600",
      bgColor: "bg-green-50"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Nossa Comunidade em Números
          </h2>
          <p className="text-xl text-gray-600">
            Veja o impacto que estamos fazendo juntos
          </p>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {statsData.map((stat, index) => (
            <Card key={index} className="hover-lift">
              <CardContent className="p-6 text-center">
                <div className={`w-16 h-16 mx-auto mb-4 ${stat.bgColor} rounded-full flex items-center justify-center`}>
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">
                  {stat.value.toLocaleString()}
                </h3>
                <p className="text-gray-600 font-medium">{stat.title}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Church Info */}
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="hover-lift">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Horários dos Cultos
                  </h3>
                  <div className="space-y-1 text-gray-600">
                    <p><strong>Domingos:</strong> 10h e 19h</p>
                    <p><strong>Quartas:</strong> 20h (Estudo Bíblico)</p>
                    <p><strong>Sextas:</strong> 20h (Jovens)</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover-lift">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Nossa Localização
                  </h3>
                  <div className="space-y-1 text-gray-600">
                    <p>Rua da Igreja, 123</p>
                    <p>Centro - São Paulo/SP</p>
                    <p>CEP: 01234-567</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}