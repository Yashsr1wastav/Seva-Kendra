import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  RefreshCw,
  Menu,
  Calendar,
  MapPin,
  CheckCircle,
  Clock,
  AlertCircle,
  User,
  BookOpen,
  Target,
} from "lucide-react";
import { workshopAndAwarenessAPI } from "../services/api";
import Sidebar from "../components/Sidebar";
import usePermissions from "../hooks/usePermissions";

const Workshops = () => {
  const { canCreate, canEdit, canDelete, canExport } = usePermissions();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    groupType: "all",
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const [selectedWorkshop, setSelectedWorkshop] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    groupId: "",
    groupName: "",
    groupType: "",
    wardNo: "",
    habitation: "",
    projectResponsible: "",
    topic: "",
    dateOfTraining: "",
    resourcePerson: "",
    profileOfResourcePerson: "",
    agenda: "",
    totalParticipants: "",
    outcome: "",
  });

  const groupTypes = [
    "CBUCBO",
    "SHG",
    "Youth Group",
    "Women Group",
    "Community Group",
    "Farmer Group",
    "Student Group",
    "Other",
  ];

  const statusOptions = ["Planned", "Completed", "Cancelled", "Postponed"];

  // Fetch workshops
  const fetchWorkshops = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        search: searchTerm,
        ...filters,
      };

      const response = await workshopAndAwarenessAPI.getAll(params);
      setWorkshops(response.data.workshops || []);

      // Handle pagination data - if not provided by API, create default pagination
      if (response.data.pagination) {
        setPagination(response.data.pagination);
      } else {
        // Create default pagination based on workshops data
        const workshopsData = response.data.workshops || [];
        setPagination({
          page: 1,
          limit: 10,
          total: workshopsData.length,
          pages: Math.ceil(workshopsData.length / 10),
        });
      }
    } catch (error) {
      toast.error("Failed to fetch workshops");
      console.error("Error fetching workshops:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial data load
  useEffect(() => {
    fetchWorkshops();
  }, []);

  // Refetch when search or filters change
  useEffect(() => {
    fetchWorkshops();
  }, [searchTerm, filters]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedWorkshop) {
        await workshopAndAwarenessAPI.update(selectedWorkshop._id, formData);
        toast.success("Workshop updated successfully");
        setIsEditModalOpen(false);
      } else {
        await workshopAndAwarenessAPI.create(formData);
        toast.success("Workshop created successfully");
        setIsCreateModalOpen(false);
      }
      fetchWorkshops();
      resetForm();
    } catch (error) {
      toast.error(
        selectedWorkshop
          ? "Failed to update workshop"
          : "Failed to create workshop"
      );
      console.error("Error submitting form:", error);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      groupId: "",
      groupName: "",
      groupType: "",
      wardNo: "",
      habitation: "",
      projectResponsible: "",
      topic: "",
      dateOfTraining: "",
      resourcePerson: "",
      profileOfResourcePerson: "",
      agenda: "",
      totalParticipants: "",
      outcome: "",
    });
    setSelectedWorkshop(null);
  };

  // Handle delete
  const handleDelete = async (id) => {
    try {
      await workshopAndAwarenessAPI.delete(id);
      toast.success("Workshop deleted successfully");
      fetchWorkshops();
    } catch (error) {
      toast.error("Failed to delete workshop");
      console.error("Error deleting workshop:", error);
    }
  };

  return (
    <div className="flex h-screen bg-secondary">
      {/* Sidebar */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeItem="workshops"
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        {/* Mobile Header */}
        <div className="lg:hidden bg-card shadow-md p-4 flex items-center border-b border-border">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(true)}
            className="mr-2"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold">Workshops & Awareness</h1>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto bg-background">
          <div className="container mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  Workshops & Awareness
                </h1>
                <p className="text-muted-foreground">
                  Manage workshops and awareness programs for community
                  development
                </p>
              </div>
              {canCreate("socialJustice") && (
                <Button onClick={() => setIsCreateModalOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Workshop
                </Button>
              )}
            </div>

            {/* Search and Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Search & Filters
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search workshops..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  {/* <Select
                    value={filters.status}
                    onValueChange={(value) =>
                      setFilters({ ...filters, status: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      {statusOptions.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value={filters.category}
                    onValueChange={(value) =>
                      setFilters({ ...filters, category: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {workshopCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select> */}
                </div>
              </CardContent>
            </Card>

            {/* Workshops Table */}
            <Card>
              <CardHeader>
                <CardTitle>Workshops ({pagination.total})</CardTitle>
                <CardDescription>
                  Track and manage community workshops and awareness programs
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center items-center h-64">
                    <RefreshCw className="h-8 w-8 animate-spin" />
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Group Name</TableHead>
                        <TableHead>Group Type</TableHead>
                        <TableHead>Topic</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Resource Person</TableHead>
                        <TableHead>Participants</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {workshops.map((workshop) => (
                        <TableRow key={workshop._id}>
                          <TableCell>
                            <div className="font-medium">
                              {workshop.groupName}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {workshop.groupType}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{workshop.topic}</div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center text-sm">
                              <Calendar className="mr-1 h-3 w-3" />
                              {workshop.dateOfTraining
                                ? new Date(
                                    workshop.dateOfTraining
                                  ).toLocaleDateString()
                                : "TBD"}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center text-sm">
                              <User className="mr-1 h-3 w-3" />
                              {workshop.resourcePerson || "TBA"}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center text-sm">
                              <Users className="mr-1 h-3 w-3" />
                              {workshop.totalParticipants || 0}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedWorkshop(workshop);
                                  setIsViewModalOpen(true);
                                }}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              {canEdit("socialJustice") && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedWorkshop(workshop);
                                    setFormData({
                                      groupId: workshop.groupId || "",
                                      groupName: workshop.groupName || "",
                                      groupType: workshop.groupType || "",
                                      wardNo: workshop.wardNo || "",
                                      habitation: workshop.habitation || "",
                                      projectResponsible:
                                        workshop.projectResponsible || "",
                                      topic: workshop.topic || "",
                                      dateOfTraining: workshop.dateOfTraining
                                        ? workshop.dateOfTraining.split("T")[0]
                                        : "",
                                      resourcePerson:
                                        workshop.resourcePerson || "",
                                      profileOfResourcePerson:
                                        workshop.profileOfResourcePerson || "",
                                      agenda: workshop.agenda || "",
                                      totalParticipants:
                                        workshop.totalParticipants || "",
                                      outcome: workshop.outcome || "",
                                    });
                                    setIsEditModalOpen(true);
                                  }}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              )}
                              {canDelete("socialJustice") && (
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="text-red-600 hover:text-red-700"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>
                                        Are you sure?
                                      </AlertDialogTitle>
                                      <AlertDialogDescription>
                                        This action cannot be undone. This will
                                        permanently delete the workshop.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>
                                        Cancel
                                      </AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleDelete(workshop._id)}
                                        className="bg-red-600 hover:bg-red-700"
                                      >
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div className="flex items-center justify-between space-x-2 py-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setPagination((prev) => ({
                          ...prev,
                          page: Math.max(prev.page - 1, 1),
                        }))
                      }
                      disabled={pagination.page === 1}
                    >
                      Previous
                    </Button>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-muted-foreground">
                        Page {pagination.page} of {pagination.pages}
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setPagination((prev) => ({
                          ...prev,
                          page: Math.min(prev.page + 1, prev.pages),
                        }))
                      }
                      disabled={pagination.page === pagination.pages}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Create Modal */}
            <Dialog
              open={isCreateModalOpen}
              onOpenChange={setIsCreateModalOpen}
            >
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Workshop</DialogTitle>
                  <DialogDescription>
                    Fill in the details to schedule a new workshop or awareness
                    program
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="groupId">Group ID *</Label>
                      <Input
                        id="groupId"
                        value={formData.groupId}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            groupId: e.target.value,
                          })
                        }
                        placeholder="Enter group ID"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="groupName">Group Name *</Label>
                      <Input
                        id="groupName"
                        value={formData.groupName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            groupName: e.target.value,
                          })
                        }
                        placeholder="Enter group name"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="groupType">Group Type *</Label>
                      <Select
                        value={formData.groupType}
                        onValueChange={(value) =>
                          setFormData({ ...formData, groupType: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select group type" />
                        </SelectTrigger>
                        <SelectContent>
                          {groupTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="wardNo">Ward No *</Label>
                      <Select
                        value={formData.wardNo}
                        onValueChange={(value) =>
                          setFormData({
                            ...formData,
                            wardNo: value,
                          })
                        }
                      >
                        <SelectTrigger id="wardNo">
                          <SelectValue placeholder="Select ward" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Ward 1">Ward 1</SelectItem>
                          <SelectItem value="Ward 2">Ward 2</SelectItem>
                          <SelectItem value="Ward 3">Ward 3</SelectItem>
                          <SelectItem value="Ward 4">Ward 4</SelectItem>
                          <SelectItem value="Ward 5">Ward 5</SelectItem>
                          <SelectItem value="Ward 6">Ward 6</SelectItem>
                          <SelectItem value="Ward 7">Ward 7</SelectItem>
                          <SelectItem value="Ward 8">Ward 8</SelectItem>
                          <SelectItem value="Ward 9">Ward 9</SelectItem>
                          <SelectItem value="Ward 10">Ward 10</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="habitation">Habitation *</Label>
                      <Input
                        id="habitation"
                        value={formData.habitation}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            habitation: e.target.value,
                          })
                        }
                        placeholder="Enter habitation"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="projectResponsible">
                        Project Responsible *
                      </Label>
                      <Input
                        id="projectResponsible"
                        value={formData.projectResponsible}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            projectResponsible: e.target.value,
                          })
                        }
                        placeholder="Enter project responsible"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="topic">Topic *</Label>
                      <Input
                        id="topic"
                        value={formData.topic}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            topic: e.target.value,
                          })
                        }
                        placeholder="Enter training topic"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="dateOfTraining">Date of Training *</Label>
                      <Input
                        id="dateOfTraining"
                        type="date"
                        value={formData.dateOfTraining}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            dateOfTraining: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="resourcePerson">Resource Person *</Label>
                      <Input
                        id="resourcePerson"
                        value={formData.resourcePerson}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            resourcePerson: e.target.value,
                          })
                        }
                        placeholder="Enter resource person name"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="profileOfResourcePerson">
                        Profile of Resource Person *
                      </Label>
                      <Input
                        id="profileOfResourcePerson"
                        value={formData.profileOfResourcePerson}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            profileOfResourcePerson: e.target.value,
                          })
                        }
                        placeholder="Enter resource person profile"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="totalParticipants">
                        Total Participants *
                      </Label>
                      <Input
                        id="totalParticipants"
                        type="number"
                        value={formData.totalParticipants}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            totalParticipants: e.target.value,
                          })
                        }
                        placeholder="Enter total participants"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="agenda">Agenda *</Label>
                    <Textarea
                      id="agenda"
                      value={formData.agenda}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          agenda: e.target.value,
                        })
                      }
                      placeholder="Enter training agenda"
                      rows={3}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="outcome">Outcome *</Label>
                    <Textarea
                      id="outcome"
                      value={formData.outcome}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          outcome: e.target.value,
                        })
                      }
                      placeholder="Enter training outcome"
                      rows={3}
                      required
                    />
                  </div>

                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsCreateModalOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">Create Workshop</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            {/* Edit Modal */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Edit Workshop</DialogTitle>
                  <DialogDescription>
                    Update the workshop information
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="edit-groupId">Group ID *</Label>
                      <Input
                        id="edit-groupId"
                        value={formData.groupId}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            groupId: e.target.value,
                          })
                        }
                        placeholder="Enter group ID"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-groupName">Group Name *</Label>
                      <Input
                        id="edit-groupName"
                        value={formData.groupName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            groupName: e.target.value,
                          })
                        }
                        placeholder="Enter group name"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-groupType">Group Type *</Label>
                      <Select
                        value={formData.groupType}
                        onValueChange={(value) =>
                          setFormData({ ...formData, groupType: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select group type" />
                        </SelectTrigger>
                        <SelectContent>
                          {groupTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="edit-topic">Topic *</Label>
                      <Input
                        id="edit-topic"
                        value={formData.topic}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            topic: e.target.value,
                          })
                        }
                        placeholder="Enter training topic"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-dateOfTraining">
                        Date of Training *
                      </Label>
                      <Input
                        id="edit-dateOfTraining"
                        type="date"
                        value={formData.dateOfTraining}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            dateOfTraining: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-totalParticipants">
                        Total Participants *
                      </Label>
                      <Input
                        id="edit-totalParticipants"
                        type="number"
                        value={formData.totalParticipants}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            totalParticipants: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>

                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsEditModalOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">Update Workshop</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            {/* View Modal */}
            <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Workshop Details</DialogTitle>
                  <DialogDescription>
                    View detailed information about this workshop
                  </DialogDescription>
                </DialogHeader>
                {selectedWorkshop && (
                  <div className="space-y-6">
                    {/* Basic Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold border-b pb-2">
                        Basic Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="font-semibold">Group ID</Label>
                          <p>{selectedWorkshop.groupId}</p>
                        </div>
                        <div>
                          <Label className="font-semibold">Group Name</Label>
                          <p>{selectedWorkshop.groupName}</p>
                        </div>
                        <div>
                          <Label className="font-semibold">Group Type</Label>
                          <Badge>{selectedWorkshop.groupType}</Badge>
                        </div>
                        <div>
                          <Label className="font-semibold">Ward No</Label>
                          <p>{selectedWorkshop.wardNo}</p>
                        </div>
                        <div>
                          <Label className="font-semibold">Habitation</Label>
                          <p>{selectedWorkshop.habitation}</p>
                        </div>
                        <div>
                          <Label className="font-semibold">
                            Project Responsible
                          </Label>
                          <p>{selectedWorkshop.projectResponsible}</p>
                        </div>
                      </div>
                    </div>

                    {/* Workshop Details */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold border-b pb-2">
                        Workshop Details
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="font-semibold">Topic</Label>
                          <p>{selectedWorkshop.topic}</p>
                        </div>
                        <div>
                          <Label className="font-semibold">
                            Date of Training
                          </Label>
                          <p>
                            {selectedWorkshop.dateOfTraining
                              ? new Date(
                                  selectedWorkshop.dateOfTraining
                                ).toLocaleDateString()
                              : "N/A"}
                          </p>
                        </div>
                        <div>
                          <Label className="font-semibold">
                            Resource Person
                          </Label>
                          <p>{selectedWorkshop.resourcePerson}</p>
                        </div>
                        <div>
                          <Label className="font-semibold">
                            Total Participants
                          </Label>
                          <p>{selectedWorkshop.totalParticipants}</p>
                        </div>
                      </div>
                      {selectedWorkshop.profileOfResourcePerson && (
                        <div>
                          <Label className="font-semibold">
                            Profile of Resource Person
                          </Label>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {selectedWorkshop.profileOfResourcePerson}
                          </p>
                        </div>
                      )}
                      {selectedWorkshop.agenda && (
                        <div>
                          <Label className="font-semibold">Agenda</Label>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {selectedWorkshop.agenda}
                          </p>
                        </div>
                      )}
                      {selectedWorkshop.outcome && (
                        <div>
                          <Label className="font-semibold">Outcome</Label>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {selectedWorkshop.outcome}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                <DialogFooter>
                  <Button onClick={() => setIsViewModalOpen(false)}>
                    Close
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Workshops;
