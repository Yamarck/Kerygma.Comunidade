import React, { useState, useEffect } from "react";
import { Member } from "@/api/entities";
import { User } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Users, UserPlus, Mail, Phone, MapPin, MessageSquare } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function MembersPage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showRegistration, setShowRegistration] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    testimony: ""
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    checkUserAndLoadMembers();
  }, []);

  const checkUserAndLoadMembers = async () => {
    try {
      const user = await User.me();
      setCurrentUser(user);
    } catch (error) {
      setCurrentUser(null);
      setShowRegistration(true);
    }
    
    try {
      const memberList = await Member.list("-created_date");
      setMembers(memberList);
    } catch (error) {
      console.error("Error loading members:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      setMessage("Nome e email são obrigatórios");
      return;
    }

    try {
      await Member.create(formData);
      setMessage("Cadastro realizado com sucesso! Agora você pode fazer login.");
      setFormData({
        name: "",
        email: "",
        phone: "",
        city: "",
        testimony: ""
      });
      await loadMembers();
    } catch (error) {
      setMessage("Erro ao realizar cadastro. Tente novamente.");
      console.error("Error creating member:", error);
    }
  };

  const loadMembers = async () => {
    try {
      const memberList = await Member.list("-created_date");
      setMembers(memberList);
    } catch (error) {
      console.error("Error loading members:", error);
    }
  };

  const handleLogin = async () => {
    try {
      await User.login();
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Nossa Comunidade
          </h1>
          <p className="text-xl text-gray-600">
            {currentUser ? 
              "Conecte-se com outros membros da igreja" : 
              "Faça parte da nossa família de fé"
            }
          </p>
        </div>

        {/* User Status */}
        {!currentUser ? (
          <div className="max-w-2xl mx-auto mb-12">
            <Card className="border-orange-200">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2 text-2xl">
                  <UserPlus className="w-8 h-8 text-orange-600" />
                  Entre na Nossa Comunidade
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center space-y-4">
                  <p className="text-gray-600">
                    Para acessar o chat privado e todas as funcionalidades, você precisa:
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      onClick={() => setShowRegistration(!showRegistration)}
                      className="gradient-orange text-white"
                    >
                      {showRegistration ? "Ocultar Cadastro" : "Cadastrar-se"}
                    </Button>
                    <Button
                      onClick={handleLogin}
                      variant="outline"
                      className="border-orange-200 text-orange-600 hover:bg-orange-50"
                    >
                      Já sou membro - Fazer Login
                    </Button>
                  </div>
                </div>

                {message && (
                  <Alert className={message.includes("sucesso") ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
                    <AlertDescription className={message.includes("sucesso") ? "text-green-800" : "text-red-800"}>
                      {message}
                    </AlertDescription>
                  </Alert>
                )}

                {showRegistration && (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Nome Completo *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          placeholder="Seu nome completo"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          placeholder="seu@email.com"
                          required
                        />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone">Telefone</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          placeholder="(11) 99999-9999"
                        />
                      </div>
                      <div>
                        <Label htmlFor="city">Cidade</Label>
                        <Input
                          id="city"
                          value={formData.city}
                          onChange={(e) => handleInputChange("city", e.target.value)}
                          placeholder="Sua cidade"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="testimony">Testemunho (Opcional)</Label>
                      <Textarea
                        id="testimony"
                        value={formData.testimony}
                        onChange={(e) => handleInputChange("testimony", e.target.value)}
                        placeholder="Compartilhe como Deus tem agido em sua vida..."
                        className="h-24"
                      />
                    </div>
                    <Button type="submit" className="w-full gradient-orange text-white">
                      Cadastrar-se Agora
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="text-center mb-8">
            <Card className="max-w-md mx-auto border-green-200 bg-green-50">
              <CardContent className="p-6">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Badge className="gradient-orange text-white">Conectado</Badge>
                </div>
                <p className="text-green-800">
                  Olá, <strong>{currentUser.full_name}</strong>! 
                  Agora você pode usar o chat privado e todas as funcionalidades.
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Members List */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map((member) => (
            <Card key={member.id} className="hover-lift">
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl font-bold text-orange-600">
                      {member.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {member.name}
                  </h3>
                  <Badge variant="secondary" className="mt-1">
                    {member.status}
                  </Badge>
                </div>
                
                <div className="space-y-2 text-sm text-gray-600">
                  {member.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span>{member.email}</span>
                    </div>
                  )}
                  {member.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      <span>{member.phone}</span>
                    </div>
                  )}
                  {member.city && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{member.city}</span>
                    </div>
                  )}
                </div>

                {member.testimony && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700 italic">
                      "{member.testimony}"
                    </p>
                  </div>
                )}

                {currentUser && (
                  <div className="mt-4 pt-4 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-orange-200 text-orange-600 hover:bg-orange-50"
                      onClick={() => window.location.href = `/chat?user=${member.email}`}
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Conversar
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {members.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Ainda não há membros cadastrados
            </h3>
            <p className="text-gray-500">
              Seja o primeiro a se cadastrar em nossa comunidade!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}