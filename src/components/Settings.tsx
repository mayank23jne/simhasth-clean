import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Settings2, 
  Bell, 
  Users, 
  Shield,
  Database,
  Smartphone,
  Download,
  Upload
} from "lucide-react";

export function Settings() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-subtle rounded-lg p-6 shadow-card">
        <h1 className="text-3xl font-bold mb-2">System Settings</h1>
        <p className="text-muted-foreground">
          Configure system preferences and administrative options
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notification Settings */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notification Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>SMS Alerts</Label>
                <p className="text-sm text-muted-foreground">Send SMS for critical issues</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Push Notifications</Label>
                <p className="text-sm text-muted-foreground">Mobile app notifications</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Reports</Label>
                <p className="text-sm text-muted-foreground">Daily summary emails</p>
              </div>
              <Switch />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Overdue Alerts</Label>
                <p className="text-sm text-muted-foreground">Alert when cleaning is overdue</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* User Management */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              User Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="adminEmail">Admin Email</Label>
              <Input 
                id="adminEmail"
                type="email"
                placeholder="admin@cleanspot.gov"
                defaultValue="admin@cleanspot.gov"
              />
            </div>
            
            <div>
              <Label htmlFor="maxVolunteers">Max Volunteers</Label>
              <Input 
                id="maxVolunteers"
                type="number"
                placeholder="100"
                defaultValue="100"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Allow Public Reports</Label>
                <p className="text-sm text-muted-foreground">Enable anonymous reporting</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <Button variant="outline" className="w-full">
              <Users className="mr-2 h-4 w-4" />
              Manage User Roles
            </Button>
          </CardContent>
        </Card>

        {/* System Configuration */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings2 className="h-5 w-5" />
              System Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="cleaningInterval">Default Cleaning Interval (hours)</Label>
              <Input 
                id="cleaningInterval"
                type="number"
                placeholder="8"
                defaultValue="8"
              />
            </div>
            
            <div>
              <Label htmlFor="cityName">City Name</Label>
              <Input 
                id="cityName"
                placeholder="Ujjain"
                defaultValue="Ujjain"
              />
            </div>
            
            <div>
              <Label htmlFor="emergencyContact">Emergency Contact</Label>
              <Input 
                id="emergencyContact"
                placeholder="+91-XXXXX-XXXXX"
                defaultValue="+91-XXXXX-XXXXX"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>GPS Tracking</Label>
                <p className="text-sm text-muted-foreground">Track staff locations</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Data Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export Data
              </Button>
              <Button variant="outline">
                <Upload className="mr-2 h-4 w-4" />
                Import Data
              </Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto Backup</Label>
                <p className="text-sm text-muted-foreground">Daily data backup</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div>
              <Label htmlFor="retentionPeriod">Data Retention (days)</Label>
              <Input 
                id="retentionPeriod"
                type="number"
                placeholder="365"
                defaultValue="365"
              />
            </div>
            
            <Button variant="destructive" className="w-full">
              <Database className="mr-2 h-4 w-4" />
              Clear Old Records
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Integration Settings */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            Integration Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Google Maps API</h4>
              <p className="text-sm text-muted-foreground mb-3">For location services</p>
              <Button variant="outline" size="sm">Configure</Button>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Firebase FCM</h4>
              <p className="text-sm text-muted-foreground mb-3">Push notifications</p>
              <Button variant="outline" size="sm">Configure</Button>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Smart City Portal</h4>
              <p className="text-sm text-muted-foreground mb-3">Integration with city systems</p>
              <Button variant="outline" size="sm">Configure</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Settings */}
      <div className="flex justify-end gap-3">
        <Button variant="outline">Cancel</Button>
        <Button className="bg-gradient-primary">
          <Shield className="mr-2 h-4 w-4" />
          Save Settings
        </Button>
      </div>
    </div>
  );
}