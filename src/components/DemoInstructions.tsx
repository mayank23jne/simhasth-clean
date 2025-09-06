import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Shield, 
  ArrowRight, 
  CheckCircle2,
  Eye,
  Clock
} from "lucide-react";

export function DemoInstructions() {
  return (
    <Card className="border-2 border-dashed border-primary/20 bg-primary/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          <Eye className="h-5 w-5" />
          Live Demo: Staff to Admin Flow
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Test the real-time audit system by following these steps:
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Staff Steps */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge className="bg-gradient-primary">
                <Users className="h-3 w-3 mr-1" />
                Staff Steps
              </Badge>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">1</div>
                <span>Logout and login as <strong>Staff</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">2</div>
                <span>Go to <strong>QR Audit</strong> tab</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">3</div>
                <span>Click <strong>"Scan QR Code"</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">4</div>
                <span>Fill the audit form and <strong>submit</strong></span>
              </div>
            </div>
          </div>

          {/* Admin Steps */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge className="bg-gradient-warning">
                <Shield className="h-3 w-3 mr-1" />
                Admin Steps
              </Badge>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs font-bold">1</div>
                <span>Login as <strong>Admin</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs font-bold">2</div>
                <span>Go to <strong>Staff Audits</strong> tab</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs font-bold">3</div>
                <span>See the <strong>new audit report</strong> appear!</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-success" />
                <span className="text-success font-medium">Real-time visibility achieved!</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 pt-4 border-t">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">
            Reports appear instantly when staff submit audits
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
