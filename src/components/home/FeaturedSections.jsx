import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Music, Video, Download, Heart, ArrowRight } from "lucide-react";

export default function FeaturedSections() {
  const sections = [
    {
      title: "Músicas",
      description: "Ouça nossa coletânea de louvores e adoração",
      icon: Music,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      link: createPageUrl("Music"),
      features: ["Playlists organizadas", "Louvores e adoração", "Música instrumental"]
    },
    {
      title: "Vídeos",
      description: "Assista sermões, testemunhos e eventos",
      icon: Video,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      link: createPageUrl("Videos"),
      features: ["Sermões completos", "Testemunhos", "Eventos especiais"]
    },
    {
      title: "Downloads",
      description: "Baixe estudos, devocionais e recursos",
      icon: Download,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      link: createPageUrl("Downloads"),
      features: ["Estudos bíblicos", "Devocionais", "Recursos gratuitos"]
    },
    {
      title: "Oração",
      description: "Compartilhe pedidos e ore com a comunidade",
      icon: Heart,
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      link: createPageUrl("Prayer"),
      features: ["Pedidos de oração", "Mural comunitário", "Oração interativa"]
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Explore Nossos Recursos
          </h2>
          <p className="text-xl text-gray-600">
            Descubra tudo o que preparamos para você
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {sections.map((section, index) => (
            <Card key={index} className={`hover-lift border-2 ${section.borderColor}`}>
              <CardContent className="p-6">
                <div className={`w-16 h-16 mx-auto mb-4 ${section.bgColor} rounded-full flex items-center justify-center`}>
                  <section.icon className={`w-8 h-8 ${section.color}`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 text-center">
                  {section.title}
                </h3>
                <p className="text-gray-600 text-center mb-4">
                  {section.description}
                </p>
                <ul className="space-y-2 mb-6">
                  {section.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link to={section.link} className="block">
                  <Button className="w-full gradient-orange text-white hover:opacity-90">
                    Explorar
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}