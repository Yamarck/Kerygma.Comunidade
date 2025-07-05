import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Quote } from "lucide-react";

export default function DevotionalBanner({ messages }) {
  const [currentMessage, setCurrentMessage] = useState(0);

  useEffect(() => {
    if (messages.length > 0) {
      const interval = setInterval(() => {
        setCurrentMessage((prev) => (prev + 1) % messages.length);
      }, 8000);
      return () => clearInterval(interval);
    }
  }, [messages.length]);

  if (messages.length === 0) {
    return (
      <section className="py-8 bg-orange-600">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-white/10 border-orange-400 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <BookOpen className="w-8 h-8 mx-auto mb-4 text-orange-100" />
              <h3 className="text-xl font-semibold text-white mb-2">
                Mensagem Devocional
              </h3>
              <p className="text-orange-100">
                Mensagens devocionais aparecerão aqui
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  const message = messages[currentMessage];

  return (
    <section className="py-8 bg-orange-600">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="bg-white/10 border-orange-400 backdrop-blur-sm">
          <CardContent className="p-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                <Quote className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-white mb-2">
                  {message.title}
                </h3>
                <p className="text-orange-100 text-lg leading-relaxed mb-4">
                  {message.content}
                </p>
                <div className="border-l-4 border-orange-300 pl-4">
                  <p className="text-white font-medium text-lg italic">
                    "{message.verse}"
                  </p>
                  <p className="text-orange-200 text-sm mt-1">
                    {message.verse_reference}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Indicators */}
        {messages.length > 1 && (
          <div className="flex justify-center mt-4 gap-2">
            {messages.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentMessage
                    ? 'bg-white scale-125'
                    : 'bg-orange-300 hover:bg-orange-200'
                }`}
                onClick={() => setCurrentMessage(index)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}