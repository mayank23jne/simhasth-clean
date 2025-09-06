import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToilet } from "@/contexts/ToiletContext";
import { useStaff } from "@/contexts/StaffContext";
import { useZone } from "@/contexts/ZoneContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import {
  Building2,
  MapPin,
  Users,
  Clock,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Calendar,
  QrCode,
  Wrench,
  User,
  Baby,
  Accessibility,
  Plus,
  Edit
} from "lucide-react";

export function ToiletManagement() {
  const { toilets, getToiletsByStatus, updateToiletStatus, addToilet, updateToilet } = useToilet();
  const { staff, getStaffById } = useStaff();
  const { zones, getZoneById } = useZone();
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterLocation, setFilterLocation] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingFacility, setEditingFacility] = useState<any>(null);

  // Form state for adding new facility
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    address: "",
    zoneId: "",
    status: "operational" as "operational" | "maintenance" | "out-of-order",
    staffAssigned: [] as string[]
  });

  // Filter toilets based on search and filters
  const filteredToilets = toilets.filter(toilet => {
    const matchesSearch = searchTerm === "" ||
      toilet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      toilet.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      toilet.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === "all" || toilet.status === filterStatus;
    const matchesLocation = filterLocation === "all" || toilet.location === filterLocation;

    return matchesSearch && matchesStatus && matchesLocation;
  });

  // Get unique locations for filter
  const locations = Array.from(new Set(toilets.map(toilet => toilet.location)));

  const getStatusColor = (status: string) => {
    switch (status) {
      case "operational": return "bg-success text-success-foreground";
      case "maintenance": return "bg-warning text-warning-foreground";
      case "out-of-order": return "bg-destructive text-destructive-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "operational": return CheckCircle2;
      case "maintenance": return AlertTriangle;
      case "out-of-order": return XCircle;
      default: return CheckCircle2;
    }
  };

  const formatLastCleaned = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      return `${diffInMinutes} mins ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getFacilityIcon = (facility: string) => {
    switch (facility.toLowerCase()) {
      case 'disabled access': return Accessibility;
      case 'baby changing': return Baby;
      case 'medical waste': return Wrench;
      default: return User;
    }
  };

  const handleStatusChange = (toiletId: string, newStatus: 'operational' | 'maintenance' | 'out-of-order') => {
    updateToiletStatus(toiletId, newStatus);
    toast.success(t('facilityMgmt.statusUpdated').replace('{status}', newStatus));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      location: "",
      address: "",
      zoneId: "",
      status: "operational",
      staffAssigned: []
    });
  };

  const handleAddFacility = () => {
    if (!formData.name || !formData.location || !formData.address || !formData.zoneId) {
      toast.error("Please fill in all required fields including zone selection");
      return;
    }

    const newFacility = {
      name: formData.name,
      location: formData.location,
      address: formData.address,
      zoneId: formData.zoneId,
      staffAssigned: formData.staffAssigned,
      status: formData.status,
      lastCleaned: new Date().toISOString(),
      cleaningFrequency: 'daily' as const, // Default value
      facilities: ['Male', 'Female'], // Default facilities
      capacity: 20, // Default capacity
      qrCode: `SCM${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`, // Auto-generate QR code
      coordinates: { lat: 22.7196, lng: 75.8577 } // Default Ujjain coordinates
    };

    addToilet(newFacility);
    toast.success(t('facilityMgmt.facilityAdded').replace('{name}', formData.name));
    resetForm();
    setIsAddDialogOpen(false);
  };

  const handleEditFacility = () => {
    if (!editingFacility || !formData.name || !formData.location || !formData.address || !formData.zoneId) {
      toast.error("Please fill in all required fields including zone selection");
      return;
    }

    const updatedFacility = {
      name: formData.name,
      location: formData.location,
      address: formData.address,
      zoneId: formData.zoneId,
      staffAssigned: formData.staffAssigned,
      status: formData.status
    };

    updateToilet(editingFacility.id, updatedFacility);
    toast.success(t('facilityMgmt.facilityUpdated').replace('{name}', formData.name));
    resetForm();
    setIsEditDialogOpen(false);
    setEditingFacility(null);
  };

  const openEditDialog = (facility: any) => {
    setEditingFacility(facility);
    setFormData({
      name: facility.name,
      location: facility.location,
      address: facility.address,
      zoneId: facility.zoneId || "",
      status: facility.status,
      staffAssigned: facility.staffAssigned
    });
    setIsEditDialogOpen(true);
  };

  const handleStaffToggle = (staffId: string) => {
    setFormData(prev => ({
      ...prev,
      staffAssigned: prev.staffAssigned.includes(staffId)
        ? prev.staffAssigned.filter(s => s !== staffId)
        : [...prev.staffAssigned, staffId]
    }));
  };

  return (
    <div className="space-y-4 sm:space-y-6 p-3 sm:p-0">
      {/* Header */}
      <div className="bg-gradient-subtle rounded-lg p-3 sm:p-4 lg:p-6 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold truncate">{t('facilityMgmt.title')}</h1>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-primary w-full sm:w-auto flex-shrink-0">
                  <Plus className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">{t('facilityMgmt.addFacility')}</span>
                  <span className="sm:hidden">Add Facility</span>
                </Button>
              </DialogTrigger>
            </Dialog>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs sm:text-sm text-muted-foreground">{t('facilityMgmt.liveStatus')}</span>
            </div>
          </div>
        </div>
        <div className="text-muted-foreground text-xs sm:text-sm lg:text-base">
          <div className="hidden sm:block">
            {t('facilityMgmt.subtitle')} • {t('facilityMgmt.totalFacilities')}: {toilets.length}
          </div>
          <div className="sm:hidden space-y-1">
            <div>{t('facilityMgmt.subtitle')}</div>
            <div>{t('facilityMgmt.totalFacilities')}: {toilets.length}</div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="shadow-card">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 rounded-full bg-success/10 flex-shrink-0">
                <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-success" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-lg sm:text-2xl font-bold">{getToiletsByStatus('operational').length}</div>
                <p className="text-xs sm:text-sm text-muted-foreground truncate">{t('facilityMgmt.operational')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 rounded-full bg-warning/10 flex-shrink-0">
                <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-warning" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-lg sm:text-2xl font-bold">{getToiletsByStatus('maintenance').length}</div>
                <p className="text-xs sm:text-sm text-muted-foreground truncate">{t('staffMgmt.maintenance')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 rounded-full bg-destructive/10 flex-shrink-0">
                <XCircle className="h-4 w-4 sm:h-5 sm:w-5 text-destructive" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-lg sm:text-2xl font-bold">{getToiletsByStatus('out-of-order').length}</div>
                <p className="text-xs sm:text-sm text-muted-foreground truncate">{t('facilityMgmt.outOfOrder')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 rounded-full bg-primary/10 flex-shrink-0">
                <Building2 className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-lg sm:text-2xl font-bold">{toilets.length}</div>
                <p className="text-xs sm:text-sm text-muted-foreground truncate">{t('facilityMgmt.totalFacilities')}</p>
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
            <span className="truncate">{t('facilityMgmt.filterFacilities')}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-0 sm:grid sm:grid-cols-1 md:grid-cols-3 sm:gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('facilityMgmt.searchByNameLocationID')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 text-sm"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="text-sm">
              <SelectValue placeholder={t('staffMgmt.filterByStatus')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('staffMgmt.allStatus')}</SelectItem>
              <SelectItem value="operational">{t('facilityMgmt.operational')}</SelectItem>
              <SelectItem value="maintenance">{t('staffMgmt.maintenance')}</SelectItem>
              <SelectItem value="out-of-order">{t('facilityMgmt.outOfOrder')}</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterLocation} onValueChange={setFilterLocation}>
            <SelectTrigger className="text-sm">
              <SelectValue placeholder={t('facilityMgmt.filterByLocation')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('facilityMgmt.allLocations')}</SelectItem>
              {locations.map(location => (
                <SelectItem key={location} value={location}>{location}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Toilets Table */}
      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Building2 className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="truncate">{t('facilityMgmt.facilityRegistry')} ({filteredToilets.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Desktop Table View */}
          <div className="hidden lg:block">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">{t('common.id')}</TableHead>
                    <TableHead>{t('facilityMgmt.nameLocation')}</TableHead>
                    <TableHead>{t('facilityMgmt.staffAssigned')}</TableHead>
                    <TableHead>{t('common.status')}</TableHead>
                    <TableHead>{t('facilityMgmt.lastCleaned')}</TableHead>
                    <TableHead>{t('facilityMgmt.details')}</TableHead>
                    <TableHead className="text-right">{t('facilityMgmt.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
              <TableBody>
                {filteredToilets.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12">
                      <div className="flex flex-col items-center gap-2">
                        <Building2 className="h-12 w-12 text-muted-foreground/50" />
                        <p className="text-muted-foreground font-medium">{t('facilityMgmt.noFacilitiesFound')}</p>
                        <p className="text-sm text-muted-foreground">
                          {searchTerm || filterStatus !== "all" || filterLocation !== "all"
                            ? t('facilityMgmt.tryAdjustingSearch')
                            : t('facilityMgmt.noFacilitiesAvailable')}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredToilets.map((toilet) => {
                    const StatusIcon = getStatusIcon(toilet.status);
                    
                    return (
                      <TableRow key={toilet.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <QrCode className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{toilet.id}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-[250px]">
                            <div className="font-medium text-sm truncate">{toilet.name}</div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                              <MapPin className="h-3 w-3 flex-shrink-0" />
                              <span className="truncate">{toilet.location}</span>
                            </div>
                            <div className="text-xs text-muted-foreground truncate">
                              {toilet.address}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1 max-w-[150px]">
                            {toilet.staffAssigned.map((staffId) => {
                              const staffMember = getStaffById(staffId);
                              return (
                                <Badge key={staffId} variant="outline" className="text-xs">
                                  {staffMember?.name || staffId}
                                </Badge>
                              );
                            })}
                            {toilet.staffAssigned.length === 0 && (
                              <span className="text-xs text-muted-foreground">{t('facilityMgmt.noStaffAssigned')}</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={`${getStatusColor(toilet.status)} text-xs`}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {toilet.status.replace('-', ' ').toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3 text-muted-foreground" />
                              <span>{formatLastCleaned(toilet.lastCleaned)}</span>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {toilet.cleaningFrequency} cleaning
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 px-2 text-xs"
                              >
                                <Eye className="h-3 w-3 mr-1" />
                                {t('facilityMgmt.view')}
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                  <Building2 className="h-5 w-5" />
                                  {toilet.name}
                                </DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <span className="font-medium text-muted-foreground">{t('facilityMgmt.facilityId')}:</span>
                                    <p>{toilet.id}</p>
                                  </div>
                                  <div>
                                    <span className="font-medium text-muted-foreground">{t('facilityMgmt.qrCode')}:</span>
                                    <p>{toilet.qrCode}</p>
                                  </div>
                                  <div>
                                    <span className="font-medium text-muted-foreground">{t('common.location')}:</span>
                                    <p>{toilet.location}</p>
                                  </div>
                                  <div>
                                    <span className="font-medium text-muted-foreground">{t('facilityMgmt.capacity')}:</span>
                                    <p>{toilet.capacity} {t('facilityMgmt.people')}</p>
                                  </div>
                                  <div>
                                    <span className="font-medium text-muted-foreground">{t('common.status')}:</span>
                                    <Badge className={getStatusColor(toilet.status)}>
                                      {toilet.status.replace('-', ' ').toUpperCase()}
                                    </Badge>
                                  </div>
                                  <div>
                                    <span className="font-medium text-muted-foreground">{t('facilityMgmt.cleaningFrequency')}:</span>
                                    <p className="capitalize">{toilet.cleaningFrequency}</p>
                                  </div>
                                </div>
                                <div>
                                  <span className="font-medium text-muted-foreground">{t('facilityMgmt.address')}:</span>
                                  <p className="text-sm">{toilet.address}</p>
                                </div>
                                <div>
                                  <span className="font-medium text-muted-foreground">{t('facilityMgmt.availableFacilities')}:</span>
                                  <div className="flex flex-wrap gap-2 mt-2">
                                    {toilet.facilities.map((facility, index) => {
                                      const FacilityIcon = getFacilityIcon(facility);
                                      return (
                                        <Badge key={index} variant="outline">
                                          <FacilityIcon className="h-3 w-3 mr-1" />
                                          {facility}
                                        </Badge>
                                      );
                                    })}
                                  </div>
                                </div>
                                <div>
                                  <span className="font-medium text-muted-foreground">{t('facilityMgmt.assignedStaff')}:</span>
                                  <div className="flex flex-wrap gap-2 mt-2">
                                    {toilet.staffAssigned.map((staffId) => {
                                      const staffMember = getStaffById(staffId);
                                      return (
                                        <Badge key={staffId} variant="outline">
                                          <User className="h-3 w-3 mr-1" />
                                          {staffMember?.name || staffId}
                                        </Badge>
                                      );
                                    })}
                                  </div>
                                </div>
                                {toilet.coordinates && (
                                  <div>
                                    <span className="font-medium text-muted-foreground">{t('facilityMgmt.gpsCoordinates')}:</span>
                                    <p className="text-sm">
                                      Lat: {toilet.coordinates.lat.toFixed(6)}, Lng: {toilet.coordinates.lng.toFixed(6)}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 px-2 text-xs"
                              onClick={() => openEditDialog(toilet)}
                            >
                              <Edit className="h-3 w-3 mr-1" />
                              {t('common.edit')}
                            </Button>
                            <Select
                              value={toilet.status}
                              onValueChange={(value: 'operational' | 'maintenance' | 'out-of-order') => 
                                handleStatusChange(toilet.id, value)
                              }
                            >
                              <SelectTrigger className="w-32 h-8 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="operational">{t('facilityMgmt.operational')}</SelectItem>
                                <SelectItem value="maintenance">{t('staffMgmt.maintenance')}</SelectItem>
                                <SelectItem value="out-of-order">{t('facilityMgmt.outOfOrder')}</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden">
            {filteredToilets.length === 0 ? (
              <div className="text-center py-8 px-4">
                <Building2 className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-3 sm:mb-4 text-muted-foreground/50" />
                <h3 className="font-medium mb-2 text-sm sm:text-base">{t('facilityMgmt.noFacilitiesFound')}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground mb-4 max-w-md mx-auto">
                  {searchTerm || filterStatus !== "all" || filterLocation !== "all"
                    ? t('facilityMgmt.tryAdjustingSearch')
                    : t('facilityMgmt.noFacilitiesAvailable')}
                </p>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {filteredToilets.map((toilet) => {
                  const StatusIcon = getStatusIcon(toilet.status);
                  return (
                    <Card key={toilet.id} className="border bg-card/50">
                      <CardContent className="p-3 sm:p-4 space-y-3">
                        {/* Header */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            <QrCode className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <div className="min-w-0 flex-1">
                              <h3 className="font-semibold text-sm sm:text-base truncate">{toilet.name}</h3>
                              <p className="text-xs sm:text-sm text-muted-foreground truncate">{toilet.id}</p>
                            </div>
                          </div>
                          <Badge className={getStatusColor(toilet.status)} variant="outline">
                            <StatusIcon className="h-3 w-3 mr-1" />
                            <span className="text-xs">{toilet.status}</span>
                          </Badge>
                        </div>

                        {/* Location */}
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                          <span className="text-xs sm:text-sm truncate">{toilet.location}</span>
                        </div>

                        {/* Staff */}
                        <div className="flex items-start gap-2">
                          <Users className="h-3 w-3 text-muted-foreground flex-shrink-0 mt-0.5" />
                          <div className="min-w-0 flex-1">
                            {toilet.staffAssigned.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {toilet.staffAssigned.slice(0, 2).map((staffId) => {
                                  const staffMember = getStaffById(staffId);
                                  return (
                                    <Badge key={staffId} variant="outline" className="text-xs truncate max-w-[100px]">
                                      {staffMember?.name || staffId}
                                    </Badge>
                                  );
                                })}
                                {toilet.staffAssigned.length > 2 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{toilet.staffAssigned.length - 2}
                                  </Badge>
                                )}
                              </div>
                            ) : (
                              <span className="text-xs sm:text-sm text-muted-foreground">{t('facilityMgmt.noStaffAssigned')}</span>
                            )}
                          </div>
                        </div>

                        {/* Last Cleaned */}
                        <div className="flex items-center gap-2">
                          <Clock className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                          <span className="text-xs sm:text-sm text-muted-foreground">
                            {new Date(toilet.lastCleaned).toLocaleDateString()}
                          </span>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 pt-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="outline" className="flex-1 text-xs">
                                <Eye className="h-3 w-3 mr-1" />
                                {t('facilityMgmt.view')}
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto mx-4">
                              <DialogHeader>
                                <DialogTitle className="text-base sm:text-lg">{toilet.name}</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <span className="font-medium text-muted-foreground">{t('common.id')}:</span>
                                  <p className="text-sm">{toilet.id}</p>
                                </div>
                                <div>
                                  <span className="font-medium text-muted-foreground">{t('common.location')}:</span>
                                  <p className="text-sm">{toilet.location}</p>
                                </div>
                                <div>
                                  <span className="font-medium text-muted-foreground">{t('facilityMgmt.address')}:</span>
                                  <p className="text-sm">{toilet.address}</p>
                                </div>
                                <div>
                                  <span className="font-medium text-muted-foreground">{t('facilityMgmt.capacity')}:</span>
                                  <p className="text-sm">{toilet.capacity} {t('facilityMgmt.people')}</p>
                                </div>
                                <div>
                                  <span className="font-medium text-muted-foreground">{t('facilityMgmt.availableFacilities')}:</span>
                                  <div className="flex flex-wrap gap-2 mt-2">
                                    {toilet.facilities.map((facility, index) => {
                                      const FacilityIcon = getFacilityIcon(facility);
                                      return (
                                        <Badge key={index} variant="outline">
                                          <FacilityIcon className="h-3 w-3 mr-1" />
                                          {facility}
                                        </Badge>
                                      );
                                    })}
                                  </div>
                                </div>
                                <div>
                                  <span className="font-medium text-muted-foreground">{t('facilityMgmt.assignedStaff')}:</span>
                                  <div className="flex flex-wrap gap-2 mt-2">
                                    {toilet.staffAssigned.map((staffId) => {
                                      const staffMember = getStaffById(staffId);
                                      return (
                                        <Badge key={staffId} variant="outline">
                                          <User className="h-3 w-3 mr-1" />
                                          {staffMember?.name || staffId}
                                        </Badge>
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs px-2 sm:px-3"
                            onClick={() => openEditDialog(toilet)}
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            <span className="hidden sm:inline">Edit</span>
                          </Button>
                          <Select
                            value={toilet.status}
                            onValueChange={(value: 'operational' | 'maintenance' | 'out-of-order') => 
                              handleStatusChange(toilet.id, value)
                            }
                          >
                            <SelectTrigger className="w-20 sm:w-24 h-8 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="operational">{t('facilityMgmt.operational')}</SelectItem>
                              <SelectItem value="maintenance">{t('staffMgmt.maintenance')}</SelectItem>
                              <SelectItem value="out-of-order">{t('facilityMgmt.outOfOrder')}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Add Facility Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto mx-4">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg">{t('facilityMgmt.addNewFacility')}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t('facilityMgmt.facilityName')} *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder={t('facilityMgmt.enterFacilityName')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">{t('common.location')} *</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder={t('facilityMgmt.enterLocation')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">{t('facilityMgmt.address')} *</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder={t('facilityMgmt.enterAddress')}
                  className="min-h-[80px]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zone">Zone *</Label>
                <Select 
                  value={formData.zoneId} 
                  onValueChange={(value) => setFormData({ ...formData, zoneId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a zone" />
                  </SelectTrigger>
                  <SelectContent>
                    {zones.map((zone) => (
                      <SelectItem key={zone.id} value={zone.id}>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full border"
                            style={{ backgroundColor: zone.color }}
                          />
                          {zone.name}
                          <span className="text-xs text-muted-foreground">({zone.priority})</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">{t('common.status')}</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value: "operational" | "maintenance" | "out-of-order") => 
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="operational">{t('facilityMgmt.operational')}</SelectItem>
                    <SelectItem value="maintenance">{t('staffMgmt.maintenance')}</SelectItem>
                    <SelectItem value="out-of-order">{t('facilityMgmt.outOfOrder')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Staff Assignment */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>{t('facilityMgmt.assignedStaff')}</Label>
                <div className="grid grid-cols-1 gap-2 p-3 border rounded-md max-h-[300px] overflow-y-auto">
                  {staff.map((staffMember) => (
                    <div key={staffMember.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={staffMember.id}
                        checked={formData.staffAssigned.includes(staffMember.id)}
                        onCheckedChange={() => handleStaffToggle(staffMember.id)}
                      />
                      <Label htmlFor={staffMember.id} className="text-sm">
                        {staffMember.name} ({staffMember.role})
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 pt-4">
            <Button onClick={handleAddFacility} className="flex-1 order-2 sm:order-1">
              {t('facilityMgmt.addFacility')}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsAddDialogOpen(false);
                resetForm();
              }}
              className="order-1 sm:order-2"
            >
              {t('common.cancel')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Facility Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto mx-4">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg">{t('facilityMgmt.editFacility')}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">{t('facilityMgmt.facilityName')} *</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder={t('facilityMgmt.enterFacilityName')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-location">{t('common.location')} *</Label>
                <Input
                  id="edit-location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder={t('facilityMgmt.enterLocation')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-address">{t('facilityMgmt.address')} *</Label>
                <Textarea
                  id="edit-address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder={t('facilityMgmt.enterAddress')}
                  className="min-h-[80px]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-zone">Zone *</Label>
                <Select 
                  value={formData.zoneId} 
                  onValueChange={(value) => setFormData({ ...formData, zoneId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a zone" />
                  </SelectTrigger>
                  <SelectContent>
                    {zones.map((zone) => (
                      <SelectItem key={zone.id} value={zone.id}>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full border"
                            style={{ backgroundColor: zone.color }}
                          />
                          {zone.name}
                          <span className="text-xs text-muted-foreground">({zone.priority})</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-status">{t('common.status')}</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value: "operational" | "maintenance" | "out-of-order") => 
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="operational">{t('facilityMgmt.operational')}</SelectItem>
                    <SelectItem value="maintenance">{t('staffMgmt.maintenance')}</SelectItem>
                    <SelectItem value="out-of-order">{t('facilityMgmt.outOfOrder')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Staff Assignment */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>{t('facilityMgmt.assignedStaff')}</Label>
                <div className="grid grid-cols-1 gap-2 p-3 border rounded-md max-h-[300px] overflow-y-auto">
                  {staff.map((staffMember) => (
                    <div key={staffMember.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`edit-${staffMember.id}`}
                        checked={formData.staffAssigned.includes(staffMember.id)}
                        onCheckedChange={() => handleStaffToggle(staffMember.id)}
                      />
                      <Label htmlFor={`edit-${staffMember.id}`} className="text-sm">
                        {staffMember.name} ({staffMember.role})
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 pt-4">
            <Button onClick={handleEditFacility} className="flex-1 order-2 sm:order-1">
              {t('facilityMgmt.editFacility')}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsEditDialogOpen(false);
                setEditingFacility(null);
                resetForm();
              }}
              className="order-1 sm:order-2"
            >
              {t('common.cancel')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
