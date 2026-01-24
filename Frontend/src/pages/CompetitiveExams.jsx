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
  BookOpen,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  RefreshCw,
  Menu,
} from "lucide-react";
import { competitiveExamAPI } from "../services/api";
import Sidebar from "../components/Sidebar";
import usePermissions from "../hooks/usePermissions";

const CompetitiveExams = () => {
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
  const [selectedExam, setSelectedExam] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
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
    socialStatus: "",
    educationalStatus: "",
    typeOfExam: "",
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

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedExam) {
        await competitiveExamAPI.update(selectedExam._id, formData);
        toast.success("Competitive exam record updated successfully");
        setIsEditModalOpen(false);
      } else {
        await competitiveExamAPI.create(formData);
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
      socialStatus: "",
      educationalStatus: "",
      typeOfExam: "",
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
                    {/* <Select
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
                        <SelectItem value="1">Ward 1</SelectItem>
                        <SelectItem value="2">Ward 2</SelectItem>
                        <SelectItem value="3">Ward 3</SelectItem>
                        <SelectItem value="4">Ward 4</SelectItem>
                        <SelectItem value="5">Ward 5</SelectItem>
                      </SelectContent>
                    </Select> */}
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
                            <Badge variant="outline">{exam.typeOfExam}</Badge>
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
                      <Label htmlFor="age">Age *</Label>
                      <Input
                        id="age"
                        type="number"
                        value={formData.age}
                        onChange={(e) =>
                          setFormData({ ...formData, age: e.target.value })
                        }
                        min="0"
                        max="120"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="contactNo">Contact Number *</Label>
                      <Input
                        id="contactNo"
                        value={formData.contactNo}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            contactNo: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="headOfHousehold">
                        Head of Household *
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
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="wardNo">Ward Number *</Label>
                      <Select
                        value={formData.wardNo}
                        onValueChange={(value) =>
                          setFormData({ ...formData, wardNo: value })
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
                      <Label htmlFor="category">Category *</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) =>
                          setFormData({ ...formData, category: value })
                        }
                        required
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
                      <Label htmlFor="socialStatus">Social Status *</Label>
                      <Select
                        value={formData.socialStatus}
                        onValueChange={(value) =>
                          setFormData({ ...formData, socialStatus: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select social status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SC">
                            SC (Scheduled Caste)
                          </SelectItem>
                          <SelectItem value="ST">
                            ST (Scheduled Tribe)
                          </SelectItem>
                          <SelectItem value="OBC">
                            OBC (Other Backward Class)
                          </SelectItem>
                          <SelectItem value="General">General</SelectItem>
                          <SelectItem value="EWS">
                            EWS (Economically Weaker Section)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="typeOfExam">Type of Exam *</Label>
                      <Select
                        value={formData.typeOfExam}
                        onValueChange={(value) =>
                          setFormData({ ...formData, typeOfExam: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select exam type" />
                        </SelectTrigger>
                        <SelectContent>
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
                      </Select>
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
                        Date of Enrollment *
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
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="enrolledBy">Enrolled By *</Label>
                      <Input
                        id="enrolledBy"
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
                      <Label htmlFor="educationalStatus">
                        Educational Status *
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
                        required
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
                      <Label htmlFor="editAge">Age *</Label>
                      <Input
                        id="editAge"
                        type="number"
                        value={formData.age}
                        onChange={(e) =>
                          setFormData({ ...formData, age: e.target.value })
                        }
                        min="0"
                        max="120"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="editContactNo">Contact Number *</Label>
                      <Input
                        id="editContactNo"
                        value={formData.contactNo}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            contactNo: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="editHeadOfHousehold">
                        Head of Household *
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
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="editWardNo">Ward Number *</Label>
                      <Input
                        id="editWardNo"
                        value={formData.wardNo}
                        onChange={(e) =>
                          setFormData({ ...formData, wardNo: e.target.value })
                        }
                        required
                      />
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
                      <Label htmlFor="editCategory">Category *</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) =>
                          setFormData({ ...formData, category: value })
                        }
                        required
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
                      <Label htmlFor="editSocialStatus">Social Status *</Label>
                      <Select
                        value={formData.socialStatus}
                        onValueChange={(value) =>
                          setFormData({ ...formData, socialStatus: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select social status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SC">
                            SC (Scheduled Caste)
                          </SelectItem>
                          <SelectItem value="ST">
                            ST (Scheduled Tribe)
                          </SelectItem>
                          <SelectItem value="OBC">
                            OBC (Other Backward Class)
                          </SelectItem>
                          <SelectItem value="General">General</SelectItem>
                          <SelectItem value="EWS">
                            EWS (Economically Weaker Section)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="editTypeOfExam">Type of Exam *</Label>
                      <Select
                        value={formData.typeOfExam}
                        onValueChange={(value) =>
                          setFormData({ ...formData, typeOfExam: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select exam type" />
                        </SelectTrigger>
                        <SelectContent>
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
                      </Select>
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
                          <Label className="font-semibold">Category</Label>
                          <p>{selectedExam.category}</p>
                        </div>
                        <div>
                          <Label className="font-semibold">Social Status</Label>
                          <p>{selectedExam.socialStatus || "N/A"}</p>
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
                          <Badge>{selectedExam.typeOfExam}</Badge>
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
