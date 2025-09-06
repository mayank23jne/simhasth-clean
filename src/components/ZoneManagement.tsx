import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useZone } from "@/contexts/ZoneContext";
import { useStaff } from "@/contexts/StaffContext";
import { useToilet } from "@/contexts/ToiletContext";
import { useVolunteerReports } from "@/contexts/VolunteerReportsContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { 
  MapPin, 
  Plus, 
  Edit, 
  Trash2,
  Users,
  Building,
  AlertTriangle,
  Search,
  Filter,
  Target,
  Layers
} from "lucide-react";

export function ZoneManagement() {
  const { zones, addZone, updateZone, deleteZone } = useZone();
  const { getStaffByZone } = useStaff();
  const { getToiletsByZone } = useToilet();
  const { getReportsByZone } = useVolunteerReports();
  const { t } = useLanguage();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingZone, setEditingZone] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPriority, setFilterPriority] = useState("all");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    centerLat: "",
    centerLng: "",
    radius: "",
    color: "#3b82f6",
    priority: "medium" as "high" | "medium" | "low"
  });

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      centerLat: "",
      centerLng: "",
      radius: "",
      color: "#3b82f6",
      priority: "medium"
    });
  };

  const handleAddZone = () => {
    if (!formData.name || !formData.centerLat || !formData.centerLng || !formData.radius) {
      toast.error("Please fill in all required fields");
      return;
    }

    const lat = parseFloat(formData.centerLat);
    const lng = parseFloat(formData.centerLng);
    const radius = parseFloat(formData.radius);

    if (isNaN(lat) || isNaN(lng) || isNaN(radius)) {
      toast.error("Please enter valid coordinates and radius");
      return;
    }

    addZone({
      name: formData.name,
      description: formData.description,
      coordinates: {
        center: { lat, lng },
        radius
      },
      color: formData.color,
      priority: formData.priority
    });

    toast.success(`Zone "${formData.name}" added successfully!`);
    resetForm();
    setIsAddDialogOpen(false);
  };

  const handleEditZone = () => {
    if (!editingZone || !formData.name || !formData.centerLat || !formData.centerLng || !formData.radius) {
      toast.error("Please fill in all required fields");
      return;
    }

    const lat = parseFloat(formData.centerLat);
    const lng = parseFloat(formData.centerLng);
    const radius = parseFloat(formData.radius);

    if (isNaN(lat) || isNaN(lng) || isNaN(radius)) {
      toast.error("Please enter valid coordinates and radius");
      return;
    }

    updateZone(editingZone.id, {
      name: formData.name,
      description: formData.description,
      coordinates: {
        center: { lat, lng },
        radius
      },
      color: formData.color,
      priority: formData.priority
    });

    toast.success(`Zone "${formData.name}" updated successfully!`);
    resetForm();
    setIsEditDialogOpen(false);
    setEditingZone(null);
  };

  const handleDeleteZone = (zone: any) => {
    const staffCount = getStaffByZone(zone.id).length;
    const toiletCount = getToiletsByZone(zone.id).length;
    const reportCount = getReportsByZone(zone.id).length;

    if (staffCount > 0 || toiletCount > 0 || reportCount > 0) {
      toast.error(`Cannot delete zone "${zone.name}". It has ${staffCount} staff, ${toiletCount} facilities, and ${reportCount} reports assigned.`);
      return;
    }

    if (window.confirm(`Are you sure you want to delete zone "${zone.name}"?`)) {
      deleteZone(zone.id);
      toast.success(`Zone "${zone.name}" deleted successfully!`);
    }
  };

  const openEditDialog = (zone: any) => {
    setEditingZone(zone);
    setFormData({
      name: zone.name,
      description: zone.description,
      centerLat: zone.coordinates.center.lat.toString(),
      centerLng: zone.coordinates.center.lng.toString(),
      radius: zone.coordinates.radius.toString(),
      color: zone.color,
      priority: zone.priority
    });
    setIsEditDialogOpen(true);
  };

  // Filter zones based on search and priority
  const filteredZones = zones.filter(zone => {
    const matchesSearch = searchTerm === "" ||
      zone.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      zone.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPriority = filterPriority === "all" || zone.priority === filterPriority;

    return matchesSearch && matchesPriority;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-destructive text-destructive-foreground";
      case "medium": return "bg-warning text-warning-foreground";
      case "low": return "bg-success text-success-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getZoneStats = (zoneId: string) => {
    const staffCount = getStaffByZone(zoneId).length;
    const toiletCount = getToiletsByZone(zoneId).length;
    const reportCount = getReportsByZone(zoneId).filter(r => r.status === 'pending').length;
    
    return { staffCount, toiletCount, reportCount };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-subtle rounded-lg p-3 sm:p-4 lg:p-6 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <Layers className="h-6 w-6 sm:h-8 sm:w-8 flex-shrink-0" />
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">Zone Management</h1>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                <span className="sm:inline">Add Zone</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md mx-4 sm:mx-0">
              <DialogHeader>
                <DialogTitle>Add New Zone</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Zone Name *</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Central Market Area"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Brief description of the zone"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="centerLat">Latitude *</Label>
                    <Input
                      id="centerLat"
                      type="number"
                      step="any"
                      placeholder="22.7196"
                      value={formData.centerLat}
                      onChange={(e) => setFormData({ ...formData, centerLat: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="centerLng">Longitude *</Label>
                    <Input
                      id="centerLng"
                      type="number"
                      step="any"
                      placeholder="75.8577"
                      value={formData.centerLng}
                      onChange={(e) => setFormData({ ...formData, centerLng: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="radius">Radius (meters) *</Label>
                  <Input
                    id="radius"
                    type="number"
                    placeholder="1000"
                    value={formData.radius}
                    onChange={(e) => setFormData({ ...formData, radius: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="priority">Priority</Label>
                    <Select 
                      value={formData.priority} 
                      onValueChange={(value: "high" | "medium" | "low") => 
                        setFormData({ ...formData, priority: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High Priority</SelectItem>
                        <SelectItem value="medium">Medium Priority</SelectItem>
                        <SelectItem value="low">Low Priority</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="color">Zone Color</Label>
                    <Input
                      id="color"
                      type="color"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button onClick={handleAddZone} className="flex-1">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Zone
                  </Button>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <p className="text-muted-foreground text-xs sm:text-sm lg:text-base">
          Manage geographical zones for staff assignment and facility organization
          <span className="block sm:inline sm:ml-1">• Total Zones: {zones.length}</span>
        </p>
      </div>

      {/* Filters */}
      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Filter className="h-4 w-4 sm:h-5 sm:w-5" />
            Filter Zones
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search zones..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 text-sm"
              />
            </div>
            
            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger className="text-sm">
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="high">High Priority</SelectItem>
                <SelectItem value="medium">Medium Priority</SelectItem>
                <SelectItem value="low">Low Priority</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Zones List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
        {filteredZones.length === 0 ? (
          <div className="col-span-full text-center py-8 text-muted-foreground">
            <Layers className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No zones found matching your criteria</p>
          </div>
        ) : (
          filteredZones.map((zone) => {
            const stats = getZoneStats(zone.id);
            return (
              <Card key={zone.id} className="shadow-card hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2 sm:pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-sm sm:text-base lg:text-lg flex items-center gap-2">
                        <div 
                          className="w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 border-white shadow-sm flex-shrink-0"
                          style={{ backgroundColor: zone.color }}
                        />
                        <span className="truncate">{zone.name}</span>
                      </CardTitle>
                      <p className="text-xs sm:text-sm text-muted-foreground mt-1 line-clamp-2">
                        {zone.description}
                      </p>
                    </div>
                    <Badge className={`${getPriorityColor(zone.priority)} text-xs flex-shrink-0`}>
                      {zone.priority}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3 pt-0">
                  {/* Zone Coordinates */}
                  <div className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                    <span className="truncate">
                      {zone.coordinates.center.lat.toFixed(3)}, {zone.coordinates.center.lng.toFixed(3)}
                    </span>
                    <Target className="h-3 w-3 sm:h-4 sm:w-4 ml-1 flex-shrink-0" />
                    <span className="whitespace-nowrap">{zone.coordinates.radius}m</span>
                  </div>

                  {/* Zone Statistics */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-center p-1.5 sm:p-2 bg-muted/50 rounded">
                      <Users className="h-3 w-3 sm:h-4 sm:w-4 mx-auto mb-1 text-primary" />
                      <div className="text-xs sm:text-sm font-medium">{stats.staffCount}</div>
                      <div className="text-[10px] sm:text-xs text-muted-foreground">Staff</div>
                    </div>
                    <div className="text-center p-1.5 sm:p-2 bg-muted/50 rounded">
                      <Building className="h-3 w-3 sm:h-4 sm:w-4 mx-auto mb-1 text-primary" />
                      <div className="text-xs sm:text-sm font-medium">{stats.toiletCount}</div>
                      <div className="text-[10px] sm:text-xs text-muted-foreground">Facilities</div>
                    </div>
                    <div className="text-center p-1.5 sm:p-2 bg-muted/50 rounded">
                      <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 mx-auto mb-1 text-destructive" />
                      <div className="text-xs sm:text-sm font-medium">{stats.reportCount}</div>
                      <div className="text-[10px] sm:text-xs text-muted-foreground">Pending</div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(zone)}
                      className="flex-1 text-xs sm:text-sm h-8 sm:h-9"
                    >
                      <Edit className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      <span className="hidden sm:inline">Edit</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteZone(zone)}
                      className="text-destructive hover:text-destructive h-8 sm:h-9 px-2 sm:px-3"
                    >
                      <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Edit Zone Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md mx-4 sm:mx-0">
          <DialogHeader>
            <DialogTitle>Edit Zone</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Zone Name *</Label>
              <Input
                id="edit-name"
                placeholder="e.g., Central Market Area"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            
            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                placeholder="Brief description of the zone"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="edit-centerLat">Latitude *</Label>
                <Input
                  id="edit-centerLat"
                  type="number"
                  step="any"
                  placeholder="22.7196"
                  value={formData.centerLat}
                  onChange={(e) => setFormData({ ...formData, centerLat: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-centerLng">Longitude *</Label>
                <Input
                  id="edit-centerLng"
                  type="number"
                  step="any"
                  placeholder="75.8577"
                  value={formData.centerLng}
                  onChange={(e) => setFormData({ ...formData, centerLng: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="edit-radius">Radius (meters) *</Label>
              <Input
                id="edit-radius"
                type="number"
                placeholder="1000"
                value={formData.radius}
                onChange={(e) => setFormData({ ...formData, radius: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="edit-priority">Priority</Label>
                <Select 
                  value={formData.priority} 
                  onValueChange={(value: "high" | "medium" | "low") => 
                    setFormData({ ...formData, priority: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High Priority</SelectItem>
                    <SelectItem value="medium">Medium Priority</SelectItem>
                    <SelectItem value="low">Low Priority</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-color">Zone Color</Label>
                <Input
                  id="edit-color"
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button onClick={handleEditZone} className="flex-1">
                <Edit className="h-4 w-4 mr-2" />
                Update Zone
              </Button>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
