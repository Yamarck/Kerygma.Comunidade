import React, { useState, useEffect } from "react";
import { Video } from "@/api/entities";
import { DevotionalMessage } from "@/api/entities";
import { PrayerRequest } from "@/api/entities";
import { Member } from "@/api/entities";
import { Music } from "@/api/entities";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Play, 
  Heart, 
  Users, 
  Music as MusicIcon, 
  Video as VideoIcon, 
  Download,
  ArrowRight,
  Headphones,
  BookOpen,
  Clock,
  MapPin
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import VideoCarousel from "../components/home/VideoCarousel";
import DevotionalBanner from "../components/home/DevotionalBanner";
import QuickStats from "../components/home/QuickStats";
import FeaturedSections from "../components/home/FeaturedSections";
import LiveRadioWidget from "../components/home/LiveRadioWidget";

export default function Home() {
  const [featuredVideos, setFeaturedVideos] = useState([]);
  const [devotionalMessages, setDevotionalMessages] = useState([]);
  const [recentPrayers, setRecentPrayers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [videos, devotionals, prayers] = await Promise.all([
        Video.filter({ featured: true }, "-created_date", 5),
        DevotionalMessage.filter({ is_active: true }, "display_order", 10),
        PrayerRequest.filter({ is_approved: true, is_public: true }, "-created_date", 5)
      ]);

      setFeaturedVideos(videos);
      setDevotionalMessages(devotionals);
      setRecentPrayers(prayers);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section with Video Carousel */}
      <section className="relative bg-gradient-to-br from-orange-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
              Bem-vindos ao
              <span className="text-primary-orange block">Portal Igreja</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Um lugar onde a fé ganha vida através da comunidade, adoração e a Palavra de Deus
            </p>
          </div>
          
          <VideoCarousel videos={featuredVideos} isLoading={isLoading} />
        </div>
      </section>

      {/* Devotional Banner */}
      <DevotionalBanner messages={devotionalMessages} />

      {/* Quick Stats */}
      <QuickStats />

      {/* Featured Sections */}
      <FeaturedSections />

      {/* Live Radio Widget */}
      <LiveRadioWidget />

      {/* Recent Prayer Requests */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Pedidos de Oração
            </h2>
            <p className="text-xl text-gray-600">
              Ore conosco por estas necessidades
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {recentPrayers.map((prayer) => (
              <Card key={prayer.id} className="hover-lift">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Heart className="w-5 h-5 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{prayer.name}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{prayer.request}</p>
                      <Badge variant="secondary" className="mt-2">
                        {prayer.category}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center">
            <Link to={createPageUrl("Prayer")}>
              <Button className="gradient-orange text-white hover:opacity-90">
                Ver todos os pedidos
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 gradient-orange">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Faça Parte da Nossa Comunidade
          </h2>
          <p className="text-xl text-orange-100 mb-8">
            Cadastre-se e conecte-se com nossa família de fé
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={createPageUrl("Members")}>
              <Button 
                size="lg" 
                variant="outline"
                className="bg-white text-orange-600 border-white hover:bg-orange-50"
              >
                <Users className="w-5 h-5 mr-2" />
                Cadastrar-se
              </Button>
            </Link>
            <Button 
              size="lg" 
              variant="outline"
              className="border-orange-200 text-white hover:bg-orange-600"
              onClick={() => window.open("https://wa.me/5511999999999", "_blank")}
            >
              <MapPin className="w-5 h-5 mr-2" />
              Nos Visite
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}