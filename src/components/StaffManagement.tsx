import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useStaff, Staff } from "@/contexts/StaffContext";
import { useZone } from "@/contexts/ZoneContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import {
  Users,
  Plus,
  Edit,
  Trash2,
  Phone,
  Mail,
  MapPin,
  Clock,
  UserCheck,
  UserX,
  Calendar,
  Search,
  Filter
} from "lucide-react";

// Extract StaffFormDialog outside to prevent re-creation on each render
const StaffFormDialog = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  title, 
  formData, 
  setFormData,
  zones
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  title: string;
  formData: {
    name: string;
    email: string;
    phone: string;
    role: "cleaner" | "supervisor" | "maintenance";
    shift: "morning" | "afternoon" | "night";
    status: "active" | "inactive" | "on-leave";
    assignedAreas: string;
    assignedZones: string[];
    emergencyContact: string;
    profileImage: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<{
    name: string;
    email: string;
    phone: string;
    role: "cleaner" | "supervisor" | "maintenance";
    shift: "morning" | "afternoon" | "night";
    status: "active" | "inactive" | "on-leave";
    assignedAreas: string;
    assignedZones: string[];
    emergencyContact: string;
    profileImage: string;
  }>>;
  zones: Array<{
    id: string;
    name: string;
    color: string;
    priority: string;
  }>;
}) => (
  <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto mx-4">
      <DialogHeader>
        <DialogTitle className="text-base sm:text-lg">{title}</DialogTitle>
      </DialogHeader>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter full name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="Enter email address"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="Enter phone number"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="emergency">Emergency Contact</Label>
          <Input
            id="emergency"
            value={formData.emergencyContact}
            onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
            placeholder="Emergency contact number"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <Select value={formData.role} onValueChange={(value: "cleaner" | "supervisor" | "maintenance") => setFormData({ ...formData, role: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cleaner">Cleaner</SelectItem>
              <SelectItem value="supervisor">Supervisor</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="shift">Shift</Label>
          <Select value={formData.shift} onValueChange={(value: "morning" | "afternoon" | "night") => setFormData({ ...formData, shift: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="morning">Morning (6 AM - 2 PM)</SelectItem>
              <SelectItem value="afternoon">Afternoon (2 PM - 10 PM)</SelectItem>
              <SelectItem value="night">Night (10 PM - 6 AM)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select value={formData.status} onValueChange={(value: "active" | "inactive" | "on-leave") => setFormData({ ...formData, status: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="on-leave">On Leave</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="profileImage">Profile Image URL</Label>
          <Input
            id="profileImage"
            value={formData.profileImage}
            onChange={(e) => setFormData({ ...formData, profileImage: e.target.value })}
            placeholder="Enter image URL (optional)"
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="areas">Assigned Areas</Label>
          <Textarea
            id="areas"
            value={formData.assignedAreas}
            onChange={(e) => setFormData({ ...formData, assignedAreas: e.target.value })}
            placeholder="Enter assigned areas separated by commas"
            className="min-h-[80px]"
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label>Assigned Zones</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 border rounded-md max-h-[200px] overflow-y-auto">
            {zones.map((zone) => (
              <div key={zone.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={zone.id}
                  checked={formData.assignedZones.includes(zone.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFormData({ 
                        ...formData, 
                        assignedZones: [...formData.assignedZones, zone.id] 
                      });
                    } else {
                      setFormData({ 
                        ...formData, 
                        assignedZones: formData.assignedZones.filter(id => id !== zone.id) 
                      });
                    }
                  }}
                  className="rounded"
                />
                <label htmlFor={zone.id} className="text-sm flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full border"
                    style={{ backgroundColor: zone.color }}
                  />
                  {zone.name}
                  <span className="text-xs text-muted-foreground">({zone.priority})</span>
                </label>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            Select zones where this staff member will be responsible for cleaning and maintenance.
          </p>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-2 pt-4">
        <Button onClick={onSubmit} className="flex-1 order-2 sm:order-1">
          {title.includes("Add") ? "Add Staff Member" : "Update Staff Member"}
        </Button>
        <Button variant="outline" onClick={onClose} className="order-1 sm:order-2">
          Cancel
        </Button>
      </div>
    </DialogContent>
  </Dialog>
);

export function StaffManagement() {
  const { staff, addStaff, updateStaff, deleteStaff, getActiveStaff, getStaffByRole } = useStaff();
  const { zones } = useZone();
  const { t } = useLanguage();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "cleaner" as "cleaner" | "supervisor" | "maintenance",
    shift: "morning" as "morning" | "afternoon" | "night",
    status: "active" as "active" | "inactive" | "on-leave",
    assignedAreas: "",
    assignedZones: [] as string[],
    emergencyContact: "",
    profileImage: ""
  });

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      role: "cleaner",
      shift: "morning",
      status: "active",
      assignedAreas: "",
      assignedZones: [],
      emergencyContact: "",
      profileImage: ""
    });
  };

  const handleAddStaff = () => {
    if (!formData.name || !formData.email || !formData.phone) {
      toast.error(t('staffMgmt.fillRequiredFields'));
      return;
    }

    addStaff({
      ...formData,
      assignedAreas: formData.assignedAreas.split(',').map(area => area.trim()).filter(area => area),
      assignedZones: formData.assignedZones
    });

    toast.success(t('staffMgmt.staffAdded').replace('{name}', formData.name));
    resetForm();
    setIsAddDialogOpen(false);
  };

  const handleEditStaff = () => {
    if (!editingStaff || !formData.name || !formData.email || !formData.phone) {
      toast.error(t('staffMgmt.fillRequiredFields'));
      return;
    }

    updateStaff(editingStaff.id, {
      ...formData,
      assignedAreas: formData.assignedAreas.split(',').map(area => area.trim()).filter(area => area),
      assignedZones: formData.assignedZones
    });

    toast.success(t('staffMgmt.staffUpdated').replace('{name}', formData.name));
    resetForm();
    setIsEditDialogOpen(false);
    setEditingStaff(null);
  };

  const handleDeleteStaff = (staffMember: Staff) => {
    if (window.confirm(t('staffMgmt.confirmDelete').replace('{name}', staffMember.name))) {
      deleteStaff(staffMember.id);
      toast.success(t('staffMgmt.staffDeleted').replace('{name}', staffMember.name));
    }
  };

  const openEditDialog = (staffMember: Staff) => {
    setEditingStaff(staffMember);
    setFormData({
      name: staffMember.name,
      email: staffMember.email,
      phone: staffMember.phone,
      role: staffMember.role,
      shift: staffMember.shift,
      status: staffMember.status,
      assignedAreas: staffMember.assignedAreas.join(', '),
      assignedZones: staffMember.assignedZones || [],
      emergencyContact: staffMember.emergencyContact,
      profileImage: staffMember.profileImage || ""
    });
    setIsEditDialogOpen(true);
  };

  // Filter staff based on search and filters
  const filteredStaff = staff.filter(member => {
    const matchesSearch = searchTerm === "" ||
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.phone.includes(searchTerm);

    const matchesRole = filterRole === "all" || member.role === filterRole;
    const matchesStatus = filterStatus === "all" || member.status === filterStatus;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-success text-success-foreground";
      case "inactive": return "bg-muted text-muted-foreground";
      case "on-leave": return "bg-warning text-warning-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "supervisor": return "bg-primary text-primary-foreground";
      case "maintenance": return "bg-secondary text-secondary-foreground";
      case "cleaner": return "bg-accent text-accent-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };



  return (
    <div className="space-y-4 sm:space-y-6 p-3 sm:p-0">
      {/* Header */}
      <div className="bg-gradient-subtle rounded-lg p-3 sm:p-4 lg:p-6 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold truncate">{t('staffMgmt.title')}</h1>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary flex-shrink-0 w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">{t('staffMgmt.addStaffMember')}</span>
                <span className="sm:hidden">Add Staff</span>
              </Button>
            </DialogTrigger>
          </Dialog>
        </div>
        <div className="text-muted-foreground text-xs sm:text-sm lg:text-base">
          <div className="hidden sm:block">
            {t('staffMgmt.subtitle')} • {t('staffMgmt.totalStaff')}: {staff.length} • {t('staffMgmt.active')}: {getActiveStaff().length}
          </div>
          <div className="sm:hidden space-y-1">
            <div>{t('staffMgmt.subtitle')}</div>
            <div>{t('staffMgmt.totalStaff')}: {staff.length} • {t('staffMgmt.active')}: {getActiveStaff().length}</div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="shadow-card">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 rounded-full bg-success/10 flex-shrink-0">
                <UserCheck className="h-4 w-4 sm:h-5 sm:w-5 text-success" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-lg sm:text-2xl font-bold">{getActiveStaff().length}</div>
                <p className="text-xs sm:text-sm text-muted-foreground truncate">{t('staffMgmt.activeStaff')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 rounded-full bg-primary/10 flex-shrink-0">
                <Users className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-lg sm:text-2xl font-bold">{getStaffByRole('cleaner').length}</div>
                <p className="text-xs sm:text-sm text-muted-foreground truncate">{t('staffMgmt.cleaners')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 rounded-full bg-secondary/10 flex-shrink-0">
                <UserCheck className="h-4 w-4 sm:h-5 sm:w-5 text-secondary" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-lg sm:text-2xl font-bold">{getStaffByRole('supervisor').length}</div>
                <p className="text-xs sm:text-sm text-muted-foreground truncate">{t('staffMgmt.supervisors')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 rounded-full bg-accent/10 flex-shrink-0">
                <UserX className="h-4 w-4 sm:h-5 sm:w-5 text-accent" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-lg sm:text-2xl font-bold">{getStaffByRole('maintenance').length}</div>
                <p className="text-xs sm:text-sm text-muted-foreground truncate">{t('staffMgmt.maintenance')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Filter className="h-4 w-4 sm:h-5 sm:w-5" />
            {t('staffMgmt.filterStaff')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-0 sm:grid sm:grid-cols-1 md:grid-cols-3 sm:gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('staffMgmt.searchByNameEmail')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 text-sm"
            />
          </div>
          <Select value={filterRole} onValueChange={setFilterRole}>
            <SelectTrigger className="text-sm">
              <SelectValue placeholder={t('staffMgmt.filterByRole')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('staffMgmt.allRoles')}</SelectItem>
              <SelectItem value="cleaner">{t('staffMgmt.cleaner')}</SelectItem>
              <SelectItem value="supervisor">{t('staffMgmt.supervisor')}</SelectItem>
              <SelectItem value="maintenance">{t('staffMgmt.maintenance')}</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="text-sm">
              <SelectValue placeholder={t('staffMgmt.filterByStatus')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('staffMgmt.allStatus')}</SelectItem>
              <SelectItem value="active">{t('staffMgmt.active')}</SelectItem>
              <SelectItem value="inactive">{t('status.inactive')}</SelectItem>
              <SelectItem value="on-leave">{t('staffMgmt.onLeave')}</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Staff List */}
      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Users className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="truncate">{t('staffMgmt.staffMembers')} ({filteredStaff.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {filteredStaff.map((member) => (
              <Card key={member.id} className="border bg-card/50">
                <CardContent className="p-3 sm:p-4 space-y-3">
                  {/* Profile Header */}
                  <div className="flex items-start gap-2 sm:gap-3">
                    <img
                      src={member.profileImage || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face`}
                      alt={member.name}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm sm:text-base truncate">{member.name}</h3>
                      <div className="flex flex-wrap gap-1 mt-1">
                        <Badge className={`${getRoleColor(member.role)} text-xs`} variant="secondary">
                          {member.role}
                        </Badge>
                        <Badge className={`${getStatusColor(member.status)} text-xs`} variant="outline">
                          {member.status}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                      <span className="truncate">{member.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                      <span className="truncate">{member.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                      <span className="capitalize truncate">{member.shift} shift</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                      <span className="truncate">Joined {new Date(member.joinDate).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Assigned Areas */}
                  {member.assignedAreas.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 text-xs sm:text-sm font-medium mb-1">
                        <MapPin className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                        <span className="truncate">Assigned Areas:</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {member.assignedAreas.slice(0, 2).map((area, index) => (
                          <Badge key={index} variant="outline" className="text-xs truncate max-w-[120px]">
                            {area}
                          </Badge>
                        ))}
                        {member.assignedAreas.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{member.assignedAreas.length - 2} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 text-xs sm:text-sm"
                      onClick={() => openEditDialog(member)}
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      <span className="hidden sm:inline">Edit</span>
                      <span className="sm:hidden">Edit</span>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-destructive hover:text-destructive px-2 sm:px-3"
                      onClick={() => handleDeleteStaff(member)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredStaff.length === 0 && (
            <div className="text-center py-6 sm:py-8 px-4">
              <Users className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-3 sm:mb-4 text-muted-foreground/50" />
              <h3 className="font-medium mb-2 text-sm sm:text-base">{t('staffMgmt.noStaffFound')}</h3>
              <p className="text-xs sm:text-sm text-muted-foreground mb-4 max-w-md mx-auto">
                {searchTerm || filterRole !== "all" || filterStatus !== "all"
                  ? t('staffMgmt.adjustFilters')
                  : t('staffMgmt.addFirstStaff')}
              </p>
              {!searchTerm && filterRole === "all" && filterStatus === "all" && (
                <Button onClick={() => setIsAddDialogOpen(true)} className="w-full sm:w-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Add Staff Member</span>
                  <span className="sm:hidden">Add Staff</span>
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Staff Dialog */}
      <StaffFormDialog
        isOpen={isAddDialogOpen}
        onClose={() => {
          setIsAddDialogOpen(false);
          resetForm();
        }}
        onSubmit={handleAddStaff}
        title="Add New Staff Member"
        formData={formData}
        setFormData={setFormData}
        zones={zones}
      />

      {/* Edit Staff Dialog */}
      <StaffFormDialog
        isOpen={isEditDialogOpen}
        onClose={() => {
          setIsEditDialogOpen(false);
          setEditingStaff(null);
          resetForm();
        }}
        onSubmit={handleEditStaff}
        title="Edit Staff Member"
        formData={formData}
        setFormData={setFormData}
        zones={zones}
      />
    </div>
  );
}
