
import React, { useState, useEffect } from "react";
import { User } from "@/api/entities";
import { Message } from "@/api/entities";
import ConversationList from "../components/chat/ConversationList";
import MessageArea from "../components/chat/MessageArea";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageSquare, Lock, UserPlus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function ChatPage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null); // email of the other user
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (!currentUser) return;
    const interval = setInterval(loadMessages, 5000); // Recarrega mensagens a cada 5 segundos
    return () => clearInterval(interval);
  }, [currentUser]);

  const loadInitialData = async () => {
    setIsLoading(true);
    try {
      const user = await User.me();
      setCurrentUser(user);
      const [users] = await Promise.all([
        User.list()
      ]);
      setAllUsers(users);
      await loadMessages(user);
    } catch (error) {
      console.error("Error loading initial chat data:", error);
      setCurrentUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMessages = async (user = currentUser) => {
    if (!user) return;
    try {
      const sent = await Message.filter({ created_by: user.email });
      const received = await Message.filter({ receiver_email: user.email });
      const allMessages = [...sent, ...received].sort(
        (a, b) => new Date(a.created_date) - new Date(b.created_date)
      );
      setMessages(allMessages);
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  };
  
  const handleSendMessage = async (content) => {
    if (!content.trim() || !selectedConversation) return;
    try {
      await Message.create({
        receiver_email: selectedConversation,
        content: content.trim(),
      });
      await loadMessages();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleSelectConversation = async (email) => {
    setSelectedConversation(email);
    // Marcar mensagens como lidas
    const unreadMessages = messages.filter(
      (m) => m.created_by === email && m.receiver_email === currentUser.email && !m.is_read
    );
    if (unreadMessages.length > 0) {
      await Promise.all(
        unreadMessages.map((m) => Message.update(m.id, { is_read: true }))
      );
      await loadMessages();
    }
  };

  // If user is not logged in
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-orange-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Chat Privado
            </h2>
            <p className="text-gray-600 mb-6">
              Para acessar o chat e conversar com outros membros, 
              você precisa estar logado em sua conta.
            </p>
            <div className="space-y-3">
              <Link to={createPageUrl("Members")}>
                <Button className="w-full gradient-orange text-white">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Cadastrar-se
                </Button>
              </Link>
              <Button
                variant="outline"
                className="w-full border-orange-200 text-orange-600 hover:bg-orange-50"
                onClick={async () => {
                  try {
                    await User.login();
                    window.location.reload();
                  } catch (error) {
                    console.error("Login error:", error);
                  }
                }}
              >
                Já sou membro - Fazer Login
              </Button>
            </div>
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 text-blue-800 text-sm">
                <Lock className="w-4 h-4" />
                <span className="font-medium">100% Privado e Seguro</span>
              </div>
              <p className="text-blue-700 text-xs mt-1">
                Suas conversas são criptografadas e visíveis apenas para você e o destinatário.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-64px)]">
        <div className="w-1/4 border-r p-4 space-y-2">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
        <div className="flex-1 p-4 flex flex-col">
          <Skeleton className="h-full w-full" />
          <Skeleton className="h-12 w-full mt-4" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-white">
      <ConversationList
        users={allUsers}
        messages={messages}
        currentUser={currentUser}
        selectedConversation={selectedConversation}
        onSelectConversation={handleSelectConversation}
      />
      
      {selectedConversation ? (
        <MessageArea
          messages={messages.filter(
            (m) =>
              (m.created_by === currentUser.email && m.receiver_email === selectedConversation) ||
              (m.created_by === selectedConversation && m.receiver_email === currentUser.email)
          )}
          currentUser={currentUser}
          otherUser={allUsers.find(u => u.email === selectedConversation)}
          onSendMessage={handleSendMessage}
        />
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-500">
          <MessageSquare className="w-24 h-24 mb-4 text-gray-300" />
          <h2 className="text-2xl font-semibold">Selecione uma conversa</h2>
          <p>Escolha um membro na lista para iniciar uma conversa.</p>
          <div className="mt-4 p-4 bg-green-50 rounded-lg max-w-sm">
            <div className="flex items-center gap-2 text-green-800 text-sm">
              <Lock className="w-4 h-4" />
              <span className="font-medium">Conversa 100% Privada</span>
            </div>
            <p className="text-green-700 text-xs mt-1">
              Apenas você e o destinatário podem ver as mensagens.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
