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
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  UserMinus,
  Check,
  ChevronsUpDown,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  RefreshCw,
  Menu,
  FileSpreadsheet,
} from "lucide-react";
import { dropoutAPI, scStudentAPI } from "../services/api";
import Sidebar from "../components/Sidebar";
import usePermissions from "../hooks/usePermissions";
import { getWardOptions } from "../lib/formOptions";
import GuidelinesCard from "../components/GuidelinesCard";
import ExcelBulkImportButton from "../components/ExcelBulkImportButton";

const WardCombobox = ({ id, value, onChange, options, placeholder }) => {
  const [open, setOpen] = useState(false);
  const selectedWard = options.find((ward) => ward.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-controls={`${id}-list`}
          className="h-9 w-full justify-between bg-input px-3 text-left text-sm font-normal text-foreground"
        >
          {selectedWard ? selectedWard.label : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-[--radix-popover-trigger-width] p-0"
      >
        <Command>
          <CommandInput
            placeholder="Type ward number..."
            autoFocus
            onKeyDown={(event) => event.stopPropagation()}
          />
          <CommandList
            id={`${id}-list`}
            className="max-h-56"
            onWheel={(event) => event.stopPropagation()}
          >
            <CommandEmpty>No ward found.</CommandEmpty>
            <CommandGroup>
              {options.map((ward) => (
                <CommandItem
                  key={ward.value}
                  value={`${ward.label} ${ward.numberValue}`}
                  onSelect={() => {
                    onChange(ward.value);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === ward.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {ward.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

const Dropouts = () => {
  const wardOptions = getWardOptions();
  const { canCreate, canEdit, canDelete, canExport } = usePermissions();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropouts, setDropouts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    wardNo: "",
    gender: "",
    enrollmentStatus: "",
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const [selectedDropout, setSelectedDropout] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [scStudents, setScStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [formData, setFormData] = useState({
    householdCode: "",
    name: "",
    gender: "",
    age: "",
    contactNo: "",
    headOfHousehold: "",
    wardNo: "",
    habitation: "",
    projectResponsible: "",
    category: "",
    dateOfReporting: "",
    reportedBy: "",
    yearOfDropout: "",
    enrolmentDate: "",
    schoolNameAtEnrolment: "",
    educationLevelWhenDropout: "",
    schoolNameWhenDropout: "",
    reasonForDropout: "",
    documentsCheck: {
      birthCertificate: false,
      polioCard: false,
      adharCard: false,
      transferCertificate: false,
    },
    dateOfEducationalAssessment: "",
    educationalScreeningResults: "",
    dateOfCareerCounselling: "",
    counselingReport: "",
    individualCarePlan: "",
    enrollmentStatus: "Pending",
    dateOfReAdmission: "",
    educationLevelWhenReAdmission: "",
    schoolNameWhenReAdmission: "",
    progressReporting: {},
    photoDocumentation: {},
  });

  // Fetch dropouts
  const fetchDropouts = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        search: searchTerm,
        ...filters,
      };

      const response = await dropoutAPI.getAll(params);
      console.log("Dropout API Response:", response);
      console.log("Dropout data:", response.data);

      // Handle the response structure correctly
      if (response.data && response.data.data) {
        setDropouts(response.data.data);
        setPagination(response.data.pagination);
      } else {
        // Fallback if structure is different
        setDropouts(response.data || []);
        setPagination({
          page: pagination.page,
          limit: pagination.limit,
          total: 0,
          pages: 0,
        });
      }
    } catch (error) {
      toast.error("Failed to fetch dropouts");
      console.error("Error fetching dropouts:", error);
      setDropouts([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch SC Students
  const fetchScStudents = async () => {
    try {
      const response = await scStudentAPI.getAll({});
      setScStudents(response.data.data || []);
    } catch (error) {
      console.error("Error fetching SC students:", error);
      toast.error("Failed to load SC students");
      setScStudents([]);
    }
  };

  // Auto-populate form when student is selected
  const handleStudentSelect = (studentId) => {
    setSelectedStudent(studentId);
    const student = scStudents.find((s) => s._id === studentId);
    if (student) {
      setFormData({
        ...formData,
        householdCode: student.householdCode || "",
        name: student.name || "",
        gender: student.gender || "",
        age: student.age || "",
        contactNo: student.contactNo || "",
        headOfHousehold: student.headOfHousehold || "",
        wardNo: student.wardNo || "",
        habitation: student.habitation || "",
        projectResponsible: student.projectResponsible || "",
      });
    }
  };

  useEffect(() => {
    fetchDropouts();
  }, [pagination.page, pagination.limit, searchTerm, filters]);

  // Fetch SC students when create modal opens
  useEffect(() => {
    if (isCreateModalOpen || isEditModalOpen) {
      fetchScStudents();
    }
  }, [isCreateModalOpen, isEditModalOpen]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        schoolName: formData.schoolNameWhenDropout || "",
      };

      if (selectedDropout) {
        await dropoutAPI.update(selectedDropout._id, payload);
        toast.success("Dropout record updated successfully");
        setIsEditModalOpen(false);
      } else {
        await dropoutAPI.create(payload);
        toast.success("Dropout record created successfully");
        setIsCreateModalOpen(false);
      }

      fetchDropouts();
      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    try {
      await dropoutAPI.delete(id);
      toast.success("Dropout record deleted successfully");
      fetchDropouts();
    } catch (error) {
      toast.error("Failed to delete dropout record");
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      householdCode: "",
      name: "",
      gender: "",
      age: "",
      contactNo: "",
      headOfHousehold: "",
      wardNo: "",
      habitation: "",
      projectResponsible: "",
      dateOfReporting: "",
      reportedBy: "",
      yearOfDropout: "",
      enrolmentDate: "",
      schoolNameAtEnrolment: "",
      educationLevelWhenDropout: "",
      schoolNameWhenDropout: "",
      reasonForDropout: "",
      documentsCheck: {
        birthCertificate: false,
        polioCard: false,
        adharCard: false,
        transferCertificate: false,
      },
      dateOfEducationalAssessment: "",
      educationalScreeningResults: "",
      dateOfCareerCounselling: "",
      counselingReport: "",
      individualCarePlan: "",
      enrollmentStatus: "Pending",
      dateOfReAdmission: "",
      educationLevelWhenReAdmission: "",
      schoolNameWhenReAdmission: "",
      progressReporting: {},
      photoDocumentation: {},
    });
    setSelectedDropout(null);
    setSelectedStudent("");
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
  };

  // Open edit modal
  const openEditModal = (dropout) => {
    setSelectedDropout(dropout);
    setFormData({
      ...dropout,
      enrolmentDate: dropout.enrolmentDate
        ? new Date(dropout.enrolmentDate).toISOString().split("T")[0]
        : "",
      dateOfReporting: dropout.dateOfReporting
        ? new Date(dropout.dateOfReporting).toISOString().split("T")[0]
        : "",
      dateOfEducationalAssessment: dropout.dateOfEducationalAssessment
        ? new Date(dropout.dateOfEducationalAssessment)
            .toISOString()
            .split("T")[0]
        : "",
      dateOfCareerCounselling: dropout.dateOfCareerCounselling
        ? new Date(dropout.dateOfCareerCounselling).toISOString().split("T")[0]
        : "",
      dateOfReAdmission: dropout.dateOfReAdmission
        ? new Date(dropout.dateOfReAdmission).toISOString().split("T")[0]
        : "",
    });
    setIsEditModalOpen(true);
  };

  // Open view modal
  const openViewModal = (dropout) => {
    setSelectedDropout(dropout);
    setIsViewModalOpen(true);
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeItem="dropouts"
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        {/* Mobile Header */}
        <div className="lg:hidden bg-card shadow-md p-4 flex items-center border-b">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(true)}
            className="mr-2"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold">Dropouts</h1>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="container mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  Dropouts
                </h1>
                <p className="text-muted-foreground">
                  Manage dropout records
                </p>
              </div>
              {canCreate("education") && (
                <Button onClick={() => setIsCreateModalOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Dropout Record
                </Button>
              )}
            </div>

            <GuidelinesCard
              title="Dropout Re-enrollment Guidelines"
              description="Support students who have left school in returning to their education."
              items={[
                "Identify the specific reason for dropout (Financial, Health, Social, etc.).",
                "Verify availability of critical documents like Transfer Certificates (TC).",
                "Track current re-admission status and new school details.",
                "Document counseling provided to both students and parents.",
                "Monitor re-enrolled students' attendance and adjustment progress.",
              ]}
            />

            {/* Search and Filters */}
            <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="border-b bg-secondary">
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Search & Filters
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search dropouts..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Bulk Import Card */}
            {canCreate("education") && (
              <Card className="border border-muted bg-card shadow-sm mb-6">
                <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4">
                  <div className="space-y-1">
                    <h3 className="font-semibold text-foreground flex items-center gap-2">
                      <FileSpreadsheet className="h-5 w-5 text-green-600" />
                      Bulk Import Dropouts
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Download the template, fill it in, and upload it to import records in bulk.
                    </p>
                  </div>
                  <ExcelBulkImportButton
                    label="Import Excel"
                    description=""
                    templateFields={[
                      { label: "Household Code", key: "householdCode" },
                      { label: "ID Code", key: "idCode" },
                      { label: "Name", key: "name" },
                      { label: "Gender", key: "gender", options: ["Male", "Female", "Other"] },
                      { label: "Age", key: "age" },
                      { label: "Head of Household", key: "headOfHousehold" },
                      { label: "Contact Number", key: "contactNo" },
                      { label: "Ward Number", key: "wardNo" },
                      { label: "Habitation", key: "habitation" },
                      { label: "Project Responsible", key: "projectResponsible" },
                      { label: "Date of Reporting", key: "dateOfReporting" },
                      { label: "Reported By", key: "reportedBy" },
                      { label: "Last School Attended", key: "lastSchoolAttended" },
                      { label: "Last Class Completed", key: "lastClassCompleted" },
                      { label: "Year of Dropout", key: "yearOfDropout" },
                      { label: "Reason for Dropout", key: "reasonForDropout" },
                      { label: "Enrollment Status", key: "enrollmentStatus", options: ["Enrolled", "Pending", "Not Enrolled"] },
                      { label: "Remarks", key: "remarks" },
                    ]}
                    sampleRow={{
                      householdCode: "HH-201",
                      idCode: "DROP-001",
                      name: "Sunil Kumar",
                      gender: "Male",
                      age: "15",
                      headOfHousehold: "Mohan Kumar",
                      contactNo: "9876543210",
                      wardNo: "16",
                      habitation: "Kazi Para",
                      projectResponsible: "Ravi Shankar",
                      dateOfReporting: "2024-01-20",
                      reportedBy: "Volunteer Suman",
                      lastSchoolAttended: "City Model School",
                      lastClassCompleted: "7th Standard",
                      yearOfDropout: "2023",
                      reasonForDropout: "Financial difficulty",
                      enrollmentStatus: "Pending",
                      remarks: "Counseling in progress",
                    }}
                    createRecord={async (payload) => {
                      await dropoutAPI.create(payload);
                    }}
                    onImported={fetchDropouts}
                  />
                </CardContent>
              </Card>
            )}

            {/* Dropouts Table */}
            <Card className="shadow-md">
              <CardHeader className="border-b border-border bg-background">
                <CardTitle>Dropouts ({pagination.total})</CardTitle>
                <CardDescription>
                  Manage and track all dropout records
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
                        <TableHead>Household Code</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Gender</TableHead>
                        <TableHead>Age</TableHead>
                        <TableHead>Year of Dropout</TableHead>
                        <TableHead>Enrollment Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {dropouts.map((dropout) => (
                        <TableRow
                          key={dropout._id}
                          className="hover:bg-secondary"
                        >
                          <TableCell className="font-medium">
                            {dropout.householdCode}
                          </TableCell>
                          <TableCell>{dropout.name}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">{dropout.gender}</Badge>
                          </TableCell>
                          <TableCell>{dropout.age}</TableCell>
                          <TableCell>{dropout.yearOfDropout}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                dropout.enrollmentStatus === "Enrolled"
                                  ? "default"
                                  : dropout.enrollmentStatus === "Pending"
                                  ? "secondary"
                                  : "destructive"
                              }
                            >
                              {dropout.enrollmentStatus}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openViewModal(dropout)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              {canEdit("education") && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => openEditModal(dropout)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              )}
                              {canDelete("education") && (
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>
                                        Are you absolutely sure?
                                      </AlertDialogTitle>
                                      <AlertDialogDescription>
                                        This action cannot be undone. This will
                                        permanently delete the dropout record.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>
                                        Cancel
                                      </AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleDelete(dropout._id)}
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
              </CardContent>
            </Card>

            {/* Create Modal */}
            <Dialog
              open={isCreateModalOpen}
              onOpenChange={setIsCreateModalOpen}
            >
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Dropout Record</DialogTitle>
                  <DialogDescription>
                    Create a new dropout record with all required information.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Student Selection Section */}
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 space-y-3">
                    <div>
                      <Label
                        htmlFor="selectStudent"
                        className="font-semibold text-blue-900"
                      >
                        Select from SC Students (Optional)
                      </Label>
                      <p className="text-sm text-blue-800 mb-2">
                        Choose a student to auto-populate the form, or leave
                        empty to enter manually.
                      </p>
                      <Select
                        value={selectedStudent}
                        onValueChange={handleStudentSelect}
                      >
                        <SelectTrigger id="selectStudent">
                          <SelectValue placeholder="Search and select a student..." />
                        </SelectTrigger>
                        <SelectContent>
                          {scStudents.length === 0 ? (
                            <SelectItem value="no-students" disabled>
                              No SC students available
                            </SelectItem>
                          ) : (
                            scStudents.map((student) => (
                              <SelectItem key={student._id} value={student._id}>
                                {student.name} - {student.householdCode}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="householdCode">Household Code *</Label>
                      <Input
                        id="householdCode"
                        value={formData.householdCode}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            householdCode: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="name">Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="gender">Gender</Label>
                      <Select
                        value={formData.gender}
                        onValueChange={(value) =>
                          setFormData({ ...formData, gender: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Boy">Boy</SelectItem>
                          <SelectItem value="Girl">Girl</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="age">Age</Label>
                      <Input
                        id="age"
                        type="number"
                        value={formData.age}
                        onChange={(e) =>
                          setFormData({ ...formData, age: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="contactNo">Contact Number</Label>
                      <Input
                        id="contactNo"
                        value={formData.contactNo}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            contactNo: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="headOfHousehold">
                        Head of Household
                      </Label>
                      <Input
                        id="headOfHousehold"
                        value={formData.headOfHousehold}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            headOfHousehold: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="wardNo">Ward Number *</Label>
                      <WardCombobox
                        id="wardNo"
                        value={formData.wardNo}
                        onChange={(value) =>
                          setFormData({ ...formData, wardNo: value })
                        }
                        options={wardOptions}
                        placeholder="Select ward"
                      />
                    </div>
                    <div>
                      <Label htmlFor="habitation">Habitation</Label>
                      <Input
                        id="habitation"
                        value={formData.habitation}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            habitation: e.target.value,
                          })
                        }
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
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) =>
                          setFormData({ ...formData, category: value })
                        }
                      >
                        <SelectTrigger id="category">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SC">SC</SelectItem>
                          <SelectItem value="ST">ST</SelectItem>
                          <SelectItem value="OBC">OBC</SelectItem>
                          <SelectItem value="Muslim">Muslim</SelectItem>
                          <SelectItem value="General">General</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="dateOfReporting">
                        Date of Reporting
                      </Label>
                      <Input
                        id="dateOfReporting"
                        type="date"
                        value={formData.dateOfReporting}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            dateOfReporting: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="reportedBy">Reported By</Label>
                      <Input
                        id="reportedBy"
                        value={formData.reportedBy}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            reportedBy: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="yearOfDropout">Year of Dropout</Label>
                      <Input
                        id="yearOfDropout"
                        type="number"
                        min={1990}
                        value={formData.yearOfDropout}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            yearOfDropout: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="enrolmentDate">Enrolment Date</Label>
                      <Input
                        id="enrolmentDate"
                        type="date"
                        value={formData.enrolmentDate}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            enrolmentDate: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="schoolNameAtEnrolment">
                        School Name at Enrolment
                      </Label>
                      <Input
                        id="schoolNameAtEnrolment"
                        value={formData.schoolNameAtEnrolment}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            schoolNameAtEnrolment: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="educationLevelWhenDropout">
                        Education Level When Dropout
                      </Label>
                      <Input
                        id="educationLevelWhenDropout"
                        value={formData.educationLevelWhenDropout}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            educationLevelWhenDropout: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="schoolNameWhenDropout">
                        School Name When Dropout
                      </Label>
                      <Input
                        id="schoolNameWhenDropout"
                        value={formData.schoolNameWhenDropout}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            schoolNameWhenDropout: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="enrollmentStatus">
                        Enrollment Status
                      </Label>
                      <Select
                        value={formData.enrollmentStatus}
                        onValueChange={(value) =>
                          setFormData({ ...formData, enrollmentStatus: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="Enrolled">Enrolled</SelectItem>
                          <SelectItem value="Not Enrolled">
                            Not Enrolled
                          </SelectItem>
                          <SelectItem value="In Progress">
                            In Progress
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="reasonForDropout">
                        Reason for Dropout
                      </Label>
                      <Textarea
                        id="reasonForDropout"
                        value={formData.reasonForDropout}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            reasonForDropout: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="dateOfEducationalAssessment">
                        Date of Educational Assessment
                      </Label>
                      <Input
                        id="dateOfEducationalAssessment"
                        type="date"
                        value={formData.dateOfEducationalAssessment}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            dateOfEducationalAssessment: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="educationalScreeningResults">
                        Educational Screening Results
                      </Label>
                      <Input
                        id="educationalScreeningResults"
                        value={formData.educationalScreeningResults}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            educationalScreeningResults: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="dateOfCareerCounselling">
                        Date of Career Counselling
                      </Label>
                      <Input
                        id="dateOfCareerCounselling"
                        type="date"
                        value={formData.dateOfCareerCounselling}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            dateOfCareerCounselling: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="counselingReport">Counseling Report</Label>
                      <Input
                        id="counselingReport"
                        value={formData.counselingReport}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            counselingReport: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancel
                    </Button>
                    <Button type="submit">Create Dropout Record</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            {/* Edit and View Modals - Similar structure to create modal */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Edit Dropout Record</DialogTitle>
                  <DialogDescription>
                    Update the dropout record information.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Student Selection Section */}
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 space-y-3">
                    <div>
                      <Label
                        htmlFor="editSelectStudent"
                        className="font-semibold text-blue-900"
                      >
                        Update from SC Students (Optional)
                      </Label>
                      <p className="text-sm text-blue-800 mb-2">
                        Choose a student to update form fields, or modify
                        manually.
                      </p>
                      <Select
                        value={selectedStudent}
                        onValueChange={handleStudentSelect}
                      >
                        <SelectTrigger id="editSelectStudent">
                          <SelectValue placeholder="Search and select a student..." />
                        </SelectTrigger>
                        <SelectContent>
                          {scStudents.length === 0 ? (
                            <SelectItem value="no-students" disabled>
                              No SC students available
                            </SelectItem>
                          ) : (
                            scStudents.map((student) => (
                              <SelectItem key={student._id} value={student._id}>
                                {student.name} - {student.householdCode}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="editHouseholdCode">
                        Household Code *
                      </Label>
                      <Input
                        id="editHouseholdCode"
                        value={formData.householdCode}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            householdCode: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="editName">Name *</Label>
                      <Input
                        id="editName"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="editGender">Gender</Label>
                      <Select
                        value={formData.gender}
                        onValueChange={(value) =>
                          setFormData({ ...formData, gender: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Boy">Boy</SelectItem>
                          <SelectItem value="Girl">Girl</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="editAge">Age</Label>
                      <Input
                        id="editAge"
                        type="number"
                        value={formData.age}
                        onChange={(e) =>
                          setFormData({ ...formData, age: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="editContactNo">Contact Number</Label>
                      <Input
                        id="editContactNo"
                        value={formData.contactNo}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            contactNo: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="editHeadOfHousehold">
                        Head of Household
                      </Label>
                      <Input
                        id="editHeadOfHousehold"
                        value={formData.headOfHousehold}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            headOfHousehold: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="editWardNo">Ward Number *</Label>
                      <WardCombobox
                        id="editWardNo"
                        value={formData.wardNo}
                        onChange={(value) =>
                          setFormData({ ...formData, wardNo: value })
                        }
                        options={wardOptions}
                        placeholder="Select ward"
                      />
                    </div>
                    <div>
                      <Label htmlFor="editHabitation">Habitation</Label>
                      <Input
                        id="editHabitation"
                        value={formData.habitation}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            habitation: e.target.value,
                          })
                        }
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
                      <Label htmlFor="editCategory">Category</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) =>
                          setFormData({ ...formData, category: value })
                        }
                      >
                        <SelectTrigger id="editCategory">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SC">SC</SelectItem>
                          <SelectItem value="ST">ST</SelectItem>
                          <SelectItem value="OBC">OBC</SelectItem>
                          <SelectItem value="Muslim">Muslim</SelectItem>
                          <SelectItem value="General">General</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="editDateOfReporting">
                        Date of Reporting
                      </Label>
                      <Input
                        id="editDateOfReporting"
                        type="date"
                        value={formData.dateOfReporting}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            dateOfReporting: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="editReportedBy">Reported By</Label>
                      <Input
                        id="editReportedBy"
                        value={formData.reportedBy}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            reportedBy: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="editYearOfDropout">
                        Year of Dropout
                      </Label>
                      <Input
                        id="editYearOfDropout"
                        type="number"
                        min={1990}
                        value={formData.yearOfDropout}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            yearOfDropout: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="editEnrolmentDate">Enrolment Date</Label>
                      <Input
                        id="editEnrolmentDate"
                        type="date"
                        value={formData.enrolmentDate || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            enrolmentDate: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="editSchoolNameAtEnrolment">
                        School Name at Enrolment
                      </Label>
                      <Input
                        id="editSchoolNameAtEnrolment"
                        value={formData.schoolNameAtEnrolment || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            schoolNameAtEnrolment: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="editEducationLevelWhenDropout">
                        Education Level When Dropout
                      </Label>
                      <Input
                        id="editEducationLevelWhenDropout"
                        value={formData.educationLevelWhenDropout}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            educationLevelWhenDropout: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="editSchoolNameWhenDropout">
                        School Name When Dropout
                      </Label>
                      <Input
                        id="editSchoolNameWhenDropout"
                        value={formData.schoolNameWhenDropout}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            schoolNameWhenDropout: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="editEnrollmentStatus">
                        Enrollment Status
                      </Label>
                      <Select
                        value={formData.enrollmentStatus}
                        onValueChange={(value) =>
                          setFormData({ ...formData, enrollmentStatus: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="Enrolled">Enrolled</SelectItem>
                          <SelectItem value="Not Enrolled">
                            Not Enrolled
                          </SelectItem>
                          <SelectItem value="In Progress">
                            In Progress
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="editReasonForDropout">
                        Reason for Dropout
                      </Label>
                      <Textarea
                        id="editReasonForDropout"
                        value={formData.reasonForDropout}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            reasonForDropout: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="editDateOfEducationalAssessment">
                        Date of Educational Assessment
                      </Label>
                      <Input
                        id="editDateOfEducationalAssessment"
                        type="date"
                        value={formData.dateOfEducationalAssessment}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            dateOfEducationalAssessment: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="editEducationalScreeningResults">
                        Educational Screening Results
                      </Label>
                      <Input
                        id="editEducationalScreeningResults"
                        value={formData.educationalScreeningResults}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            educationalScreeningResults: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="editDateOfCareerCounselling">
                        Date of Career Counselling
                      </Label>
                      <Input
                        id="editDateOfCareerCounselling"
                        type="date"
                        value={formData.dateOfCareerCounselling}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            dateOfCareerCounselling: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="editCounselingReport">
                        Counseling Report
                      </Label>
                      <Input
                        id="editCounselingReport"
                        value={formData.counselingReport}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            counselingReport: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancel
                    </Button>
                    <Button type="submit">Update Dropout Record</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            {/* View Modal */}
            <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Dropout Record Details</DialogTitle>
                  <DialogDescription>
                    View complete information about this dropout record.
                  </DialogDescription>
                </DialogHeader>
                {selectedDropout && (
                  <div className="space-y-6">
                    {/* Basic Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold border-b pb-2">
                        Basic Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="font-semibold">
                            Household Code
                          </Label>
                          <p>{selectedDropout.householdCode}</p>
                        </div>
                        <div>
                          <Label className="font-semibold">Name</Label>
                          <p>{selectedDropout.name}</p>
                        </div>
                        <div>
                          <Label className="font-semibold">Gender</Label>
                          <Badge variant="outline">
                            {selectedDropout.gender}
                          </Badge>
                        </div>
                        <div>
                          <Label className="font-semibold">Age</Label>
                          <p>{selectedDropout.age} years</p>
                        </div>
                        <div>
                          <Label className="font-semibold">
                            Contact Number
                          </Label>
                          <p>{selectedDropout.contactNo}</p>
                        </div>
                        <div>
                          <Label className="font-semibold">
                            Head of Household
                          </Label>
                          <p>{selectedDropout.headOfHousehold}</p>
                        </div>
                        <div>
                          <Label className="font-semibold">Ward No</Label>
                          <p>{selectedDropout.wardNo}</p>
                        </div>
                        <div>
                          <Label className="font-semibold">Habitation</Label>
                          <p>{selectedDropout.habitation}</p>
                        </div>
                        <div>
                          <Label className="font-semibold">
                            Project Responsible
                          </Label>
                          <p>{selectedDropout.projectResponsible}</p>
                        </div>
                        <div>
                          <Label className="font-semibold">Category</Label>
                          <p>{selectedDropout.category}</p>
                        </div>
                      </div>
                    </div>

                    {/* Reporting Details */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold border-b pb-2">
                        Reporting Details
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="font-semibold">
                            Date of Reporting
                          </Label>
                          <p>
                            {selectedDropout.dateOfReporting
                              ? new Date(
                                  selectedDropout.dateOfReporting
                                ).toLocaleDateString()
                              : "N/A"}
                          </p>
                        </div>
                        <div>
                          <Label className="font-semibold">Reported By</Label>
                          <p>{selectedDropout.reportedBy}</p>
                        </div>
                      </div>
                    </div>

                    {/* Dropout Details */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold border-b pb-2">
                        Dropout Details
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="font-semibold">
                            Year of Dropout
                          </Label>
                          <p>{selectedDropout.yearOfDropout}</p>
                        </div>
                        <div>
                          <Label className="font-semibold">
                            Education Level When Dropout
                          </Label>
                          <p>
                            {selectedDropout.educationLevelWhenDropout || "N/A"}
                          </p>
                        </div>
                        <div>
                          <Label className="font-semibold">
                            School Name When Dropout
                          </Label>
                          <p>
                            {selectedDropout.schoolNameWhenDropout || "N/A"}
                          </p>
                        </div>
                        <div>
                          <Label className="font-semibold">
                            School Name at Enrolment
                          </Label>
                          <p>
                            {selectedDropout.schoolNameAtEnrolment || "N/A"}
                          </p>
                        </div>
                        <div>
                          <Label className="font-semibold">
                            Enrolment Date
                          </Label>
                          <p>
                            {selectedDropout.enrolmentDate
                              ? new Date(
                                  selectedDropout.enrolmentDate
                                ).toLocaleDateString()
                              : "N/A"}
                          </p>
                        </div>
                      </div>
                      {selectedDropout.reasonForDropout && (
                        <div>
                          <Label className="font-semibold">
                            Reason for Dropout
                          </Label>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {selectedDropout.reasonForDropout}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Documents */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold border-b pb-2">
                        Documents Check
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="font-semibold">
                            Birth Certificate
                          </Label>
                          <Badge
                            variant={
                              selectedDropout.documentsCheck?.birthCertificate
                                ? "default"
                                : "secondary"
                            }
                          >
                            {selectedDropout.documentsCheck?.birthCertificate
                              ? "Available"
                              : "Not Available"}
                          </Badge>
                        </div>
                        <div>
                          <Label className="font-semibold">Polio Card</Label>
                          <Badge
                            variant={
                              selectedDropout.documentsCheck?.polioCard
                                ? "default"
                                : "secondary"
                            }
                          >
                            {selectedDropout.documentsCheck?.polioCard
                              ? "Available"
                              : "Not Available"}
                          </Badge>
                        </div>
                        <div>
                          <Label className="font-semibold">Adhar Card</Label>
                          <Badge
                            variant={
                              selectedDropout.documentsCheck?.adharCard
                                ? "default"
                                : "secondary"
                            }
                          >
                            {selectedDropout.documentsCheck?.adharCard
                              ? "Available"
                              : "Not Available"}
                          </Badge>
                        </div>
                        <div>
                          <Label className="font-semibold">
                            Transfer Certificate
                          </Label>
                          <Badge
                            variant={
                              selectedDropout.documentsCheck
                                ?.transferCertificate
                                ? "default"
                                : "secondary"
                            }
                          >
                            {selectedDropout.documentsCheck?.transferCertificate
                              ? "Available"
                              : "Not Available"}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Assessment & Counseling */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold border-b pb-2">
                        Assessment & Counseling
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="font-semibold">
                            Date of Educational Assessment
                          </Label>
                          <p>
                            {selectedDropout.dateOfEducationalAssessment
                              ? new Date(
                                  selectedDropout.dateOfEducationalAssessment
                                ).toLocaleDateString()
                              : "N/A"}
                          </p>
                        </div>
                        <div>
                          <Label className="font-semibold">
                            Date of Career Counselling
                          </Label>
                          <p>
                            {selectedDropout.dateOfCareerCounselling
                              ? new Date(
                                  selectedDropout.dateOfCareerCounselling
                                ).toLocaleDateString()
                              : "N/A"}
                          </p>
                        </div>
                      </div>
                      {selectedDropout.educationalScreeningResults && (
                        <div>
                          <Label className="font-semibold">
                            Educational Screening Results
                          </Label>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {selectedDropout.educationalScreeningResults}
                          </p>
                        </div>
                      )}
                      {selectedDropout.counselingReport && (
                        <div>
                          <Label className="font-semibold">
                            Counseling Report
                          </Label>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {selectedDropout.counselingReport}
                          </p>
                        </div>
                      )}
                      {selectedDropout.individualCarePlan && (
                        <div>
                          <Label className="font-semibold">
                            Individual Care Plan
                          </Label>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {selectedDropout.individualCarePlan}
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

export default Dropouts;



