
import React, { useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Lock } from "lucide-react";
import { format } from "date-fns";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function MessageArea({ messages, currentUser, otherUser, onSendMessage }) {
  const messageEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputRef.current.value) {
      onSendMessage(inputRef.current.value);
      inputRef.current.value = "";
    }
  };

  if (!otherUser) {
    return <div className="flex-1"></div>;
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="flex items-center p-3 border-b border-gray-200">
        <Avatar className="h-10 w-10 mr-3">
          <AvatarImage src={otherUser.avatar_url} alt={otherUser.full_name} />
          <AvatarFallback className="bg-orange-100 text-orange-600">
            {otherUser.full_name?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">{otherUser.full_name}</h3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Lock className="w-4 h-4 text-gray-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Esta é uma conversa privada.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((message) => {
          const isSender = message.created_by === currentUser.email;
          return (
            <div
              key={message.id}
              className={`flex items-end gap-2 ${
                isSender ? "justify-end" : "justify-start"
              }`}
            >
              {!isSender && (
                <Avatar className="h-8 w-8">
                  <AvatarImage src={otherUser.avatar_url} />
                  <AvatarFallback className="text-xs">
                    {otherUser.full_name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              )}
              <div
                className={`max-w-md p-3 rounded-2xl ${
                  isSender
                    ? "bg-orange-600 text-white rounded-br-none"
                    : "bg-white text-gray-800 border border-gray-200 rounded-bl-none"
                }`}
              >
                <p>{message.content}</p>
                <p className={`text-xs mt-1 ${isSender ? 'text-orange-100' : 'text-gray-400'} text-right`}>
                  {format(new Date(message.created_date), 'HH:mm')}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messageEndRef} />
      </div>

      {/* Input Form */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <form onSubmit={handleSubmit} className="flex items-center gap-3">
          <Input
            ref={inputRef}
            placeholder="Digite sua mensagem..."
            className="flex-1"
            autoComplete="off"
          />
          <Button type="submit" className="gradient-orange text-white" size="icon">
            <Send className="w-5 h-5" />
          </Button>
        </form>
      </div>
    </div>
  );
}
