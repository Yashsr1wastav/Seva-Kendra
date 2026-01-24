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
  DialogTrigger,
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
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Checkbox } from "@/components/ui/checkbox";
import { TimeRangePicker } from "@/components/ui/time-range-picker";
import {
  Building2,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Download,
  RefreshCw,
  Menu,
} from "lucide-react";
import { studyCenterAPI, teacherAPI, groupLeaderAPI } from "../services/api";
import Sidebar from "../components/Sidebar";
import usePermissions from "../hooks/usePermissions";

const StudyCenters = () => {
  const { canCreate, canEdit, canDelete, canExport } = usePermissions();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [studyCenters, setStudyCenters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    wardNo: "",
    projectResponsible: "",
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const [filterOptions, setFilterOptions] = useState({
    wardNumbers: [],
    projectResponsibles: [],
    fundingSources: [],
  });
  const [teachers, setTeachers] = useState([]);
  const [groupLeaders, setGroupLeaders] = useState([]);
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    centreCode: "",
    centreName: "",
    sourceOfFunding: "",
    infrastructure: "",
    timing: "",
    studentsLevelOfEducation: [],
    wardNo: "",
    habitation: "",
    projectResponsible: "",
    dateOfEstablishment: "",
    totalStudents: "",
    groupLeader: "",
    teachers: [],
    functionalAspects: {
      infrastructureQuality: "",
      teacherAttendance: "",
      studentEngagement: "",
      learningOutcome: "",
      communityParticipation: "",
    },
    progressReporting: {},
  });

  // Fetch study centers
  const fetchStudyCenters = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        search: searchTerm,
        ...filters,
      };

      const response = await studyCenterAPI.getAll(params);
      setStudyCenters(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      toast.error("Failed to fetch study centers");
      console.error("Error fetching study centers:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch filter options
  const fetchFilterOptions = async () => {
    try {
      const response = await studyCenterAPI.getFilterOptions();
      setFilterOptions(response.data);
    } catch (error) {
      console.error("Error fetching filter options:", error);
    }
  };

  // Fetch teachers dropdown
  const fetchTeachers = async () => {
    try {
      const response = await teacherAPI.getDropdown();
      setTeachers(response.data);
    } catch (error) {
      console.error("Error fetching teachers:", error);
      toast.error("Failed to fetch teachers");
    }
  };

  // Fetch group leaders dropdown
  const fetchGroupLeaders = async () => {
    try {
      const response = await groupLeaderAPI.getDropdown();
      setGroupLeaders(response.data);
    } catch (error) {
      console.error("Error fetching group leaders:", error);
      toast.error("Failed to fetch group leaders");
    }
  };

  useEffect(() => {
    fetchStudyCenters();
  }, [pagination.page, pagination.limit, searchTerm, filters]);

  useEffect(() => {
    fetchFilterOptions();
    fetchTeachers();
    fetchGroupLeaders();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedCenter) {
        await studyCenterAPI.update(selectedCenter._id, formData);
        toast.success("Study center updated successfully");
        setIsEditModalOpen(false);
      } else {
        await studyCenterAPI.create(formData);
        toast.success("Study center created successfully");
        setIsCreateModalOpen(false);
      }

      fetchStudyCenters();
      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    try {
      await studyCenterAPI.delete(id);
      toast.success("Study center deleted successfully");
      fetchStudyCenters();
    } catch (error) {
      toast.error("Failed to delete study center");
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      centreCode: "",
      centreName: "",
      sourceOfFunding: "",
      infrastructure: "",
      timing: "",
      studentsLevelOfEducation: [],
      wardNo: "",
      habitation: "",
      projectResponsible: "",
      dateOfEstablishment: "",
      totalStudents: "",
      groupLeader: "",
      teachers: [],
      functionalAspects: {
        infrastructureQuality: "",
        teacherAttendance: "",
        studentEngagement: "",
        learningOutcome: "",
        communityParticipation: "",
      },
      progressReporting: {},
    });
    setSelectedCenter(null);
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
  };

  // Open edit modal
  const openEditModal = (center) => {
    setSelectedCenter(center);
    setFormData({
      ...center,
      dateOfEstablishment: center.dateOfEstablishment
        ? new Date(center.dateOfEstablishment).toISOString().split("T")[0]
        : "",
      functionalAspects: center.functionalAspects || {
        infrastructureQuality: "",
        teacherAttendance: "",
        studentEngagement: "",
        learningOutcome: "",
        communityParticipation: "",
      },
      teachers: center.teachers || [],
    });
    setIsEditModalOpen(true);
  };

  // Open view modal
  const openViewModal = (center) => {
    setSelectedCenter(center);
    setIsViewModalOpen(true);
  };

  // Add teacher field
  const addTeacherField = () => {
    setFormData({
      ...formData,
      teachers: [...formData.teachers, ""],
    });
  };

  // Remove teacher field
  const removeTeacherField = (index) => {
    if (formData.teachers.length > 0) {
      const newTeachers = formData.teachers.filter((_, i) => i !== index);
      setFormData({
        ...formData,
        teachers: newTeachers,
      });
    }
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeItem="study-centers"
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
          <h1 className="text-lg font-semibold">Study Centers</h1>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="container mx-auto p-6 space-y-5">
            {/* Header */}
            <div className="flex flex-wrap gap-3 justify-between items-center">
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">
                  Study Centers
                  <span className="ml-2 text-base md:text-lg font-semibold text-muted-foreground align-middle">
                    ({pagination.total})
                  </span>
                </h1>
                <p className="text-sm md:text-base text-muted-foreground mt-0.5">
                  Manage education study centers
                </p>
              </div>
              {canCreate("education") && (
                <Button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="gap-2 shadow-sm focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label="Add Study Center"
                >
                  <Plus className="h-4 w-4" aria-hidden="true" />
                  Add Study Center
                </Button>
              )}
            </div>

            {/* Search and Filters */}
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <Filter className="h-4 w-4" aria-hidden="true" />
                  Search & Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-2 pb-3">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div className="relative">
                    <Search
                      className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
                      aria-hidden="true"
                    />
                    <Input
                      placeholder="Search by center name, ward, or group leader"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-10"
                      aria-label="Search study centers"
                    />
                    {searchTerm && (
                      <button
                        type="button"
                        onClick={() => setSearchTerm("")}
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full h-6 w-6 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        aria-label="Clear search"
                      >
                        <span aria-hidden="true">✕</span>
                      </button>
                    )}
                  </div>
                  <Select
                    value={filters.wardNo || "all"}
                    onValueChange={(value) =>
                      setFilters({
                        ...filters,
                        wardNo: value === "all" ? "" : value,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Ward" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Wards</SelectItem>
                      {filterOptions.wardNumbers.map((ward) => (
                        <SelectItem key={ward} value={ward}>
                          Ward {ward}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value={filters.projectResponsible || "all"}
                    onValueChange={(value) =>
                      setFilters({
                        ...filters,
                        projectResponsible: value === "all" ? "" : value,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Project Responsible" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      {filterOptions.projectResponsibles.map((person) => (
                        <SelectItem key={person} value={person}>
                          {person}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchTerm("");
                      setFilters({ wardNo: "", projectResponsible: "" });
                    }}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                </div>
                {/* Filter chips (UI only) */}
                <div className="mt-2 flex flex-wrap gap-2">
                  <Badge
                    variant="outline"
                    className="rounded-full px-3 py-1 text-xs cursor-default"
                  >
                    Ward filter (coming soon)
                  </Badge>
                  <Badge
                    variant="outline"
                    className="rounded-full px-3 py-1 text-xs cursor-default"
                  >
                    Leader filter (coming soon)
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Study Centers Table */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  Study Centers ({pagination.total})
                </CardTitle>
                <CardDescription>
                  Manage and track all study center information
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div>
                    <div className="mb-2 h-6 w-40">
                      <Skeleton className="h-6 w-32" />
                    </div>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-xs uppercase tracking-wide text-muted-foreground">
                            Center Name
                          </TableHead>
                          <TableHead className="text-xs uppercase tracking-wide text-muted-foreground">
                            Ward No
                          </TableHead>
                          <TableHead className="text-xs uppercase tracking-wide text-muted-foreground">
                            Habitation
                          </TableHead>
                          <TableHead className="text-xs uppercase tracking-wide text-muted-foreground text-right">
                            Total Students
                          </TableHead>
                          <TableHead className="text-xs uppercase tracking-wide text-muted-foreground">
                            Group Leader
                          </TableHead>
                          <TableHead className="text-xs uppercase tracking-wide text-muted-foreground">
                            Project Responsible
                          </TableHead>
                          <TableHead className="text-xs uppercase tracking-wide text-muted-foreground">
                            Actions
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {[...Array(6)].map((_, i) => (
                          <TableRow key={i} className="even:bg-muted/30">
                            {[...Array(7)].map((__, j) => (
                              <TableCell key={j} className="py-3">
                                <Skeleton className="h-4 w-[70%]" />
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : studyCenters.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <Building2
                      className="h-12 w-12 text-muted-foreground mb-3"
                      aria-hidden="true"
                    />
                    <h3 className="text-lg font-semibold">
                      No study centers yet
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1 mb-4">
                      Get started by adding your first center.
                    </p>
                    {canCreate("education") && (
                      <Button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="gap-2"
                      >
                        <Plus className="h-4 w-4" aria-hidden="true" />
                        Add Study Center
                      </Button>
                    )}
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs uppercase tracking-wide text-muted-foreground">
                          Center Name
                        </TableHead>
                        <TableHead className="text-xs uppercase tracking-wide text-muted-foreground">
                          Ward No
                        </TableHead>
                        <TableHead className="text-xs uppercase tracking-wide text-muted-foreground">
                          Habitation
                        </TableHead>
                        <TableHead className="text-xs uppercase tracking-wide text-muted-foreground text-right">
                          Total Students
                        </TableHead>
                        <TableHead className="text-xs uppercase tracking-wide text-muted-foreground">
                          Group Leader
                        </TableHead>
                        <TableHead className="text-xs uppercase tracking-wide text-muted-foreground">
                          Project Responsible
                        </TableHead>
                        <TableHead className="text-xs uppercase tracking-wide text-muted-foreground">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {studyCenters.map((center) => (
                        <TableRow key={center._id} className="even:bg-muted/30">
                          <TableCell className="py-3 font-medium max-w-[220px]">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span
                                  className="block truncate"
                                  title={center.centreName}
                                >
                                  {center.centreName}
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                {center.centreName}
                              </TooltipContent>
                            </Tooltip>
                          </TableCell>
                          <TableCell className="py-3">
                            <Badge
                              variant="secondary"
                              className="rounded-full px-2.5 py-0.5"
                            >
                              {center.wardNo}
                            </Badge>
                          </TableCell>
                          <TableCell className="py-3 max-w-[220px]">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span
                                  className="block truncate"
                                  title={center.habitation}
                                >
                                  {center.habitation}
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                {center.habitation}
                              </TooltipContent>
                            </Tooltip>
                          </TableCell>
                          <TableCell className="py-3 text-right">
                            <Badge
                              variant="outline"
                              className="rounded-full px-2.5 py-0.5 font-semibold"
                            >
                              {center.totalStudents}
                            </Badge>
                          </TableCell>
                          <TableCell className="py-3 max-w-[200px]">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span
                                  className="block truncate"
                                  title={center.groupLeader}
                                >
                                  {center.groupLeader}
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                {center.groupLeader}
                              </TooltipContent>
                            </Tooltip>
                          </TableCell>
                          <TableCell className="py-3 max-w-[220px]">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span
                                  className="block truncate"
                                  title={center.projectResponsible}
                                >
                                  {center.projectResponsible}
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                {center.projectResponsible}
                              </TooltipContent>
                            </Tooltip>
                          </TableCell>
                          <TableCell className="py-3">
                            <div className="flex items-center gap-1.5">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => openViewModal(center)}
                                    aria-label="View Center"
                                    className="text-foreground/80 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
                                  >
                                    <Eye
                                      className="h-4 w-4"
                                      aria-hidden="true"
                                    />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>View Center</TooltipContent>
                              </Tooltip>
                              {canEdit("education") && (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => openEditModal(center)}
                                      aria-label="Edit Center"
                                      className="text-primary hover:text-primary focus-visible:ring-2 focus-visible:ring-ring"
                                    >
                                      <Edit
                                        className="h-4 w-4"
                                        aria-hidden="true"
                                      />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Edit Center</TooltipContent>
                                </Tooltip>
                              )}
                              {canDelete("education") && (
                                <AlertDialog>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <AlertDialogTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          aria-label="Delete Center"
                                          className="text-destructive hover:text-destructive focus-visible:ring-2 focus-visible:ring-destructive/30"
                                        >
                                          <Trash2
                                            className="h-4 w-4"
                                            aria-hidden="true"
                                          />
                                        </Button>
                                      </AlertDialogTrigger>
                                    </TooltipTrigger>
                                    <TooltipContent>Delete Center</TooltipContent>
                                  </Tooltip>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>
                                        Delete Center
                                      </AlertDialogTitle>
                                      <AlertDialogDescription>
                                        This action cannot be undone. This will
                                        permanently delete the study center
                                        record.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>
                                        Cancel
                                      </AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleDelete(center._id)}
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
                    <div className="text-sm text-foreground">
                      Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                      {Math.min(
                        pagination.page * pagination.limit,
                        pagination.total
                      )}{" "}
                      of {pagination.total} entries
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setPagination({
                            ...pagination,
                            page: pagination.page - 1,
                          })
                        }
                        disabled={pagination.page <= 1}
                      >
                        Previous
                      </Button>
                      <div className="text-sm">
                        Page {pagination.page} of {pagination.pages}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setPagination({
                            ...pagination,
                            page: pagination.page + 1,
                          })
                        }
                        disabled={pagination.page >= pagination.pages}
                      >
                        Next
                      </Button>
                    </div>
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
                  <DialogTitle>Add New Study Center</DialogTitle>
                  <DialogDescription>
                    Create a new study center record with all required
                    information.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="centreCode">Centre Code *</Label>
                      <Input
                        id="centreCode"
                        value={formData.centreCode}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            centreCode: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="centreName">Center Name *</Label>
                      <Input
                        id="centreName"
                        value={formData.centreName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            centreName: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="sourceOfFunding">
                        Source of Funding *
                      </Label>
                      <Input
                        id="sourceOfFunding"
                        value={formData.sourceOfFunding}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            sourceOfFunding: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="infrastructure">Infrastructure *</Label>
                      <Select
                        value={formData.infrastructure}
                        onValueChange={(value) =>
                          setFormData({ ...formData, infrastructure: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select infrastructure" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Own Building">
                            Own Building
                          </SelectItem>
                          <SelectItem value="Rented">Rented</SelectItem>
                          <SelectItem value="Community Hall">
                            Community Hall
                          </SelectItem>
                          <SelectItem value="School Premises">
                            School Premises
                          </SelectItem>
                          <SelectItem value="Temple/Church">
                            Temple/Church
                          </SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <TimeRangePicker
                        label="Timing *"
                        id="timing"
                        value={formData.timing}
                        onChange={(value) =>
                          setFormData({ ...formData, timing: value })
                        }
                        startLabel="Start Time"
                        endLabel="End Time"
                      />
                    </div>
                    <div>
                      <Label>Students Level of Education *</Label>
                      <div className="grid grid-cols-2 gap-2 mt-2 p-3 border rounded-md">
                        {[
                          "Class 1-5",
                          "Class 6-8",
                          "Class 9-10",
                          "Class 11-12",
                          "College",
                          "Other",
                        ].map((level) => (
                          <div
                            key={level}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={`level-${level}`}
                              checked={formData.studentsLevelOfEducation.includes(
                                level
                              )}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setFormData({
                                    ...formData,
                                    studentsLevelOfEducation: [
                                      ...formData.studentsLevelOfEducation,
                                      level,
                                    ],
                                  });
                                } else {
                                  setFormData({
                                    ...formData,
                                    studentsLevelOfEducation:
                                      formData.studentsLevelOfEducation.filter(
                                        (l) => l !== level
                                      ),
                                  });
                                }
                              }}
                            />
                            <label
                              htmlFor={`level-${level}`}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                            >
                              {level}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="wardNo">Ward No *</Label>
                      <Select
                        value={formData.wardNo}
                        onValueChange={(value) =>
                          setFormData({ ...formData, wardNo: value })
                        }
                        required
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
                          <SelectItem value="Ward 11">Ward 11</SelectItem>
                          <SelectItem value="Ward 12">Ward 12</SelectItem>
                          <SelectItem value="Ward 13">Ward 13</SelectItem>
                          <SelectItem value="Ward 14">Ward 14</SelectItem>
                          <SelectItem value="Ward 15">Ward 15</SelectItem>
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
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="dateOfEstablishment">
                        Date of Establishment *
                      </Label>
                      <Input
                        id="dateOfEstablishment"
                        type="date"
                        value={formData.dateOfEstablishment}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            dateOfEstablishment: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="totalStudents">Total Students *</Label>
                      <Input
                        id="totalStudents"
                        type="number"
                        value={formData.totalStudents}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            totalStudents: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="groupLeader">Group Leader *</Label>
                      <Select
                        value={formData.groupLeader}
                        onValueChange={(value) =>
                          setFormData({
                            ...formData,
                            groupLeader: value,
                          })
                        }
                      >
                        <SelectTrigger id="groupLeader">
                          <SelectValue placeholder="Select a group leader" />
                        </SelectTrigger>
                        <SelectContent>
                          {groupLeaders.map((leader) => (
                            <SelectItem key={leader.id} value={leader.id}>
                              {leader.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Teachers Section */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Label>Teachers</Label>
                      <Button type="button" onClick={addTeacherField} size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Teacher
                      </Button>
                    </div>
                    {formData.teachers.map((teacherId, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end"
                      >
                        <div>
                          <Label htmlFor={`teacher-${index}`}>
                            Teacher Name
                          </Label>
                          <Select
                            value={teacherId}
                            onValueChange={(value) => {
                              const newTeachers = [...formData.teachers];
                              newTeachers[index] = value;
                              setFormData({
                                ...formData,
                                teachers: newTeachers,
                              });
                            }}
                          >
                            <SelectTrigger id={`teacher-${index}`}>
                              <SelectValue placeholder="Select a teacher" />
                            </SelectTrigger>
                            <SelectContent>
                              {teachers.map((teacher) => (
                                <SelectItem key={teacher.id} value={teacher.id}>
                                  {teacher.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        {formData.teachers.length > 0 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeTeacherField(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Functional Aspects Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">
                      Functional Aspects
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="infrastructureQuality">
                          Infrastructure Quality
                        </Label>
                        <Select
                          value={
                            formData.functionalAspects.infrastructureQuality
                          }
                          onValueChange={(value) =>
                            setFormData({
                              ...formData,
                              functionalAspects: {
                                ...formData.functionalAspects,
                                infrastructureQuality: value,
                              },
                            })
                          }
                        >
                          <SelectTrigger id="infrastructureQuality">
                            <SelectValue placeholder="Select quality" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Excellent">Excellent</SelectItem>
                            <SelectItem value="Good">Good</SelectItem>
                            <SelectItem value="Average">Average</SelectItem>
                            <SelectItem value="Poor">Poor</SelectItem>
                            <SelectItem value="Needs Improvement">
                              Needs Improvement
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="teacherAttendance">
                          Teacher Attendance
                        </Label>
                        <Select
                          value={formData.functionalAspects.teacherAttendance}
                          onValueChange={(value) =>
                            setFormData({
                              ...formData,
                              functionalAspects: {
                                ...formData.functionalAspects,
                                teacherAttendance: value,
                              },
                            })
                          }
                        >
                          <SelectTrigger id="teacherAttendance">
                            <SelectValue placeholder="Select attendance" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Regular">Regular</SelectItem>
                            <SelectItem value="Irregular">Irregular</SelectItem>
                            <SelectItem value="Needs Monitoring">
                              Needs Monitoring
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="studentEngagement">
                          Student Engagement
                        </Label>
                        <Select
                          value={formData.functionalAspects.studentEngagement}
                          onValueChange={(value) =>
                            setFormData({
                              ...formData,
                              functionalAspects: {
                                ...formData.functionalAspects,
                                studentEngagement: value,
                              },
                            })
                          }
                        >
                          <SelectTrigger id="studentEngagement">
                            <SelectValue placeholder="Select engagement" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="High">High</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="Low">Low</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="learningOutcome">
                          Learning Outcome
                        </Label>
                        <Select
                          value={formData.functionalAspects.learningOutcome}
                          onValueChange={(value) =>
                            setFormData({
                              ...formData,
                              functionalAspects: {
                                ...formData.functionalAspects,
                                learningOutcome: value,
                              },
                            })
                          }
                        >
                          <SelectTrigger id="learningOutcome">
                            <SelectValue placeholder="Select outcome" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Excellent">Excellent</SelectItem>
                            <SelectItem value="Good">Good</SelectItem>
                            <SelectItem value="Satisfactory">
                              Satisfactory
                            </SelectItem>
                            <SelectItem value="Needs Improvement">
                              Needs Improvement
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="communityParticipation">
                          Community Participation
                        </Label>
                        <Select
                          value={
                            formData.functionalAspects.communityParticipation
                          }
                          onValueChange={(value) =>
                            setFormData({
                              ...formData,
                              functionalAspects: {
                                ...formData.functionalAspects,
                                communityParticipation: value,
                              },
                            })
                          }
                        >
                          <SelectTrigger id="communityParticipation">
                            <SelectValue placeholder="Select participation" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="Moderate">Moderate</SelectItem>
                            <SelectItem value="Low">Low</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancel
                    </Button>
                    <Button type="submit">Create Study Center</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            {/* Edit Modal */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Edit Study Center</DialogTitle>
                  <DialogDescription>
                    Update the study center information.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="editCentreCode">Centre Code *</Label>
                      <Input
                        id="editCentreCode"
                        value={formData.centreCode}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            centreCode: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="editCentreName">Center Name *</Label>
                      <Input
                        id="editCentreName"
                        value={formData.centreName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            centreName: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="editSourceOfFunding">
                        Source of Funding *
                      </Label>
                      <Input
                        id="editSourceOfFunding"
                        value={formData.sourceOfFunding}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            sourceOfFunding: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="editInfrastructure">
                        Infrastructure *
                      </Label>
                      <Select
                        value={formData.infrastructure}
                        onValueChange={(value) =>
                          setFormData({ ...formData, infrastructure: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select infrastructure" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Own Building">
                            Own Building
                          </SelectItem>
                          <SelectItem value="Rented">Rented</SelectItem>
                          <SelectItem value="Community Hall">
                            Community Hall
                          </SelectItem>
                          <SelectItem value="School Premises">
                            School Premises
                          </SelectItem>
                          <SelectItem value="Temple/Church">
                            Temple/Church
                          </SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <TimeRangePicker
                        label="Timing *"
                        id="editTiming"
                        value={formData.timing}
                        onChange={(value) =>
                          setFormData({ ...formData, timing: value })
                        }
                        startLabel="Start Time"
                        endLabel="End Time"
                      />
                    </div>
                    <div>
                      <Label>Students Level of Education *</Label>
                      <div className="grid grid-cols-2 gap-2 mt-2 p-3 border rounded-md">
                        {[
                          "Class 1-5",
                          "Class 6-8",
                          "Class 9-10",
                          "Class 11-12",
                          "College",
                          "Other",
                        ].map((level) => (
                          <div
                            key={level}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={`edit-level-${level}`}
                              checked={formData.studentsLevelOfEducation.includes(
                                level
                              )}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setFormData({
                                    ...formData,
                                    studentsLevelOfEducation: [
                                      ...formData.studentsLevelOfEducation,
                                      level,
                                    ],
                                  });
                                } else {
                                  setFormData({
                                    ...formData,
                                    studentsLevelOfEducation:
                                      formData.studentsLevelOfEducation.filter(
                                        (l) => l !== level
                                      ),
                                  });
                                }
                              }}
                            />
                            <label
                              htmlFor={`edit-level-${level}`}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                            >
                              {level}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="editWardNo">Ward No *</Label>
                      <Select
                        value={formData.wardNo}
                        onValueChange={(value) =>
                          setFormData({ ...formData, wardNo: value })
                        }
                        required
                      >
                        <SelectTrigger id="editWardNo">
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
                          <SelectItem value="Ward 11">Ward 11</SelectItem>
                          <SelectItem value="Ward 12">Ward 12</SelectItem>
                          <SelectItem value="Ward 13">Ward 13</SelectItem>
                          <SelectItem value="Ward 14">Ward 14</SelectItem>
                          <SelectItem value="Ward 15">Ward 15</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="editHabitation">Habitation *</Label>
                      <Input
                        id="editHabitation"
                        value={formData.habitation}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            habitation: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="editProjectResponsible">
                        Project Responsible *
                      </Label>
                      <Input
                        id="editProjectResponsible"
                        value={formData.projectResponsible}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            projectResponsible: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="editDateOfEstablishment">
                        Date of Establishment *
                      </Label>
                      <Input
                        id="editDateOfEstablishment"
                        type="date"
                        value={formData.dateOfEstablishment}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            dateOfEstablishment: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="editTotalStudents">
                        Total Students *
                      </Label>
                      <Input
                        id="editTotalStudents"
                        type="number"
                        value={formData.totalStudents}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            totalStudents: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="editGroupLeader">Group Leader *</Label>
                      <Select
                        value={formData.groupLeader}
                        onValueChange={(value) =>
                          setFormData({
                            ...formData,
                            groupLeader: value,
                          })
                        }
                      >
                        <SelectTrigger id="editGroupLeader">
                          <SelectValue placeholder="Select a group leader" />
                        </SelectTrigger>
                        <SelectContent>
                          {groupLeaders.map((leader) => (
                            <SelectItem key={leader.id} value={leader.id}>
                              {leader.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Teachers Section */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Label>Teachers</Label>
                      <Button type="button" onClick={addTeacherField} size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Teacher
                      </Button>
                    </div>
                    {formData.teachers.map((teacherId, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end"
                      >
                        <div>
                          <Label htmlFor={`editTeacher-${index}`}>
                            Teacher Name
                          </Label>
                          <Select
                            value={teacherId}
                            onValueChange={(value) => {
                              const newTeachers = [...formData.teachers];
                              newTeachers[index] = value;
                              setFormData({
                                ...formData,
                                teachers: newTeachers,
                              });
                            }}
                          >
                            <SelectTrigger id={`editTeacher-${index}`}>
                              <SelectValue placeholder="Select a teacher" />
                            </SelectTrigger>
                            <SelectContent>
                              {teachers.map((teacher) => (
                                <SelectItem key={teacher.id} value={teacher.id}>
                                  {teacher.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        {formData.teachers.length > 0 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeTeacherField(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Functional Aspects Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">
                      Functional Aspects
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="editInfrastructureQuality">
                          Infrastructure Quality
                        </Label>
                        <Select
                          value={
                            formData.functionalAspects.infrastructureQuality
                          }
                          onValueChange={(value) =>
                            setFormData({
                              ...formData,
                              functionalAspects: {
                                ...formData.functionalAspects,
                                infrastructureQuality: value,
                              },
                            })
                          }
                        >
                          <SelectTrigger id="editInfrastructureQuality">
                            <SelectValue placeholder="Select quality" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Excellent">Excellent</SelectItem>
                            <SelectItem value="Good">Good</SelectItem>
                            <SelectItem value="Average">Average</SelectItem>
                            <SelectItem value="Poor">Poor</SelectItem>
                            <SelectItem value="Needs Improvement">
                              Needs Improvement
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="editTeacherAttendance">
                          Teacher Attendance
                        </Label>
                        <Select
                          value={formData.functionalAspects.teacherAttendance}
                          onValueChange={(value) =>
                            setFormData({
                              ...formData,
                              functionalAspects: {
                                ...formData.functionalAspects,
                                teacherAttendance: value,
                              },
                            })
                          }
                        >
                          <SelectTrigger id="editTeacherAttendance">
                            <SelectValue placeholder="Select attendance" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Regular">Regular</SelectItem>
                            <SelectItem value="Irregular">Irregular</SelectItem>
                            <SelectItem value="Needs Monitoring">
                              Needs Monitoring
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="editStudentEngagement">
                          Student Engagement
                        </Label>
                        <Select
                          value={formData.functionalAspects.studentEngagement}
                          onValueChange={(value) =>
                            setFormData({
                              ...formData,
                              functionalAspects: {
                                ...formData.functionalAspects,
                                studentEngagement: value,
                              },
                            })
                          }
                        >
                          <SelectTrigger id="editStudentEngagement">
                            <SelectValue placeholder="Select engagement" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="High">High</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="Low">Low</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="editLearningOutcome">
                          Learning Outcome
                        </Label>
                        <Select
                          value={formData.functionalAspects.learningOutcome}
                          onValueChange={(value) =>
                            setFormData({
                              ...formData,
                              functionalAspects: {
                                ...formData.functionalAspects,
                                learningOutcome: value,
                              },
                            })
                          }
                        >
                          <SelectTrigger id="editLearningOutcome">
                            <SelectValue placeholder="Select outcome" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Excellent">Excellent</SelectItem>
                            <SelectItem value="Good">Good</SelectItem>
                            <SelectItem value="Satisfactory">
                              Satisfactory
                            </SelectItem>
                            <SelectItem value="Needs Improvement">
                              Needs Improvement
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="editCommunityParticipation">
                          Community Participation
                        </Label>
                        <Select
                          value={
                            formData.functionalAspects.communityParticipation
                          }
                          onValueChange={(value) =>
                            setFormData({
                              ...formData,
                              functionalAspects: {
                                ...formData.functionalAspects,
                                communityParticipation: value,
                              },
                            })
                          }
                        >
                          <SelectTrigger id="editCommunityParticipation">
                            <SelectValue placeholder="Select participation" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="Moderate">Moderate</SelectItem>
                            <SelectItem value="Low">Low</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancel
                    </Button>
                    <Button type="submit">Update Study Center</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            {/* View Modal */}
            <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Study Center Details</DialogTitle>
                  <DialogDescription>
                    View complete information about this study center.
                  </DialogDescription>
                </DialogHeader>
                {selectedCenter && (
                  <div className="space-y-6">
                    {/* Basic Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold border-b pb-2">
                        Basic Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="font-semibold">Centre Code</Label>
                          <p>{selectedCenter.centreCode}</p>
                        </div>
                        <div>
                          <Label className="font-semibold">Centre Name</Label>
                          <p>{selectedCenter.centreName}</p>
                        </div>
                        <div>
                          <Label className="font-semibold">
                            Source of Funding
                          </Label>
                          <Badge>{selectedCenter.sourceOfFunding}</Badge>
                        </div>
                        <div>
                          <Label className="font-semibold">
                            Infrastructure
                          </Label>
                          <p>{selectedCenter.infrastructure || "N/A"}</p>
                        </div>
                        <div>
                          <Label className="font-semibold">Timing</Label>
                          <p>{selectedCenter.timing || "N/A"}</p>
                        </div>
                        <div>
                          <Label className="font-semibold">
                            Date of Establishment
                          </Label>
                          <p>
                            {selectedCenter.dateOfEstablishment
                              ? new Date(
                                  selectedCenter.dateOfEstablishment
                                ).toLocaleDateString()
                              : "N/A"}
                          </p>
                        </div>
                        <div>
                          <Label className="font-semibold">Ward No</Label>
                          <p>{selectedCenter.wardNo}</p>
                        </div>
                        <div>
                          <Label className="font-semibold">Habitation</Label>
                          <p>{selectedCenter.habitation}</p>
                        </div>
                        <div>
                          <Label className="font-semibold">
                            Project Responsible
                          </Label>
                          <p>{selectedCenter.projectResponsible}</p>
                        </div>
                        <div>
                          <Label className="font-semibold">
                            Total Students
                          </Label>
                          <p>{selectedCenter.totalStudents}</p>
                        </div>
                      </div>
                      {selectedCenter.studentsLevelOfEducation &&
                        selectedCenter.studentsLevelOfEducation.length > 0 && (
                          <div>
                            <Label className="font-semibold">
                              Students Level of Education
                            </Label>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {selectedCenter.studentsLevelOfEducation.map(
                                (level, index) => (
                                  <Badge key={index} variant="outline">
                                    {level}
                                  </Badge>
                                )
                              )}
                            </div>
                          </div>
                        )}
                    </div>

                    {/* Leadership */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold border-b pb-2">
                        Leadership
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="font-semibold">Group Leader</Label>
                          <p>{selectedCenter.groupLeader}</p>
                        </div>
                        <div>
                          <Label className="font-semibold">
                            Group Leader Contact
                          </Label>
                          <p>{selectedCenter.groupLeaderContact}</p>
                        </div>
                      </div>
                    </div>

                    {/* Teachers */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold border-b pb-2">
                        Teachers
                      </h3>
                      {selectedCenter.teacherNames &&
                      selectedCenter.teacherNames.length > 0 ? (
                        <div className="space-y-2">
                          {selectedCenter.teacherNames.map((name, index) => (
                            <div
                              key={index}
                              className="flex justify-between items-center p-3 bg-secondary/50 rounded"
                            >
                              <span className="font-medium">{name}</span>
                              <span className="text-sm text-muted-foreground">
                                {selectedCenter.teacherContacts?.[index] ||
                                  "N/A"}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          No teachers listed
                        </p>
                      )}
                    </div>

                    {/* Functional Aspects */}
                    {selectedCenter.functionalAspects && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold border-b pb-2">
                          Functional Aspects
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {selectedCenter.functionalAspects
                            .infrastructureQuality && (
                            <div>
                              <Label className="font-semibold">
                                Infrastructure Quality
                              </Label>
                              <p>
                                {
                                  selectedCenter.functionalAspects
                                    .infrastructureQuality
                                }
                              </p>
                            </div>
                          )}
                          {selectedCenter.functionalAspects
                            .teacherAttendance && (
                            <div>
                              <Label className="font-semibold">
                                Teacher Attendance
                              </Label>
                              <p>
                                {
                                  selectedCenter.functionalAspects
                                    .teacherAttendance
                                }
                              </p>
                            </div>
                          )}
                          {selectedCenter.functionalAspects
                            .studentEngagement && (
                            <div>
                              <Label className="font-semibold">
                                Student Engagement
                              </Label>
                              <p>
                                {
                                  selectedCenter.functionalAspects
                                    .studentEngagement
                                }
                              </p>
                            </div>
                          )}
                          {selectedCenter.functionalAspects.learningOutcome && (
                            <div>
                              <Label className="font-semibold">
                                Learning Outcome
                              </Label>
                              <p>
                                {
                                  selectedCenter.functionalAspects
                                    .learningOutcome
                                }
                              </p>
                            </div>
                          )}
                          {selectedCenter.functionalAspects
                            .communityParticipation && (
                            <div>
                              <Label className="font-semibold">
                                Community Participation
                              </Label>
                              <p>
                                {
                                  selectedCenter.functionalAspects
                                    .communityParticipation
                                }
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
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

export default StudyCenters;
