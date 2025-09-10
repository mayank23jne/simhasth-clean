import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  Users, 
  LogIn,
  UserCheck,
  MapPin
} from "lucide-react";
import heroImage from "@/assets/hero-dashboard.jpg";

interface LoginProps {
  onLogin: (userType: "volunteer" | "staff" | "admin", userDetails?: { username: string; name: string }) => void;
}

const demoUsers = {
  volunteer: [
    { username: "volunteer1", password: "demo123", name: "Volunteer 1" },
    { username: "volunteer2", password: "demo123", name: "Volunteer 2" },
  ],
  staff: [
    { username: "staff1", password: "demo123", name: "Raj Kumar" },
    { username: "staff2", password: "demo123", name: "Sunita Patel" },
  ],
  admin: [
    { username: "admin1", password: "demo123", name: "Admin User" },
    { username: "admin2", password: "demo123", name: "System Admin" },
  ]
};

export function Login({ onLogin }: LoginProps) {
  const { t } = useLanguage();
  const [selectedUserType, setSelectedUserType] = useState<"volunteer" | "staff" | "admin" | null>(null);
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!selectedUserType) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const users = demoUsers[selectedUserType];
      const user = users.find(u => u.username === credentials.username && u.password === credentials.password);
      
      if (user) {
        onLogin(selectedUserType, { username: user.username, name: user.name });
      } else {
        alert("Invalid credentials. Try any demo user from the list!");
      }
      setIsLoading(false);
    }, 1000);
  };

  const quickLogin = (userType: "volunteer" | "staff" | "admin") => {
    setSelectedUserType(userType);
    const demoUser = demoUsers[userType][0];
    setCredentials({ username: demoUser.username, password: demoUser.password });
    setTimeout(() => onLogin(userType, { username: demoUser.username, name: demoUser.name }), 500);
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-3 sm:p-4">
      <div className="absolute inset-0">
        <img 
          src={heroImage}
          alt="Clean City"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-hero/80" />
      </div>
      
      <Card className="w-full max-w-sm sm:max-w-md shadow-elegant relative z-10">
        <CardHeader className="text-center px-4 sm:px-6">
          <div className="flex justify-between items-center mb-2">
            <img 
              src="/Hackathon.png" 
              alt="Hackathon Logo" 
              className="h-8 w-auto object-contain"
            />
            <LanguageSwitcher variant="button" />
          </div>
                                           <div className="mx-auto w-16 h-16 sm:w-24 sm:h-24 mb-4 sm:mb-6 shadow-xl border-2 rounded-lg overflow-hidden">
                <img 
                  src="/Simhastha logo.png" 
                  alt="Simhastha Logo" 
                  className="w-full h-full object-cover"
                />
            </div>
          <CardTitle className="text-xl sm:text-2xl font-bold">{t('login.title')}</CardTitle>
          <p className="text-sm sm:text-base text-muted-foreground">{t('login.subtitle')}</p>
        </CardHeader>
        
        <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6">
          {!selectedUserType ? (
            <div className="space-y-4 sm:space-y-6">
              <div className="text-center">
                <span className="inline-block bg-gradient-to-r from-blue-500 to-green-500 text-white px-4 py-2 rounded-full text-sm sm:text-base font-semibold shadow-md animate-pulse">
                  ✨ Quick Demo Login ✨
                </span>
                <p className="text-sm text-muted-foreground/80 font-medium mt-3">
                  Choose your role to explore Simhastha CleanMap
                </p>
              </div>
              
              <div className="space-y-3">
                <Button 
                  onClick={() => quickLogin("volunteer")}
                  className="w-full text-white border-0 hover:opacity-90 transition-all duration-200 transform hover:scale-105"
                  variant="outline"
                  style={{ 
                    minHeight: '60px', 
                    display: 'flex', 
                    flexDirection: 'row', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    gap: '12px', 
                    padding: '16px',
                    backgroundColor: '#10b981' // Green color
                  }}
                >
                  <Users size={20} style={{ flexShrink: 0 }} />
                  <span className="font-semibold text-sm">🙋‍♂️ Volunteer/श्रद्धालु</span>
                </Button>
                
                <Button 
                  onClick={() => quickLogin("staff")}
                  className="w-full text-white border-0 hover:opacity-90 transition-all duration-200 transform hover:scale-105"
                  variant="outline"
                  style={{ 
                    minHeight: '60px', 
                    display: 'flex', 
                    flexDirection: 'row', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    gap: '12px', 
                    padding: '16px',
                    backgroundColor: '#3b82f6' // Blue color
                  }}
                >
                  <UserCheck size={20} style={{ flexShrink: 0 }} />
                  <span className="font-semibold text-sm">👷‍♂️ Sanitation Staff</span>
                </Button>

                <Button 
                  onClick={() => quickLogin("admin")}
                  className="w-full text-white border-0 hover:opacity-90 transition-all duration-200 transform hover:scale-105"
                  variant="outline"
                  style={{ 
                    minHeight: '60px', 
                    display: 'flex', 
                    flexDirection: 'row', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    gap: '12px', 
                    padding: '16px',
                    backgroundColor: '#f97316' // Orange color
                  }}
                >
                  <Shield size={20} style={{ flexShrink: 0 }} />
                  <span className="font-semibold text-sm">👨‍💼 Admin</span>
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedUserType(null)}
                >
                  ← Back
                </Button>
                <Badge variant="outline" className="ml-auto">
                  {selectedUserType === "volunteer" ? "Volunteer/श्रद्धालु Login" : 
                   selectedUserType === "staff" ? "Sanitation Staff Login" : "Admin Login"}
                </Badge>
              </div>

              <div className="space-y-3">
                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    placeholder="Enter username"
                    value={credentials.username}
                    onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter password"
                    value={credentials.password}
                    onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                  />
                </div>

                <Button
                  onClick={handleLogin}
                  disabled={!credentials.username || !credentials.password || isLoading}
                  className="w-full bg-gradient-primary"
                >
                  {isLoading ? (
                    <>Loading...</>
                  ) : (
                    <>
                      <LogIn className="mr-2 h-4 w-4" />
                      Login
                    </>
                  )}
                </Button>
              </div>

              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-sm font-medium mb-2">Demo Accounts:</p>
                <div className="space-y-1 text-xs">
                  {demoUsers[selectedUserType].map((user, index) => (
                    <div key={index} className="flex justify-between">
                      <span>{user.username}</span>
                      <span className="text-muted-foreground">demo123</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Location Badge */}
      <div className="fixed bottom-4 right-4 bg-white/10 backdrop-blur-sm rounded-full px-3 py-2 text-white text-xs flex items-center gap-1">
        <MapPin className="h-3 w-3" />
        Ujjain Smart City
      </div>
    </div>
  );
}