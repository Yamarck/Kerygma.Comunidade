

import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { User } from "@/api/entities";
import { Message } from "@/api/entities";
import {
  Home,
  Music,
  Video,
  Download,
  Heart,
  Users,
  Radio,
  MessageSquare, // Adicionado
  BarChart3,
  Settings,
  Menu,
  X,
  Phone,
  MessageCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";

const navigationItems = [
  { title: "Início", url: createPageUrl("Home"), icon: Home },
  { title: "Músicas", url: createPageUrl("Music"), icon: Music },
  { title: "Vídeos", url: createPageUrl("Videos"), icon: Video },
  { title: "Downloads", url: createPageUrl("Downloads"), icon: Download },
  { title: "Oração", url: createPageUrl("Prayer"), icon: Heart },
  { title: "Membros", url: createPageUrl("Members"), icon: Users },
  { title: "Chat", url: createPageUrl("Chat"), icon: MessageSquare }, // Adicionado
  { title: "Rádio", url: createPageUrl("Radio"), icon: Radio },
  { title: "Estatísticas", url: createPageUrl("Stats"), icon: BarChart3 },
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchUserAndMessages = async () => {
      try {
        const user = await User.me();
        setCurrentUser(user);
        if (user) {
          fetchUnreadCount(user);
        }
      } catch (e) {
        // User not logged in
        setCurrentUser(null);
      }
    };
    fetchUserAndMessages();
  }, [location.pathname]);

  useEffect(() => {
    if (!currentUser) return;
    const interval = setInterval(() => fetchUnreadCount(currentUser), 10000); // Check every 10 seconds
    return () => clearInterval(interval);
  }, [currentUser]);

  const fetchUnreadCount = async (user) => {
    try {
      const unreadMessages = await Message.filter({
        receiver_email: user.email,
        is_read: false,
      });
      setUnreadCount(unreadMessages.length);
    } catch (error) {
      console.error("Failed to fetch unread messages count", error);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <style>{`
        :root {
          --primary-orange: #FF6A00;
          --primary-white: #FFFFFF;
          --primary-black: #000000;
          --light-gray: #F8F9FA;
          --medium-gray: #6B7280;
          --border-gray: #E5E7EB;
        }

        .gradient-orange {
          background: linear-gradient(135deg, var(--primary-orange) 0%, #FF8A3D 100%);
        }

        .text-primary-orange {
          color: var(--primary-orange);
        }

        .border-primary-orange {
          border-color: var(--primary-orange);
        }

        .hover-lift {
          transition: all 0.3s ease;
        }

        .hover-lift:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(255, 106, 0, 0.2);
        }

        @keyframes pulse-orange {
          0%, 100% { box-shadow: 0 0 0 0 rgba(255, 106, 0, 0.4); }
          50% { box-shadow: 0 0 0 10px rgba(255, 106, 0, 0); }
        }

        .pulse-orange {
          animation: pulse-orange 2s infinite;
        }
      `}</style>

      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to={createPageUrl("Home")} className="flex items-center gap-3">
              <div className="w-10 h-10 gradient-orange rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">I</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-gray-900">Portal Igreja</h1>
                <p className="text-xs text-gray-500">Conectando corações</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.title}
                  to={item.url}
                  className={`relative flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-orange-50 hover:text-orange-600 ${
                    location.pathname === item.url
                      ? "bg-orange-50 text-orange-600"
                      : "text-gray-700"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.title}</span>
                  {item.title === 'Chat' && unreadCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center gradient-orange text-white text-xs rounded-full">
                      {unreadCount}
                    </Badge>
                  )}
                </Link>
              ))}
            </nav>

            {/* Contact Actions */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="hidden sm:flex items-center gap-2 border-orange-200 text-orange-600 hover:bg-orange-50"
                onClick={() => window.open("https://wa.me/5511999999999", "_blank")}
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="hidden sm:flex items-center gap-2 border-orange-200 text-orange-600 hover:bg-orange-50"
                onClick={() => window.open("tel:+5511999999999", "_blank")}
              >
                <Phone className="w-4 h-4" />
                Ligar
              </Button>

              {/* Mobile Menu */}
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-72">
                  <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between pb-4 border-b">
                      <h2 className="text-lg font-semibold">Menu</h2>
                    </div>
                    <nav className="flex-1 pt-4">
                      <div className="space-y-2">
                        {navigationItems.map((item) => (
                          <Link
                            key={item.title}
                            to={item.url}
                            onClick={() => setMobileMenuOpen(false)}
                            className={`relative flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                              location.pathname === item.url
                                ? "bg-orange-50 text-orange-600"
                                : "text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            <item.icon className="w-5 h-5" />
                            <span>{item.title}</span>
                            {item.title === 'Chat' && unreadCount > 0 && (
                              <Badge className="absolute top-2 right-2 h-5 w-5 p-0 flex items-center justify-center gradient-orange text-white text-xs rounded-full">
                                {unreadCount}
                              </Badge>
                            )}
                          </Link>
                        ))}
                      </div>
                    </nav>
                    <div className="pt-4 border-t space-y-2">
                      <Button
                        variant="outline"
                        className="w-full justify-start gap-2 border-orange-200 text-orange-600"
                        onClick={() => window.open("https://wa.me/5511999999999", "_blank")}
                      >
                        <MessageCircle className="w-4 h-4" />
                        WhatsApp
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start gap-2 border-orange-200 text-orange-600"
                        onClick={() => window.open("tel:+5511999999999", "_blank")}
                      >
                        <Phone className="w-4 h-4" />
                        Ligar
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 gradient-orange rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">I</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold">Portal Igreja</h3>
                  <p className="text-gray-400 text-sm">Conectando corações a Cristo</p>
                </div>
              </div>
              <p className="text-gray-400 mb-4">
                Somos uma comunidade cristã comprometida em compartilhar o amor de Jesus
                e edificar vidas através da Palavra de Deus.
              </p>
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-orange-400 text-orange-400 hover:bg-orange-400 hover:text-white"
                  onClick={() => window.open("https://wa.me/5511999999999", "_blank")}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  WhatsApp
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-orange-400 text-orange-400 hover:bg-orange-400 hover:text-white"
                  onClick={() => window.open("tel:+5511999999999", "_blank")}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  (11) 99999-9999
                </Button>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Links Rápidos</h4>
              <ul className="space-y-2">
                <li><Link to={createPageUrl("Home")} className="text-gray-400 hover:text-orange-400 transition-colors">Início</Link></li>
                <li><Link to={createPageUrl("Music")} className="text-gray-400 hover:text-orange-400 transition-colors">Músicas</Link></li>
                <li><Link to={createPageUrl("Videos")} className="text-gray-400 hover:text-orange-400 transition-colors">Vídeos</Link></li>
                <li><Link to={createPageUrl("Prayer")} className="text-gray-400 hover:text-orange-400 transition-colors">Oração</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Localização</h4>
              <div className="text-gray-400 text-sm space-y-2">
                <p>Rua da Igreja, 123</p>
                <p>Centro - São Paulo/SP</p>
                <p>CEP: 01234-567</p>
                <p className="mt-4">
                  <span className="font-semibold">Cultos:</span><br />
                  Domingos às 10h e 19h<br />
                  Quartas às 20h
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2024 Portal Igreja. Todos os direitos reservados. Desenvolvido com ❤️ para a glória de Deus.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

