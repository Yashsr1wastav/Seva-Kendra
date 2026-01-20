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
import {
  Users,
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
import { adolescentsAPI } from "../services/api";
import Sidebar from "../components/Sidebar";
import AddFollowUpButton from "../components/AddFollowUpButton";

const Adolescents = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adolescents, setAdolescents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    gender: "",
    ageGroup: "",
    wardNo: "",
    habitation: "",
    educationStatus: "",
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    householdCode: "",
    name: "",
    uniqueId: "",
    gender: "",
    age: "",
    contactNo: "",
    headOfHousehold: "",
    wardNo: "",
    habitation: "",
    projectResponsible: "",
    dateOfReporting: "",
    reportedBy: "",
    educationStatus: "",
    currentClass: "",
    schoolName: "",
    dateOfHealthScreening: "",
    heightCm: "",
    weightKg: "",
    bmi: "",
    nutritionalStatus: "",
    vocationalSkills: "",
    socialIssues: "",
    progressReporting: {},
  });

  // Fetch adolescents records
  const fetchAdolescents = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        search: searchTerm,
        ...filters,
      };

      const response = await adolescentsAPI.getAll(params);
      setAdolescents(response.data.adolescents);
      setPagination(response.data.pagination);
    } catch (error) {
      toast.error("Failed to fetch adolescents records");
      console.error("Error fetching adolescents records:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdolescents();
  }, [pagination.page, pagination.limit, searchTerm, filters]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedRecord) {
        await adolescentsAPI.update(selectedRecord._id, formData);
        toast.success("Adolescent record updated successfully");
        setIsEditModalOpen(false);
      } else {
        await adolescentsAPI.create(formData);
        toast.success("Adolescent record created successfully");
        setIsCreateModalOpen(false);
      }
      fetchAdolescents();
      resetForm();
    } catch (error) {
      toast.error(
        selectedRecord ? "Failed to update record" : "Failed to create record"
      );
      console.error("Error submitting form:", error);
    }
  };

  // Handle update
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await adolescentsAPI.update(selectedRecord._id, formData);
      toast.success("Adolescent record updated successfully");
      setIsEditModalOpen(false);
      fetchAdolescents();
      resetForm();
    } catch (error) {
      toast.error("Failed to update record");
      console.error("Error updating record:", error);
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    try {
      await adolescentsAPI.delete(id);
      toast.success("Adolescent record deleted successfully");
      fetchAdolescents();
    } catch (error) {
      toast.error("Failed to delete record");
      console.error("Error deleting record:", error);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      householdCode: "",
      name: "",
      uniqueId: "",
      gender: "",
      age: "",
      contactNo: "",
      headOfHousehold: "",
      wardNo: "",
      habitation: "",
      projectResponsible: "",
      dateOfReporting: "",
      reportedBy: "",
      educationStatus: "",
      currentClass: "",
      schoolName: "",
      dateOfHealthScreening: "",
      heightCm: "",
      weightKg: "",
      bmi: "",
      nutritionalStatus: "",
      vocationalSkills: "",
      socialIssues: "",
      progressReporting: {},
    });
    setSelectedRecord(null);
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
  };

  // Handle edit
  const handleEdit = (record) => {
    setSelectedRecord(record);
    const editData = {
      householdCode: record.householdCode || "",
      name: record.name || "",
      uniqueId: record.uniqueId || "",
      gender: record.gender || "",
      age: record.age || "",
      contactNo: record.contactNo || "",
      headOfHousehold: record.headOfHousehold || "",
      wardNo: record.wardNo || "",
      habitation: record.habitation || "",
      projectResponsible: record.projectResponsible || "",
      dateOfReporting: record.dateOfReporting
        ? new Date(record.dateOfReporting).toISOString().split("T")[0]
        : "",
      reportedBy: record.reportedBy || "",
      educationStatus: record.educationStatus || "",
      currentClass: record.currentClass || "",
      schoolName: record.schoolName || "",
      dateOfHealthScreening: record.dateOfHealthScreening
        ? new Date(record.dateOfHealthScreening).toISOString().split("T")[0]
        : "",
      heightCm: record.heightCm || "",
      weightKg: record.weightKg || "",
      bmi: record.bmi || "",
      nutritionalStatus: record.nutritionalStatus || "",
      vocationalSkills: record.vocationalSkills || "",
      socialIssues: record.socialIssues || "",
      progressReporting: record.progressReporting || {},
    };
    // Only include optional enum fields if they have values
    if (record.menstrualHygiene)
      editData.menstrualHygiene = record.menstrualHygiene;
    if (record.reproductiveHealthEducation)
      editData.reproductiveHealthEducation = record.reproductiveHealthEducation;
    if (record.mentalHealthScreening)
      editData.mentalHealthScreening = record.mentalHealthScreening;
    if (record.counselingProvided)
      editData.counselingProvided = record.counselingProvided;
    if (record.lifeSkillsTraining)
      editData.lifeSkillsTraining = record.lifeSkillsTraining;
    if (record.peerEducatorRole)
      editData.peerEducatorRole = record.peerEducatorRole;
    if (record.substanceUse) editData.substanceUse = record.substanceUse;
    setFormData(editData);
    setIsEditModalOpen(true);
  };

  // Handle view
  const handleView = (record) => {
    setSelectedRecord(record);
    setIsViewModalOpen(true);
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle filter change
  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({
      gender: "",
      ageGroup: "",
      wardNo: "",
      habitation: "",
      educationStatus: "",
    });
    setSearchTerm("");
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-background shadow-sm border-b border-border">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden"
              >
                <Menu className="h-6 w-6" />
              </Button>
              <div className="flex items-center space-x-2">
                <Users className="h-6 w-6 text-purple-600" />
                <h1 className="text-2xl font-bold text-foreground">
                  Adolescents
                </h1>
              </div>
            </div>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Adolescent Record
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-6">
          {/* Filters */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Filter className="h-5 w-5" />
                <span>Filters</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                <div>
                  <Label htmlFor="search">Search</Label>
                  <Input
                    id="search"
                    placeholder="Search records..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div>
                  {/* <Label htmlFor="gender">Gender</Label>
                  <Select value={filters.gender} onValueChange={(value) => handleFilterChange("gender", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Genders" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Genders</SelectItem>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select> */}
                </div>
                <div>
                  {/* <Label htmlFor="ageGroup">Age Group</Label>
                  <Select value={filters.ageGroup} onValueChange={(value) => handleFilterChange("ageGroup", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Ages" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Ages</SelectItem>
                      <SelectItem value="10-12">10-12 years</SelectItem>
                      <SelectItem value="13-15">13-15 years</SelectItem>
                      <SelectItem value="16-19">16-19 years</SelectItem>
                    </SelectContent>
                  </Select> */}
                </div>
                <div>
                  {/* <Label htmlFor="educationStatus">Education Status</Label>
                  <Select value={filters.educationStatus} onValueChange={(value) => handleFilterChange("educationStatus", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="In School">In School</SelectItem>
                      <SelectItem value="Dropped Out">Dropped Out</SelectItem>
                      <SelectItem value="Never Enrolled">Never Enrolled</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                    </SelectContent>
                  </Select> */}
                </div>
                <div>
                  {/* <Label htmlFor="wardNo">Ward No</Label>
                  <Input
                    id="wardNo"
                    placeholder="Filter by ward"
                    value={filters.wardNo}
                    onChange={(e) => handleFilterChange("wardNo", e.target.value)}
                  /> */}
                </div>
                <div className="flex items-end">
                  {/* <Button variant="outline" onClick={clearFilters} className="w-full">
                    Clear Filters
                  </Button> */}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Records Table */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>
                  Adolescent Records ({pagination.totalItems || 0})
                </CardTitle>
                <Button
                  variant="outline"
                  onClick={fetchAdolescents}
                  disabled={loading}
                >
                  <RefreshCw
                    className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
                  />
                  Refresh
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Age/Gender</TableHead>
                      <TableHead>Education</TableHead>
                      <TableHead>Health Status</TableHead>
                      <TableHead>Ward/Habitation</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-4">
                          <RefreshCw className="h-4 w-4 animate-spin mx-auto" />
                        </TableCell>
                      </TableRow>
                    ) : adolescents.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={7}
                          className="text-center py-4 text-muted-foreground"
                        >
                          No adolescent records found
                        </TableCell>
                      </TableRow>
                    ) : (
                      adolescents.map((record) => (
                        <TableRow key={record._id}>
                          <TableCell className="font-medium">
                            {record.name}
                          </TableCell>
                          <TableCell>
                            {record.age}, {record.gender}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                record.educationStatus === "In School"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {record.educationStatus}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                record.healthStatus === "Healthy"
                                  ? "default"
                                  : record.healthStatus === "At Risk"
                                  ? "destructive"
                                  : "secondary"
                              }
                            >
                              {record.healthStatus}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            Ward {record.wardNo}, {record.habitation}
                          </TableCell>
                          <TableCell>{record.contactNo}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleView(record)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEdit(record)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Delete Record
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure? This action cannot be
                                      undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDelete(record._id)}
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-muted-foreground">
                    Showing{" "}
                    {(pagination.currentPage - 1) * pagination.itemsPerPage + 1}{" "}
                    to{" "}
                    {Math.min(
                      pagination.currentPage * pagination.itemsPerPage,
                      pagination.totalItems
                    )}{" "}
                    of {pagination.totalItems} entries
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setPagination((prev) => ({
                          ...prev,
                          page: prev.page - 1,
                        }))
                      }
                      disabled={!pagination.hasPrevPage}
                    >
                      Previous
                    </Button>
                    <span className="text-sm">
                      Page {pagination.currentPage} of {pagination.totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setPagination((prev) => ({
                          ...prev,
                          page: prev.page + 1,
                        }))
                      }
                      disabled={!pagination.hasNextPage}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>

      {/* Create Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Adolescent Record</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="householdCode">Household Code *</Label>
                <Input
                  id="householdCode"
                  name="householdCode"
                  value={formData.householdCode}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="uniqueId">Unique ID *</Label>
                <Input
                  id="uniqueId"
                  name="uniqueId"
                  value={formData.uniqueId}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="gender">Gender *</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, gender: value }))
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
                  name="age"
                  type="number"
                  min="10"
                  max="19"
                  value={formData.age}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="contactNo">Contact Number *</Label>
                <Input
                  id="contactNo"
                  name="contactNo"
                  value={formData.contactNo}
                  onChange={handleInputChange}
                  pattern="[6-9][0-9]{9}"
                  required
                />
              </div>
              <div>
                <Label htmlFor="headOfHousehold">Head of Household *</Label>
                <Input
                  id="headOfHousehold"
                  name="headOfHousehold"
                  value={formData.headOfHousehold}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="wardNo">Ward No *</Label>
                <Select
                  value={formData.wardNo}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, wardNo: value }))
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
                  name="habitation"
                  value={formData.habitation}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="projectResponsible">
                  Project Responsible *
                </Label>
                <Input
                  id="projectResponsible"
                  name="projectResponsible"
                  value={formData.projectResponsible}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="dateOfReporting">Date of Reporting *</Label>
                <Input
                  id="dateOfReporting"
                  name="dateOfReporting"
                  type="date"
                  value={formData.dateOfReporting}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="reportedBy">Reported By *</Label>
                <Input
                  id="reportedBy"
                  name="reportedBy"
                  value={formData.reportedBy}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="educationStatus">Education Status</Label>
                <Select
                  value={formData.educationStatus}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, educationStatus: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="In School">In School</SelectItem>
                    <SelectItem value="Dropped Out">Dropped Out</SelectItem>
                    <SelectItem value="Never Enrolled">
                      Never Enrolled
                    </SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="schoolName">School Name</Label>
                <Input
                  id="schoolName"
                  name="schoolName"
                  value={formData.schoolName}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="currentClass">Current Class</Label>
                <Input
                  id="currentClass"
                  name="currentClass"
                  value={formData.currentClass}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="healthStatus">Health Status</Label>
                <Select
                  value={formData.healthStatus}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, healthStatus: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Healthy">Healthy</SelectItem>
                    <SelectItem value="At Risk">At Risk</SelectItem>
                    <SelectItem value="Needs Attention">
                      Needs Attention
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="nutritionalStatus">Nutritional Status</Label>
                <Select
                  value={formData.nutritionalStatus}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      nutritionalStatus: value,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Normal">Normal</SelectItem>
                    <SelectItem value="Underweight">Underweight</SelectItem>
                    <SelectItem value="Overweight">Overweight</SelectItem>
                    <SelectItem value="Obese">Obese</SelectItem>
                    <SelectItem value="Severely Underweight">
                      Severely Underweight
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Health Assessment Section */}
              <div className="col-span-3">
                <h3 className="text-lg font-semibold mt-4 mb-2 border-b pb-2">
                  Health Assessment
                </h3>
              </div>
              <div>
                <Label htmlFor="dateOfHealthScreening">
                  Date of Health Screening
                </Label>
                <Input
                  id="dateOfHealthScreening"
                  name="dateOfHealthScreening"
                  type="date"
                  value={formData.dateOfHealthScreening}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="heightCm">Height (cm)</Label>
                <Input
                  id="heightCm"
                  name="heightCm"
                  type="number"
                  min="50"
                  max="250"
                  value={formData.heightCm}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="weightKg">Weight (kg)</Label>
                <Input
                  id="weightKg"
                  name="weightKg"
                  type="number"
                  min="10"
                  max="200"
                  value={formData.weightKg}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="bmi">BMI</Label>
                <Input
                  id="bmi"
                  name="bmi"
                  type="number"
                  min="10"
                  max="50"
                  step="0.1"
                  value={formData.bmi}
                  onChange={handleInputChange}
                />
              </div>

              {/* Sexual & Reproductive Health Section */}
              <div className="col-span-3">
                <h3 className="text-lg font-semibold mt-4 mb-2 border-b pb-2">
                  Sexual & Reproductive Health
                </h3>
              </div>
              <div>
                <Label htmlFor="menstrualHygiene">Menstrual Hygiene</Label>
                <Select
                  value={formData.menstrualHygiene || ""}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      menstrualHygiene: value,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Good">Good</SelectItem>
                    <SelectItem value="Needs Improvement">
                      Needs Improvement
                    </SelectItem>
                    <SelectItem value="Poor">Poor</SelectItem>
                    <SelectItem value="Not Applicable">
                      Not Applicable
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="reproductiveHealthEducation">
                  Reproductive Health Education
                </Label>
                <Select
                  value={formData.reproductiveHealthEducation || ""}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      reproductiveHealthEducation: value,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Provided">Provided</SelectItem>
                    <SelectItem value="Not Provided">Not Provided</SelectItem>
                    <SelectItem value="Partially Provided">
                      Partially Provided
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Mental Health Section */}
              <div className="col-span-3">
                <h3 className="text-lg font-semibold mt-4 mb-2 border-b pb-2">
                  Mental Health
                </h3>
              </div>
              <div>
                <Label htmlFor="mentalHealthScreening">
                  Mental Health Screening
                </Label>
                <Select
                  value={formData.mentalHealthScreening || ""}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      mentalHealthScreening: value,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Normal">Normal</SelectItem>
                    <SelectItem value="At Risk">At Risk</SelectItem>
                    <SelectItem value="Needs Support">Needs Support</SelectItem>
                    <SelectItem value="Under Treatment">
                      Under Treatment
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="counselingProvided">Counseling Provided</Label>
                <Select
                  value={formData.counselingProvided || ""}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      counselingProvided: value,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                    <SelectItem value="Referred">Referred</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Life Skills & Development Section */}
              <div className="col-span-3">
                <h3 className="text-lg font-semibold mt-4 mb-2 border-b pb-2">
                  Life Skills & Development
                </h3>
              </div>
              <div>
                <Label htmlFor="lifeSkillsTraining">Life Skills Training</Label>
                <Select
                  value={formData.lifeSkillsTraining || ""}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      lifeSkillsTraining: value,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Ongoing">Ongoing</SelectItem>
                    <SelectItem value="Not Started">Not Started</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="vocationalSkills">Vocational Skills</Label>
                <Input
                  id="vocationalSkills"
                  name="vocationalSkills"
                  value={formData.vocationalSkills}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="peerEducatorRole">Peer Educator Role</Label>
                <Select
                  value={formData.peerEducatorRole || ""}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      peerEducatorRole: value,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                    <SelectItem value="In Training">In Training</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Risk Factors Section */}
              <div className="col-span-3">
                <h3 className="text-lg font-semibold mt-4 mb-2 border-b pb-2">
                  Risk Factors
                </h3>
              </div>
              <div>
                <Label htmlFor="substanceUse">Substance Use</Label>
                <Select
                  value={formData.substanceUse || ""}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      substanceUse: value,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="None">None</SelectItem>
                    <SelectItem value="Tobacco">Tobacco</SelectItem>
                    <SelectItem value="Alcohol">Alcohol</SelectItem>
                    <SelectItem value="Drugs">Drugs</SelectItem>
                    <SelectItem value="Multiple Substances">
                      Multiple Substances
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="socialIssues">Social Issues</Label>
                <Input
                  id="socialIssues"
                  name="socialIssues"
                  value={formData.socialIssues}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Create Record</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Adolescent Record</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-householdCode">Household Code</Label>
                  <Input
                    id="edit-householdCode"
                    name="householdCode"
                    value={formData.householdCode}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-name">Name *</Label>
                  <Input
                    id="edit-name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit-uniqueId">Unique ID</Label>
                  <Input
                    id="edit-uniqueId"
                    name="uniqueId"
                    value={formData.uniqueId}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-gender">Gender</Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, gender: value }))
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
                  <Label htmlFor="edit-age">Age (10-19) *</Label>
                  <Input
                    id="edit-age"
                    name="age"
                    type="number"
                    min="10"
                    max="19"
                    value={formData.age}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit-contactNo">Contact Number</Label>
                  <Input
                    id="edit-contactNo"
                    name="contactNo"
                    value={formData.contactNo}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-headOfHousehold">
                    Head of Household
                  </Label>
                  <Input
                    id="edit-headOfHousehold"
                    name="headOfHousehold"
                    value={formData.headOfHousehold}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-wardNo">Ward Number</Label>
                  <Input
                    id="edit-wardNo"
                    name="wardNo"
                    value={formData.wardNo}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-habitation">Habitation</Label>
                  <Input
                    id="edit-habitation"
                    name="habitation"
                    value={formData.habitation}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-projectResponsible">
                    Project Responsible
                  </Label>
                  <Input
                    id="edit-projectResponsible"
                    name="projectResponsible"
                    value={formData.projectResponsible}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>

            {/* Education Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Education Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-educationStatus">
                    Education Status *
                  </Label>
                  <Select
                    value={formData.educationStatus}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        educationStatus: value,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="In School">In School</SelectItem>
                      <SelectItem value="Dropped Out">Dropped Out</SelectItem>
                      <SelectItem value="Never Enrolled">
                        Never Enrolled
                      </SelectItem>
                      <SelectItem value="Completed Education">
                        Completed Education
                      </SelectItem>
                      <SelectItem value="Vocational Training">
                        Vocational Training
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-currentClass">Current Class</Label>
                  <Input
                    id="edit-currentClass"
                    name="currentClass"
                    value={formData.currentClass}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-schoolName">School Name</Label>
                  <Input
                    id="edit-schoolName"
                    name="schoolName"
                    value={formData.schoolName}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>

            {/* Health Assessment */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Health Assessment</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-dateOfHealthScreening">
                    Date of Health Screening
                  </Label>
                  <Input
                    id="edit-dateOfHealthScreening"
                    name="dateOfHealthScreening"
                    type="date"
                    value={formData.dateOfHealthScreening}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-heightCm">Height (cm)</Label>
                  <Input
                    id="edit-heightCm"
                    name="heightCm"
                    type="number"
                    min="50"
                    max="250"
                    value={formData.heightCm}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-weightKg">Weight (kg)</Label>
                  <Input
                    id="edit-weightKg"
                    name="weightKg"
                    type="number"
                    min="10"
                    max="200"
                    value={formData.weightKg}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-bmi">BMI</Label>
                  <Input
                    id="edit-bmi"
                    name="bmi"
                    type="number"
                    min="10"
                    max="50"
                    step="0.1"
                    value={formData.bmi}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-nutritionalStatus">
                    Nutritional Status
                  </Label>
                  <Select
                    value={formData.nutritionalStatus}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        nutritionalStatus: value,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Normal">Normal</SelectItem>
                      <SelectItem value="Underweight">Underweight</SelectItem>
                      <SelectItem value="Overweight">Overweight</SelectItem>
                      <SelectItem value="Obese">Obese</SelectItem>
                      <SelectItem value="Severely Underweight">
                        Severely Underweight
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Sexual & Reproductive Health */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">
                Sexual & Reproductive Health
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-menstrualHygiene">
                    Menstrual Hygiene
                  </Label>
                  <Select
                    value={formData.menstrualHygiene}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        menstrualHygiene: value,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Good">Good</SelectItem>
                      <SelectItem value="Needs Improvement">
                        Needs Improvement
                      </SelectItem>
                      <SelectItem value="Poor">Poor</SelectItem>
                      <SelectItem value="Not Applicable">
                        Not Applicable
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-reproductiveHealthEducation">
                    Reproductive Health Education
                  </Label>
                  <Select
                    value={formData.reproductiveHealthEducation}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        reproductiveHealthEducation: value,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Provided">Provided</SelectItem>
                      <SelectItem value="Not Provided">Not Provided</SelectItem>
                      <SelectItem value="Partially Provided">
                        Partially Provided
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Mental Health */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Mental Health</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-mentalHealthScreening">
                    Mental Health Screening
                  </Label>
                  <Select
                    value={formData.mentalHealthScreening}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        mentalHealthScreening: value,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Normal">Normal</SelectItem>
                      <SelectItem value="At Risk">At Risk</SelectItem>
                      <SelectItem value="Needs Support">
                        Needs Support
                      </SelectItem>
                      <SelectItem value="Under Treatment">
                        Under Treatment
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-counselingProvided">
                    Counseling Provided
                  </Label>
                  <Select
                    value={formData.counselingProvided}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        counselingProvided: value,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                      <SelectItem value="Referred">Referred</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Life Skills & Development */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">
                Life Skills & Development
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-lifeSkillsTraining">
                    Life Skills Training
                  </Label>
                  <Select
                    value={formData.lifeSkillsTraining}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        lifeSkillsTraining: value,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Completed">Completed</SelectItem>
                      <SelectItem value="Ongoing">Ongoing</SelectItem>
                      <SelectItem value="Not Started">Not Started</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-vocationalSkills">
                    Vocational Skills
                  </Label>
                  <Input
                    id="edit-vocationalSkills"
                    name="vocationalSkills"
                    value={formData.vocationalSkills}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-peerEducatorRole">
                    Peer Educator Role
                  </Label>
                  <Select
                    value={formData.peerEducatorRole}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        peerEducatorRole: value,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                      <SelectItem value="In Training">In Training</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Risk Factors */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Risk Factors</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-substanceUse">Substance Use</Label>
                  <Select
                    value={formData.substanceUse}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, substanceUse: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="None">None</SelectItem>
                      <SelectItem value="Tobacco">Tobacco</SelectItem>
                      <SelectItem value="Alcohol">Alcohol</SelectItem>
                      <SelectItem value="Drugs">Drugs</SelectItem>
                      <SelectItem value="Multiple Substances">
                        Multiple Substances
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-socialIssues">Social Issues</Label>
                  <Input
                    id="edit-socialIssues"
                    name="socialIssues"
                    value={formData.socialIssues}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>

            {/* Reporting Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Reporting Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-dateOfReporting">
                    Date of Reporting *
                  </Label>
                  <Input
                    id="edit-dateOfReporting"
                    name="dateOfReporting"
                    type="date"
                    value={formData.dateOfReporting}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit-reportedBy">Reported By *</Label>
                  <Input
                    id="edit-reportedBy"
                    name="reportedBy"
                    value={formData.reportedBy}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
              <Button type="submit">Update Record</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Adolescent Record Details</DialogTitle>
          </DialogHeader>
          {selectedRecord && (
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="font-semibold">Household Code</Label>
                    <p>{selectedRecord.householdCode || "N/A"}</p>
                  </div>
                  <div>
                    <Label className="font-semibold">Name</Label>
                    <p>{selectedRecord.name}</p>
                  </div>
                  <div>
                    <Label className="font-semibold">Unique ID</Label>
                    <p>{selectedRecord.uniqueId || "N/A"}</p>
                  </div>
                  <div>
                    <Label className="font-semibold">Gender</Label>
                    <p>{selectedRecord.gender || "N/A"}</p>
                  </div>
                  <div>
                    <Label className="font-semibold">Age</Label>
                    <p>{selectedRecord.age}</p>
                  </div>
                  <div>
                    <Label className="font-semibold">Contact Number</Label>
                    <p>{selectedRecord.contactNo || "N/A"}</p>
                  </div>
                  <div>
                    <Label className="font-semibold">Head of Household</Label>
                    <p>{selectedRecord.headOfHousehold || "N/A"}</p>
                  </div>
                  <div>
                    <Label className="font-semibold">Ward Number</Label>
                    <p>{selectedRecord.wardNo || "N/A"}</p>
                  </div>
                  <div>
                    <Label className="font-semibold">Habitation</Label>
                    <p>{selectedRecord.habitation || "N/A"}</p>
                  </div>
                  <div>
                    <Label className="font-semibold">Project Responsible</Label>
                    <p>{selectedRecord.projectResponsible || "N/A"}</p>
                  </div>
                </div>
              </div>

              {/* Education Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">
                  Education Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="font-semibold">Education Status</Label>
                    <p>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {selectedRecord.educationStatus}
                      </span>
                    </p>
                  </div>
                  <div>
                    <Label className="font-semibold">Current Class</Label>
                    <p>{selectedRecord.currentClass || "N/A"}</p>
                  </div>
                  <div>
                    <Label className="font-semibold">School Name</Label>
                    <p>{selectedRecord.schoolName || "N/A"}</p>
                  </div>
                </div>
              </div>

              {/* Health Assessment */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">
                  Health Assessment
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="font-semibold">
                      Date of Health Screening
                    </Label>
                    <p>
                      {selectedRecord.dateOfHealthScreening
                        ? new Date(
                            selectedRecord.dateOfHealthScreening
                          ).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                  <div>
                    <Label className="font-semibold">Height (cm)</Label>
                    <p>{selectedRecord.heightCm || "N/A"}</p>
                  </div>
                  <div>
                    <Label className="font-semibold">Weight (kg)</Label>
                    <p>{selectedRecord.weightKg || "N/A"}</p>
                  </div>
                  <div>
                    <Label className="font-semibold">BMI</Label>
                    <p>{selectedRecord.bmi || "N/A"}</p>
                  </div>
                  <div>
                    <Label className="font-semibold">Nutritional Status</Label>
                    <p>
                      {selectedRecord.nutritionalStatus ? (
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            selectedRecord.nutritionalStatus === "Normal"
                              ? "bg-green-100 text-green-800"
                              : selectedRecord.nutritionalStatus ===
                                "Severely Underweight"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {selectedRecord.nutritionalStatus}
                        </span>
                      ) : (
                        "N/A"
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Sexual & Reproductive Health */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">
                  Sexual & Reproductive Health
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="font-semibold">Menstrual Hygiene</Label>
                    <p>
                      {selectedRecord.menstrualHygiene ? (
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            selectedRecord.menstrualHygiene === "Good"
                              ? "bg-green-100 text-green-800"
                              : selectedRecord.menstrualHygiene === "Poor"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {selectedRecord.menstrualHygiene}
                        </span>
                      ) : (
                        "N/A"
                      )}
                    </p>
                  </div>
                  <div>
                    <Label className="font-semibold">
                      Reproductive Health Education
                    </Label>
                    <p>
                      {selectedRecord.reproductiveHealthEducation ? (
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            selectedRecord.reproductiveHealthEducation ===
                            "Provided"
                              ? "bg-green-100 text-green-800"
                              : selectedRecord.reproductiveHealthEducation ===
                                "Not Provided"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {selectedRecord.reproductiveHealthEducation}
                        </span>
                      ) : (
                        "N/A"
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Mental Health */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">
                  Mental Health
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="font-semibold">
                      Mental Health Screening
                    </Label>
                    <p>
                      {selectedRecord.mentalHealthScreening ? (
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            selectedRecord.mentalHealthScreening === "Normal"
                              ? "bg-green-100 text-green-800"
                              : selectedRecord.mentalHealthScreening ===
                                "Under Treatment"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {selectedRecord.mentalHealthScreening}
                        </span>
                      ) : (
                        "N/A"
                      )}
                    </p>
                  </div>
                  <div>
                    <Label className="font-semibold">Counseling Provided</Label>
                    <p>
                      {selectedRecord.counselingProvided ? (
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            selectedRecord.counselingProvided === "Yes"
                              ? "bg-green-100 text-green-800"
                              : selectedRecord.counselingProvided === "No"
                              ? "bg-red-100 text-red-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {selectedRecord.counselingProvided}
                        </span>
                      ) : (
                        "N/A"
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Life Skills & Development */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">
                  Life Skills & Development
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="font-semibold">
                      Life Skills Training
                    </Label>
                    <p>
                      {selectedRecord.lifeSkillsTraining ? (
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            selectedRecord.lifeSkillsTraining === "Completed"
                              ? "bg-green-100 text-green-800"
                              : selectedRecord.lifeSkillsTraining === "Ongoing"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-secondary text-foreground"
                          }`}
                        >
                          {selectedRecord.lifeSkillsTraining}
                        </span>
                      ) : (
                        "N/A"
                      )}
                    </p>
                  </div>
                  <div>
                    <Label className="font-semibold">Vocational Skills</Label>
                    <p>{selectedRecord.vocationalSkills || "N/A"}</p>
                  </div>
                  <div>
                    <Label className="font-semibold">Peer Educator Role</Label>
                    <p>
                      {selectedRecord.peerEducatorRole ? (
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            selectedRecord.peerEducatorRole === "Yes"
                              ? "bg-green-100 text-green-800"
                              : selectedRecord.peerEducatorRole ===
                                "In Training"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-secondary text-foreground"
                          }`}
                        >
                          {selectedRecord.peerEducatorRole}
                        </span>
                      ) : (
                        "N/A"
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Risk Factors */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">
                  Risk Factors
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="font-semibold">Substance Use</Label>
                    <p>
                      {selectedRecord.substanceUse ? (
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            selectedRecord.substanceUse === "None"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {selectedRecord.substanceUse}
                        </span>
                      ) : (
                        "N/A"
                      )}
                    </p>
                  </div>
                  <div>
                    <Label className="font-semibold">Social Issues</Label>
                    <p>{selectedRecord.socialIssues || "N/A"}</p>
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
                    <Label className="font-semibold">Date of Reporting</Label>
                    <p>
                      {selectedRecord.dateOfReporting
                        ? new Date(
                            selectedRecord.dateOfReporting
                          ).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                  <div>
                    <Label className="font-semibold">Reported By</Label>
                    <p>{selectedRecord.reportedBy || "N/A"}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewModalOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Adolescents;
