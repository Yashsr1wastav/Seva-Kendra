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
import { Checkbox } from "@/components/ui/checkbox";
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
import {
  BookOpen,
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
} from "lucide-react";
import { competitiveExamAPI, scStudentAPI } from "../services/api";
import Sidebar from "../components/Sidebar";
import usePermissions from "../hooks/usePermissions";
import { getWardOptions } from "../lib/formOptions";
import GuidelinesCard from "../components/GuidelinesCard";

const EXAM_TYPE_OPTIONS = [
  "JEE Main",
  "JEE Advanced",
  "NEET",
  "UPSC",
  "SSC",
  "Bank PO",
  "Bank Clerk",
  "Railway",
  "Police",
  "Teaching",
  "State PSC",
  "Other",
];

const CATEGORY_SOCIAL_OPTIONS = [
  "SC",
  "ST",
  "OBC",
  "Muslim",
  "General",
  "EWS",
  "Other",
];

const SOCIAL_STATUS_ALLOWED_VALUES = ["SC", "ST", "OBC", "General", "EWS"];

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

const StudentCombobox = ({ id, value, onSelectStudent, students, loading }) => {
  const [open, setOpen] = useState(false);
  const selectedStudent = students.find((student) => student._id === value);

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
          {selectedStudent
            ? `${selectedStudent.householdCode} - ${selectedStudent.name}`
            : "Select student from SC list"}
          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-[--radix-popover-trigger-width] p-0"
      >
        <Command>
          <CommandInput
            placeholder="Search by household code or name..."
            autoFocus
            onKeyDown={(event) => event.stopPropagation()}
          />
          <CommandList
            id={`${id}-list`}
            className="max-h-64"
            onWheel={(event) => event.stopPropagation()}
          >
            <CommandEmpty>
              {loading ? "Loading SC students..." : "No SC student found."}
            </CommandEmpty>
            <CommandGroup>
              {students.map((student) => (
                <CommandItem
                  key={student._id}
                  value={`${student.householdCode || ""} ${student.name || ""}`}
                  onSelect={() => {
                    onSelectStudent(student);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === student._id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {student.householdCode} - {student.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

const ExamTypeMultiSelect = ({ id, values, onChange }) => {
  const [open, setOpen] = useState(false);
  const selectedLabels = EXAM_TYPE_OPTIONS.filter((option) =>
    values.includes(option)
  );

  const toggleValue = (value) => {
    if (values.includes(value)) {
      onChange(values.filter((item) => item !== value));
      return;
    }
    onChange([...values, value]);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="h-9 w-full justify-between bg-input px-3 text-left text-sm font-normal text-foreground"
        >
          {selectedLabels.length > 0
            ? selectedLabels.join(", ")
            : "Select exam types"}
          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-[--radix-popover-trigger-width] p-0"
      >
        <Command>
          <CommandInput
            placeholder="Search exam type..."
            autoFocus
            onKeyDown={(event) => event.stopPropagation()}
          />
          <CommandList className="max-h-64" onWheel={(event) => event.stopPropagation()}>
            <CommandEmpty>No exam type found.</CommandEmpty>
            <CommandGroup>
              {EXAM_TYPE_OPTIONS.map((option) => {
                const checked = values.includes(option);
                return (
                  <CommandItem
                    key={option}
                    value={option}
                    onSelect={() => toggleValue(option)}
                  >
                    <Checkbox
                      checked={checked}
                      className="mr-2"
                      onCheckedChange={() => toggleValue(option)}
                      onClick={(event) => event.stopPropagation()}
                    />
                    {option}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

const CompetitiveExams = () => {
  const wardOptions = getWardOptions();
  const { canCreate, canEdit, canDelete, canExport } = usePermissions();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    wardNo: "all",
    typeOfExam: "all",
    status: "all",
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const [scStudents, setScStudents] = useState([]);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    scStudentId: "",
    householdCode: "",
    name: "",
    gender: "",
    age: "",
    contactNo: "",
    headOfHousehold: "",
    wardNo: "",
    habitation: "",
    projectResponsible: "",
    socialCategory: "",
    educationalStatus: "",
    typeOfExam: [],
    status: "Preparing",
    dateOfEnrollment: "",
    enrolledBy: "",
    dateOfEducationalAssessment: "",
    educationalScreeningResults: "",
    dateOfCareerCounselling: "",
    counselingReport: "",
    individualCarePlan: "",
    applicationDate: "",
    examDate: "",
    result: "Pending",
    progressReporting: {},
  });

  // Fetch exams
  const fetchExams = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        search: searchTerm,
        ...(filters.wardNo !== "all" && { wardNo: filters.wardNo }),
        ...(filters.typeOfExam !== "all" && { typeOfExam: filters.typeOfExam }),
        ...(filters.status !== "all" && { status: filters.status }),
      };

      const response = await competitiveExamAPI.getAll(params);
      setExams(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      toast.error("Failed to fetch competitive exams");
      console.error("Error fetching competitive exams:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, [pagination.page, pagination.limit, searchTerm, filters]);

  const fetchScStudents = async () => {
    setStudentsLoading(true);
    try {
      const response = await scStudentAPI.getAll({
        page: 1,
        limit: 500,
      });
      setScStudents(response?.data?.data || []);
    } catch (error) {
      toast.error("Failed to fetch SC student list");
      console.error("Error fetching SC student list:", error);
    } finally {
      setStudentsLoading(false);
    }
  };

  useEffect(() => {
    fetchScStudents();
  }, []);

  useEffect(() => {
    if (isCreateModalOpen || isEditModalOpen) {
      fetchScStudents();
    }
  }, [isCreateModalOpen, isEditModalOpen]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { socialCategory, ...restFormData } = formData;
      const payload = {
        ...restFormData,
        category: socialCategory || "",
        socialStatus: SOCIAL_STATUS_ALLOWED_VALUES.includes(socialCategory)
          ? socialCategory
          : "",
      };

      if (selectedExam) {
        await competitiveExamAPI.update(selectedExam._id, payload);
        toast.success("Competitive exam record updated successfully");
        setIsEditModalOpen(false);
      } else {
        await competitiveExamAPI.create(payload);
        toast.success("Competitive exam record created successfully");
        setIsCreateModalOpen(false);
      }

      fetchExams();
      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    try {
      await competitiveExamAPI.delete(id);
      toast.success("Competitive exam record deleted successfully");
      fetchExams();
    } catch (error) {
      toast.error("Failed to delete competitive exam record");
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      scStudentId: "",
      householdCode: "",
      name: "",
      gender: "",
      age: "",
      contactNo: "",
      headOfHousehold: "",
      wardNo: "",
      habitation: "",
      projectResponsible: "",
      socialCategory: "",
      educationalStatus: "",
      typeOfExam: [],
      status: "Preparing",
      dateOfEnrollment: "",
      enrolledBy: "",
      dateOfEducationalAssessment: "",
      educationalScreeningResults: "",
      dateOfCareerCounselling: "",
      counselingReport: "",
      individualCarePlan: "",
      applicationDate: "",
      examDate: "",
      result: "Pending",
      progressReporting: {},
    });
    setSelectedExam(null);
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
  };

  // Open edit modal
  const openEditModal = (exam) => {
    setSelectedExam(exam);
    setFormData({
      ...exam,
      scStudentId: exam.scStudentId?._id || exam.scStudentId || "",
      socialCategory: exam.socialStatus || exam.category || "",
      typeOfExam: Array.isArray(exam.typeOfExam)
        ? exam.typeOfExam
        : exam.typeOfExam
        ? [exam.typeOfExam]
        : [],
      dateOfEnrollment: exam.dateOfEnrollment
        ? new Date(exam.dateOfEnrollment).toISOString().split("T")[0]
        : "",
      dateOfEducationalAssessment: exam.dateOfEducationalAssessment
        ? new Date(exam.dateOfEducationalAssessment).toISOString().split("T")[0]
        : "",
      dateOfCareerCounselling: exam.dateOfCareerCounselling
        ? new Date(exam.dateOfCareerCounselling).toISOString().split("T")[0]
        : "",
      applicationDate: exam.applicationDate
        ? new Date(exam.applicationDate).toISOString().split("T")[0]
        : "",
      examDate: exam.examDate
        ? new Date(exam.examDate).toISOString().split("T")[0]
        : "",
    });
    setIsEditModalOpen(true);
  };

  const handleStudentSelect = (student) => {
    setFormData((prev) => ({
      ...prev,
      scStudentId: student._id,
      householdCode: student.householdCode || prev.householdCode,
      name: student.name || prev.name,
      gender: student.gender || prev.gender,
      age: student.age?.toString() || prev.age,
      contactNo: student.contactNo || prev.contactNo,
      headOfHousehold: student.headOfHousehold || prev.headOfHousehold,
      wardNo: student.wardNo || prev.wardNo,
      habitation: student.habitation || prev.habitation,
      projectResponsible: student.projectResponsible || prev.projectResponsible,
      socialCategory: student.category || prev.socialCategory,
    }));
  };

  // Open view modal
  const openViewModal = (exam) => {
    setSelectedExam(exam);
    setIsViewModalOpen(true);
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeItem="competitive-exams"
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        {/* Mobile Header */}
        <div className="lg:hidden bg-card shadow-sm p-4 flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(true)}
            className="mr-2"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold">Competitive Exams</h1>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="container mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  Competitive Exams
                </h1>
                <p className="text-muted-foreground">
                  Manage competitive exam aspirants
                </p>
              </div>
              {canCreate("education") && (
                <Button onClick={() => setIsCreateModalOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Exam Record
                </Button>
              )}
            </div>

            <GuidelinesCard
              title="Competitive Exam Tracking Guidelines"
              description="Help aspirants navigate through various competitive exams effectively."
              items={[
                "Select all relevant exam types the student is preparing for.",
                "Track the current status (Preparing, Qualified, Not Qualified).",
                "Document enrollment dates and project-responsible staff.",
                "Record career counseling reports and individual care plans.",
                "Capture exam application dates and upcoming exam schedules.",
              ]}
            />

            {/* Search and Filters */}
            <Card>
              <CardHeader>
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
                      placeholder="Search candidates..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div>
                    <Select
                      value={filters.wardNo}
                      onValueChange={(value) =>
                        setFilters({ ...filters, wardNo: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Filter by Ward" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Wards</SelectItem>
                        {wardOptions.map((ward) => (
                          <SelectItem key={ward.value} value={ward.value}>
                            {ward.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    {/* <Select
                      value={filters.typeOfExam}
                      onValueChange={(value) =>
                        setFilters({ ...filters, typeOfExam: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Filter by Exam Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Exams</SelectItem>
                        <SelectItem value="JEE Main">JEE Main</SelectItem>
                        <SelectItem value="JEE Advanced">
                          JEE Advanced
                        </SelectItem>
                        <SelectItem value="NEET">NEET</SelectItem>
                        <SelectItem value="UPSC">UPSC</SelectItem>
                        <SelectItem value="SSC">SSC</SelectItem>
                        <SelectItem value="Bank PO">Bank PO</SelectItem>
                        <SelectItem value="Bank Clerk">Bank Clerk</SelectItem>
                        <SelectItem value="Railway">Railway</SelectItem>
                        <SelectItem value="Police">Police</SelectItem>
                        <SelectItem value="Teaching">Teaching</SelectItem>
                        <SelectItem value="State PSC">State PSC</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select> */}
                  </div>
                  <div>
                    {/* <Select
                      value={filters.status}
                      onValueChange={(value) =>
                        setFilters({ ...filters, status: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Filter by Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="Preparing">Preparing</SelectItem>
                        <SelectItem value="Appeared">Appeared</SelectItem>
                        <SelectItem value="Qualified">Qualified</SelectItem>
                        <SelectItem value="Not Qualified">
                          Not Qualified
                        </SelectItem>
                        <SelectItem value="Discontinued">
                          Discontinued
                        </SelectItem>
                      </SelectContent>
                    </Select> */}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Exams Table */}
            <Card>
              <CardHeader>
                <CardTitle>Competitive Exams ({pagination.total})</CardTitle>
                <CardDescription>
                  Manage and track all competitive exam aspirants
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
                        <TableHead>Exam Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {exams.map((exam) => (
                        <TableRow key={exam._id}>
                          <TableCell className="font-medium">
                            {exam.householdCode}
                          </TableCell>
                          <TableCell>{exam.name}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">{exam.gender}</Badge>
                          </TableCell>
                          <TableCell>{exam.age}</TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {Array.isArray(exam.typeOfExam)
                                ? exam.typeOfExam.join(", ")
                                : exam.typeOfExam}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                exam.status === "Qualified"
                                  ? "default"
                                  : exam.status === "Preparing"
                                  ? "secondary"
                                  : exam.status === "Appeared"
                                  ? "outline"
                                  : "destructive"
                              }
                            >
                              {exam.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openViewModal(exam)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              {canEdit("education") && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => openEditModal(exam)}
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
                                        permanently delete the exam record.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>
                                        Cancel
                                      </AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleDelete(exam._id)}
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
                  <DialogTitle>Add New Exam Record</DialogTitle>
                  <DialogDescription>
                    Create a new competitive exam record with all required
                    information.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <Label htmlFor="scStudentId">Select Student from SC List</Label>
                      <StudentCombobox
                        id="scStudentId"
                        value={formData.scStudentId}
                        onSelectStudent={handleStudentSelect}
                        students={scStudents}
                        loading={studentsLoading}
                      />
                    </div>
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
                      <Label htmlFor="gender">Gender *</Label>
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
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
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
                        min="0"
                        max="120"
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
                      <Label htmlFor="socialCategory">
                        Category / Social Status
                      </Label>
                      <Select
                        value={formData.socialCategory}
                        onValueChange={(value) =>
                          setFormData({ ...formData, socialCategory: value })
                        }
                      >
                        <SelectTrigger id="socialCategory">
                          <SelectValue placeholder="Select category / social status" />
                        </SelectTrigger>
                        <SelectContent>
                          {CATEGORY_SOCIAL_OPTIONS.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="typeOfExam">Type of Exam *</Label>
                      <ExamTypeMultiSelect
                        id="typeOfExam"
                        values={formData.typeOfExam}
                        onChange={(values) =>
                          setFormData({ ...formData, typeOfExam: values })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="status">Status</Label>
                      <Select
                        value={formData.status}
                        onValueChange={(value) =>
                          setFormData({ ...formData, status: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Preparing">Preparing</SelectItem>
                          <SelectItem value="Appeared">Appeared</SelectItem>
                          <SelectItem value="Qualified">Qualified</SelectItem>
                          <SelectItem value="Not Qualified">
                            Not Qualified
                          </SelectItem>
                          <SelectItem value="Discontinued">
                            Discontinued
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="dateOfEnrollment">
                        Date of Enrollment
                      </Label>
                      <Input
                        id="dateOfEnrollment"
                        type="date"
                        value={formData.dateOfEnrollment}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            dateOfEnrollment: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="enrolledBy">Enrolled By</Label>
                      <Input
                        id="enrolledBy"
                        value={formData.enrolledBy}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            enrolledBy: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="educationalStatus">
                        Educational Status
                      </Label>
                      <Input
                        id="educationalStatus"
                        value={formData.educationalStatus}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            educationalStatus: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancel
                    </Button>
                    <Button type="submit">Create Exam Record</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            {/* Edit Modal */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Edit Exam Record</DialogTitle>
                  <DialogDescription>
                    Update the competitive exam record information.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <Label htmlFor="editScStudentId">
                        Select Student from SC List
                      </Label>
                      <StudentCombobox
                        id="editScStudentId"
                        value={formData.scStudentId}
                        onSelectStudent={handleStudentSelect}
                        students={scStudents}
                        loading={studentsLoading}
                      />
                    </div>
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
                      <Label htmlFor="editGender">Gender *</Label>
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
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
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
                        min="0"
                        max="120"
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
                      <Label htmlFor="editSocialCategory">
                        Category / Social Status
                      </Label>
                      <Select
                        value={formData.socialCategory}
                        onValueChange={(value) =>
                          setFormData({ ...formData, socialCategory: value })
                        }
                      >
                        <SelectTrigger id="editSocialCategory">
                          <SelectValue placeholder="Select category / social status" />
                        </SelectTrigger>
                        <SelectContent>
                          {CATEGORY_SOCIAL_OPTIONS.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="editTypeOfExam">Type of Exam *</Label>
                      <ExamTypeMultiSelect
                        id="editTypeOfExam"
                        values={formData.typeOfExam}
                        onChange={(values) =>
                          setFormData({ ...formData, typeOfExam: values })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="editStatus">Status</Label>
                      <Select
                        value={formData.status}
                        onValueChange={(value) =>
                          setFormData({ ...formData, status: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Preparing">Preparing</SelectItem>
                          <SelectItem value="Appeared">Appeared</SelectItem>
                          <SelectItem value="Qualified">Qualified</SelectItem>
                          <SelectItem value="Not Qualified">
                            Not Qualified
                          </SelectItem>
                          <SelectItem value="Discontinued">
                            Discontinued
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="editDateOfEnrollment">
                        Date of Enrollment *
                      </Label>
                      <Input
                        id="editDateOfEnrollment"
                        type="date"
                        value={formData.dateOfEnrollment}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            dateOfEnrollment: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="editEnrolledBy">Enrolled By *</Label>
                      <Input
                        id="editEnrolledBy"
                        value={formData.enrolledBy}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            enrolledBy: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="editEducationalStatus">
                        Educational Status *
                      </Label>
                      <Input
                        id="editEducationalStatus"
                        value={formData.educationalStatus}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            educationalStatus: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>

                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancel
                    </Button>
                    <Button type="submit">Update Exam Record</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            {/* View Modal */}
            <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Exam Record Details</DialogTitle>
                  <DialogDescription>
                    View complete information about this competitive exam
                    record.
                  </DialogDescription>
                </DialogHeader>
                {selectedExam && (
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
                          <p>{selectedExam.householdCode}</p>
                        </div>
                        <div>
                          <Label className="font-semibold">Name</Label>
                          <p>{selectedExam.name}</p>
                        </div>
                        <div>
                          <Label className="font-semibold">Gender</Label>
                          <Badge variant="outline">{selectedExam.gender}</Badge>
                        </div>
                        <div>
                          <Label className="font-semibold">Age</Label>
                          <p>{selectedExam.age} years</p>
                        </div>
                        <div>
                          <Label className="font-semibold">
                            Contact Number
                          </Label>
                          <p>{selectedExam.contactNo}</p>
                        </div>
                        <div>
                          <Label className="font-semibold">
                            Head of Household
                          </Label>
                          <p>{selectedExam.headOfHousehold}</p>
                        </div>
                        <div>
                          <Label className="font-semibold">Ward No</Label>
                          <p>{selectedExam.wardNo}</p>
                        </div>
                        <div>
                          <Label className="font-semibold">Habitation</Label>
                          <p>{selectedExam.habitation}</p>
                        </div>
                        <div>
                          <Label className="font-semibold">
                            Project Responsible
                          </Label>
                          <p>{selectedExam.projectResponsible}</p>
                        </div>
                        <div>
                          <Label className="font-semibold">
                            Category / Social Status
                          </Label>
                          <p>{selectedExam.socialStatus || selectedExam.category || "N/A"}</p>
                        </div>
                        <div>
                          <Label className="font-semibold">
                            Educational Status
                          </Label>
                          <p>{selectedExam.educationalStatus}</p>
                        </div>
                      </div>
                    </div>

                    {/* Exam Details */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold border-b pb-2">
                        Exam Details
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="font-semibold">Type of Exam</Label>
                          <Badge>
                            {Array.isArray(selectedExam.typeOfExam)
                              ? selectedExam.typeOfExam.join(", ")
                              : selectedExam.typeOfExam}
                          </Badge>
                        </div>
                        <div>
                          <Label className="font-semibold">Status</Label>
                          <Badge>{selectedExam.status}</Badge>
                        </div>
                        <div>
                          <Label className="font-semibold">
                            Date of Enrollment
                          </Label>
                          <p>
                            {selectedExam.dateOfEnrollment
                              ? new Date(
                                  selectedExam.dateOfEnrollment
                                ).toLocaleDateString()
                              : "N/A"}
                          </p>
                        </div>
                        <div>
                          <Label className="font-semibold">Enrolled By</Label>
                          <p>{selectedExam.enrolledBy}</p>
                        </div>
                        <div>
                          <Label className="font-semibold">
                            Application Date
                          </Label>
                          <p>
                            {selectedExam.applicationDate
                              ? new Date(
                                  selectedExam.applicationDate
                                ).toLocaleDateString()
                              : "N/A"}
                          </p>
                        </div>
                        <div>
                          <Label className="font-semibold">Exam Date</Label>
                          <p>
                            {selectedExam.examDate
                              ? new Date(
                                  selectedExam.examDate
                                ).toLocaleDateString()
                              : "N/A"}
                          </p>
                        </div>
                        <div>
                          <Label className="font-semibold">Result</Label>
                          <Badge>{selectedExam.result}</Badge>
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
                            {selectedExam.dateOfEducationalAssessment
                              ? new Date(
                                  selectedExam.dateOfEducationalAssessment
                                ).toLocaleDateString()
                              : "N/A"}
                          </p>
                        </div>
                        <div>
                          <Label className="font-semibold">
                            Date of Career Counselling
                          </Label>
                          <p>
                            {selectedExam.dateOfCareerCounselling
                              ? new Date(
                                  selectedExam.dateOfCareerCounselling
                                ).toLocaleDateString()
                              : "N/A"}
                          </p>
                        </div>
                      </div>
                      {selectedExam.educationalScreeningResults && (
                        <div>
                          <Label className="font-semibold">
                            Educational Screening Results
                          </Label>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {selectedExam.educationalScreeningResults}
                          </p>
                        </div>
                      )}
                      {selectedExam.counselingReport && (
                        <div>
                          <Label className="font-semibold">
                            Counseling Report
                          </Label>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {selectedExam.counselingReport}
                          </p>
                        </div>
                      )}
                      {selectedExam.individualCarePlan && (
                        <div>
                          <Label className="font-semibold">
                            Individual Care Plan
                          </Label>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {selectedExam.individualCarePlan}
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

export default CompetitiveExams;



