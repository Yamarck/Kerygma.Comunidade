
import React, { useMemo, useState } from "react";
import { User } from "@/api/entities";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function ConversationList({
  users,
  messages,
  currentUser,
  selectedConversation,
  onSelectConversation,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const conversations = useMemo(() => {
    if (!currentUser) return [];

    const conversationsMap = new Map();

    messages.forEach((message) => {
      const otherUserEmail =
        message.created_by === currentUser.email
          ? message.receiver_email
          : message.created_by;
      
      if (otherUserEmail === currentUser.email) return;

      if (!conversationsMap.has(otherUserEmail)) {
        conversationsMap.set(otherUserEmail, {
          lastMessage: message,
          unreadCount: 0,
        });
      }

      const conversation = conversationsMap.get(otherUserEmail);
      // Update last message if current message is newer
      if (new Date(message.created_date) > new Date(conversation.lastMessage.created_date)) {
        conversation.lastMessage = message;
      }
      // Increment unread count for messages received by currentUser that are unread
      if (message.receiver_email === currentUser.email && !message.is_read) {
        conversation.unreadCount++;
      }
    });

    // Adiciona todos os usuários que ainda não tem conversa
    users.forEach(user => {
        if(user.email !== currentUser.email && !conversationsMap.has(user.email)) {
             conversationsMap.set(user.email, {
                lastMessage: null,
                unreadCount: 0
             });
        }
    });


    return Array.from(conversationsMap.entries())
      .map(([email, data]) => ({
        email,
        user: users.find((u) => u.email === email),
        ...data,
      }))
      .sort((a, b) => {
        if (!a.lastMessage) return 1; // Users without messages go to the end
        if (!b.lastMessage) return -1; // Users without messages go to the end
        return new Date(b.lastMessage.created_date) - new Date(a.lastMessage.created_date);
      });
  }, [messages, currentUser, users]);
  
  const filteredUsers = useMemo(() => {
    return users.filter(user => 
      user.email !== currentUser?.email &&
      user.full_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, currentUser, searchTerm]);

  const handleSelectUserFromModal = (email) => {
    onSelectConversation(email);
    setIsModalOpen(false);
    setSearchTerm(""); // Reset search term after selection
  };

  return (
    <div className="w-full md:w-1/3 lg:w-1/4 border-r border-gray-200 overflow-y-auto">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-xl font-bold">Conversas</h2>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" className="text-orange-600 hover:bg-orange-50">
              <PlusCircle className="w-5 h-5" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova Conversa</DialogTitle>
            </DialogHeader>
            <div className="p-1">
              <Input
                placeholder="Buscar membro..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mb-4"
              />
              <div className="max-h-80 overflow-y-auto">
                {filteredUsers.map((user) => (
                  <div
                    key={user.email}
                    onClick={() => handleSelectUserFromModal(user.email)}
                    className="flex items-center p-2 rounded-lg cursor-pointer hover:bg-gray-100"
                  >
                    <Avatar className="h-9 w-9 mr-3">
                      <AvatarImage src={user.avatar_url} alt={user.full_name} />
                      <AvatarFallback className="bg-orange-100 text-orange-600">
                        {user.full_name?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <p className="font-medium text-gray-800">{user.full_name}</p>
                  </div>
                ))}
                {filteredUsers.length === 0 && (
                  <p className="text-center text-gray-500 py-4">Nenhum membro encontrado.</p>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex flex-col">
        {conversations.map(({ email, user, lastMessage, unreadCount }) => {
          if (!user) return null;

          const isSelected = selectedConversation === email;

          return (
            <div
              key={email}
              onClick={() => onSelectConversation(email)}
              className={`flex items-center p-3 cursor-pointer transition-colors ${
                isSelected ? "bg-orange-50" : "hover:bg-gray-50"
              }`}
            >
              <Avatar className="h-10 w-10 mr-3">
                <AvatarImage src={user.avatar_url} alt={user.full_name} />
                <AvatarFallback className="bg-orange-100 text-orange-600">
                  {user.full_name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <p className="font-semibold text-gray-800 truncate">{user.full_name}</p>
                  {lastMessage && (
                     <p className="text-xs text-gray-400">
                     {formatDistanceToNow(new Date(lastMessage.created_date), {
                       addSuffix: true,
                       locale: ptBR,
                     })}
                   </p>
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-500 truncate">
                    {lastMessage ? lastMessage.content : "Inicie a conversa"}
                  </p>
                  {unreadCount > 0 && (
                    <Badge className="gradient-orange text-white rounded-full h-5 px-2 text-xs">
                      {unreadCount}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
