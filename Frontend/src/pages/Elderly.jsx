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
import { elderlyAPI } from "../services/api";
import Sidebar from "../components/Sidebar";

const Elderly = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [elderly, setElderly] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    gender: "",
    wardNo: "",
    habitation: "",
    statusOfBankAccount: "",
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const [selectedElderly, setSelectedElderly] = useState(null);
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
    nameOfLocalSelfGovernment: "",
    dateOfReporting: "",
    reportedBy: "",
    dateOfMedicalScreening: "",
    medicalScreeningResults: "",
    dateOfPsychologicalAssessment: "",
    psychologicalScreeningResults: "",
    statusOfBankAccount: "",
    individualCarePlan: "",
    progressReporting: {},
  });

  // Fetch elderly records
  const fetchElderly = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        search: searchTerm,
        ...filters,
      };

      const response = await elderlyAPI.getAll(params);
      setElderly(response.data.elderly);
      setPagination(response.data.pagination);
    } catch (error) {
      toast.error("Failed to fetch elderly records");
      console.error("Error fetching elderly records:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchElderly();
  }, [pagination.page, pagination.limit, searchTerm, filters]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedElderly) {
        await elderlyAPI.update(selectedElderly._id, formData);
        toast.success("Elderly record updated successfully");
        setIsEditModalOpen(false);
      } else {
        await elderlyAPI.create(formData);
        toast.success("Elderly record created successfully");
        setIsCreateModalOpen(false);
      }
      fetchElderly();
      resetForm();
    } catch (error) {
      toast.error(
        selectedElderly
          ? "Failed to update elderly record"
          : "Failed to create elderly record"
      );
      console.error("Error submitting form:", error);
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    try {
      await elderlyAPI.delete(id);
      toast.success("Elderly record deleted successfully");
      fetchElderly();
    } catch (error) {
      toast.error("Failed to delete elderly record");
      console.error("Error deleting elderly record:", error);
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
      nameOfLocalSelfGovernment: "",
      dateOfReporting: "",
      reportedBy: "",
      dateOfMedicalScreening: "",
      medicalScreeningResults: "",
      dateOfPsychologicalAssessment: "",
      psychologicalScreeningResults: "",
      statusOfBankAccount: "",
      individualCarePlan: "",
      progressReporting: {},
    });
    setSelectedElderly(null);
  };

  // Handle edit
  const handleEdit = (elderlyRecord) => {
    setSelectedElderly(elderlyRecord);
    setFormData({
      householdCode: elderlyRecord.householdCode || "",
      name: elderlyRecord.name || "",
      uniqueId: elderlyRecord.uniqueId || "",
      gender: elderlyRecord.gender || "",
      age: elderlyRecord.age || "",
      contactNo: elderlyRecord.contactNo || "",
      headOfHousehold: elderlyRecord.headOfHousehold || "",
      wardNo: elderlyRecord.wardNo || "",
      habitation: elderlyRecord.habitation || "",
      projectResponsible: elderlyRecord.projectResponsible || "",
      nameOfLocalSelfGovernment: elderlyRecord.nameOfLocalSelfGovernment || "",
      dateOfReporting: elderlyRecord.dateOfReporting
        ? new Date(elderlyRecord.dateOfReporting).toISOString().split("T")[0]
        : "",
      reportedBy: elderlyRecord.reportedBy || "",
      dateOfMedicalScreening: elderlyRecord.dateOfMedicalScreening
        ? new Date(elderlyRecord.dateOfMedicalScreening)
            .toISOString()
            .split("T")[0]
        : "",
      medicalScreeningResults: elderlyRecord.medicalScreeningResults || "",
      dateOfPsychologicalAssessment: elderlyRecord.dateOfPsychologicalAssessment
        ? new Date(elderlyRecord.dateOfPsychologicalAssessment)
            .toISOString()
            .split("T")[0]
        : "",
      psychologicalScreeningResults:
        elderlyRecord.psychologicalScreeningResults || "",
      statusOfBankAccount: elderlyRecord.statusOfBankAccount || "",
      individualCarePlan: elderlyRecord.individualCarePlan || "",
      progressReporting: elderlyRecord.progressReporting || {},
    });
    setIsEditModalOpen(true);
  };

  // Handle view
  const handleView = (elderlyRecord) => {
    setSelectedElderly(elderlyRecord);
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
      wardNo: "",
      habitation: "",
      statusOfBankAccount: "",
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
                <Users className="h-6 w-6 text-blue-600" />
                <h1 className="text-2xl font-bold text-foreground">
                  Elderly Care
                </h1>
              </div>
            </div>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Elderly Record
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
                    placeholder="Search elderly records..."
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
                  {/* <Label htmlFor="wardNo">Ward No</Label>
                  <Input
                    id="wardNo"
                    placeholder="Filter by ward"
                    value={filters.wardNo}
                    onChange={(e) => handleFilterChange("wardNo", e.target.value)}
                  /> */}
                </div>
                <div>
                  {/* <Label htmlFor="habitation">Habitation</Label>
                  <Input
                    id="habitation"
                    placeholder="Filter by habitation"
                    value={filters.habitation}
                    onChange={(e) => handleFilterChange("habitation", e.target.value)}
                  /> */}
                </div>
                <div>
                  {/* <Label htmlFor="statusOfBankAccount">Bank Account</Label>
                  <Select value={filters.statusOfBankAccount} onValueChange={(value) => handleFilterChange("statusOfBankAccount", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="Available">Available</SelectItem>
                      <SelectItem value="Not Available">Not Available</SelectItem>
                      <SelectItem value="In Process">In Process</SelectItem>
                      <SelectItem value="Blocked">Blocked</SelectItem>
                    </SelectContent>
                  </Select> */}
                </div>
                <div className="flex items-end">
                  {/* <Button variant="outline" onClick={clearFilters} className="w-full">
                    Clear Filters
                  </Button> */}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Elderly Records Table */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>
                  Elderly Records ({pagination.totalItems || 0})
                </CardTitle>
                <Button
                  variant="outline"
                  onClick={fetchElderly}
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
                      <TableHead>Unique ID</TableHead>
                      <TableHead>Age</TableHead>
                      <TableHead>Gender</TableHead>
                      <TableHead>Ward/Habitation</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Bank Account</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-4">
                          <RefreshCw className="h-4 w-4 animate-spin mx-auto" />
                        </TableCell>
                      </TableRow>
                    ) : elderly.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={8}
                          className="text-center py-4 text-muted-foreground"
                        >
                          No elderly records found
                        </TableCell>
                      </TableRow>
                    ) : (
                      elderly.map((elderlyRecord) => (
                        <TableRow key={elderlyRecord._id}>
                          <TableCell className="font-medium">
                            {elderlyRecord.name}
                          </TableCell>
                          <TableCell>{elderlyRecord.uniqueId}</TableCell>
                          <TableCell>{elderlyRecord.age}</TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {elderlyRecord.gender}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            Ward {elderlyRecord.wardNo},{" "}
                            {elderlyRecord.habitation}
                          </TableCell>
                          <TableCell>{elderlyRecord.contactNo}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                elderlyRecord.statusOfBankAccount ===
                                "Available"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {elderlyRecord.statusOfBankAccount}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleView(elderlyRecord)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEdit(elderlyRecord)}
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
                                      Delete Elderly Record
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
                                      onClick={() =>
                                        handleDelete(elderlyRecord._id)
                                      }
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
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Elderly Record</DialogTitle>
            <DialogDescription>
              Fill in the details for the new elderly record.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="householdCode">Household Code *</Label>
                <Input
                  id="householdCode"
                  name="householdCode"
                  value={formData.householdCode}
                  onChange={handleInputChange}
                  placeholder="Unique household code"
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
                  placeholder="Full name"
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
                  placeholder="Unique identification number"
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
                  min="60"
                  max="120"
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
                  placeholder="10-digit mobile number"
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
                  placeholder="Name of household head"
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
                  placeholder="Habitation name"
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
                  placeholder="Person responsible for project"
                  required
                />
              </div>
              <div>
                <Label htmlFor="nameOfLocalSelfGovernment">
                  Name of Local Self Government *
                </Label>
                <Input
                  id="nameOfLocalSelfGovernment"
                  name="nameOfLocalSelfGovernment"
                  value={formData.nameOfLocalSelfGovernment}
                  onChange={handleInputChange}
                  placeholder="Local self government name"
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
                  placeholder="Name of person reporting"
                  required
                />
              </div>
              <div>
                <Label htmlFor="dateOfMedicalScreening">
                  Date of Medical Screening
                </Label>
                <Input
                  id="dateOfMedicalScreening"
                  name="dateOfMedicalScreening"
                  type="date"
                  value={formData.dateOfMedicalScreening}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="dateOfPsychologicalAssessment">
                  Date of Psychological Assessment
                </Label>
                <Input
                  id="dateOfPsychologicalAssessment"
                  name="dateOfPsychologicalAssessment"
                  type="date"
                  value={formData.dateOfPsychologicalAssessment}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="statusOfBankAccount">Bank Account Status</Label>
                <Select
                  value={formData.statusOfBankAccount}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      statusOfBankAccount: value,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Available">Available</SelectItem>
                    <SelectItem value="Not Available">Not Available</SelectItem>
                    <SelectItem value="In Process">In Process</SelectItem>
                    <SelectItem value="Blocked">Blocked</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="medicalScreeningResults">
                Medical Screening Results
              </Label>
              <Textarea
                id="medicalScreeningResults"
                name="medicalScreeningResults"
                value={formData.medicalScreeningResults}
                onChange={handleInputChange}
                placeholder="Medical screening findings"
              />
            </div>
            <div>
              <Label htmlFor="psychologicalScreeningResults">
                Psychological Screening Results
              </Label>
              <Textarea
                id="psychologicalScreeningResults"
                name="psychologicalScreeningResults"
                value={formData.psychologicalScreeningResults}
                onChange={handleInputChange}
                placeholder="Psychological assessment findings"
              />
            </div>
            <div>
              <Label htmlFor="individualCarePlan">Individual Care Plan</Label>
              <Textarea
                id="individualCarePlan"
                name="individualCarePlan"
                value={formData.individualCarePlan}
                onChange={handleInputChange}
                placeholder="Personalized care plan details"
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
              <Button type="submit">Create Elderly Record</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Elderly Record</DialogTitle>
            <DialogDescription>
              Update the elderly record details.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-householdCode">Household Code *</Label>
                <Input
                  id="edit-householdCode"
                  name="householdCode"
                  value={formData.householdCode}
                  onChange={handleInputChange}
                  placeholder="Unique household code"
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-name">Name *</Label>
                <Input
                  id="edit-name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Full name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-uniqueId">Unique ID *</Label>
                <Input
                  id="edit-uniqueId"
                  name="uniqueId"
                  value={formData.uniqueId}
                  onChange={handleInputChange}
                  placeholder="Unique identification number"
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-gender">Gender *</Label>
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
                <Label htmlFor="edit-age">Age *</Label>
                <Input
                  id="edit-age"
                  name="age"
                  type="number"
                  min="60"
                  max="120"
                  value={formData.age}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-contactNo">Contact Number *</Label>
                <Input
                  id="edit-contactNo"
                  name="contactNo"
                  value={formData.contactNo}
                  onChange={handleInputChange}
                  placeholder="10-digit mobile number"
                  pattern="[6-9][0-9]{9}"
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-headOfHousehold">
                  Head of Household *
                </Label>
                <Input
                  id="edit-headOfHousehold"
                  name="headOfHousehold"
                  value={formData.headOfHousehold}
                  onChange={handleInputChange}
                  placeholder="Name of household head"
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-wardNo">Ward No *</Label>
                <Select
                  value={formData.wardNo}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, wardNo: value }))
                  }
                >
                  <SelectTrigger id="edit-wardNo">
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
                <Label htmlFor="edit-habitation">Habitation *</Label>
                <Input
                  id="edit-habitation"
                  name="habitation"
                  value={formData.habitation}
                  onChange={handleInputChange}
                  placeholder="Habitation name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-projectResponsible">
                  Project Responsible *
                </Label>
                <Input
                  id="edit-projectResponsible"
                  name="projectResponsible"
                  value={formData.projectResponsible}
                  onChange={handleInputChange}
                  placeholder="Person responsible for project"
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-nameOfLocalSelfGovernment">
                  Name of Local Self Government *
                </Label>
                <Input
                  id="edit-nameOfLocalSelfGovernment"
                  name="nameOfLocalSelfGovernment"
                  value={formData.nameOfLocalSelfGovernment}
                  onChange={handleInputChange}
                  placeholder="Local self government name"
                  required
                />
              </div>
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
                  placeholder="Name of person reporting"
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-dateOfMedicalScreening">
                  Date of Medical Screening
                </Label>
                <Input
                  id="edit-dateOfMedicalScreening"
                  name="dateOfMedicalScreening"
                  type="date"
                  value={formData.dateOfMedicalScreening}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="edit-dateOfPsychologicalAssessment">
                  Date of Psychological Assessment
                </Label>
                <Input
                  id="edit-dateOfPsychologicalAssessment"
                  name="dateOfPsychologicalAssessment"
                  type="date"
                  value={formData.dateOfPsychologicalAssessment}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="edit-statusOfBankAccount">
                  Bank Account Status
                </Label>
                <Select
                  value={formData.statusOfBankAccount}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      statusOfBankAccount: value,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Available">Available</SelectItem>
                    <SelectItem value="Not Available">Not Available</SelectItem>
                    <SelectItem value="In Process">In Process</SelectItem>
                    <SelectItem value="Blocked">Blocked</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="edit-medicalScreeningResults">
                Medical Screening Results
              </Label>
              <Textarea
                id="edit-medicalScreeningResults"
                name="medicalScreeningResults"
                value={formData.medicalScreeningResults}
                onChange={handleInputChange}
                placeholder="Medical screening findings"
              />
            </div>
            <div>
              <Label htmlFor="edit-psychologicalScreeningResults">
                Psychological Screening Results
              </Label>
              <Textarea
                id="edit-psychologicalScreeningResults"
                name="psychologicalScreeningResults"
                value={formData.psychologicalScreeningResults}
                onChange={handleInputChange}
                placeholder="Psychological assessment findings"
              />
            </div>
            <div>
              <Label htmlFor="edit-individualCarePlan">
                Individual Care Plan
              </Label>
              <Textarea
                id="edit-individualCarePlan"
                name="individualCarePlan"
                value={formData.individualCarePlan}
                onChange={handleInputChange}
                placeholder="Personalized care plan details"
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Update Elderly Record</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Elderly Record Details</DialogTitle>
          </DialogHeader>
          {selectedElderly && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="font-semibold">Name</Label>
                  <p>{selectedElderly.name}</p>
                </div>
                <div>
                  <Label className="font-semibold">Unique ID</Label>
                  <p>{selectedElderly.uniqueId}</p>
                </div>
                <div>
                  <Label className="font-semibold">Household Code</Label>
                  <p>{selectedElderly.householdCode}</p>
                </div>
                <div>
                  <Label className="font-semibold">Age</Label>
                  <p>{selectedElderly.age} years</p>
                </div>
                <div>
                  <Label className="font-semibold">Gender</Label>
                  <Badge variant="outline">{selectedElderly.gender}</Badge>
                </div>
                <div>
                  <Label className="font-semibold">Contact Number</Label>
                  <p>{selectedElderly.contactNo}</p>
                </div>
                <div>
                  <Label className="font-semibold">Head of Household</Label>
                  <p>{selectedElderly.headOfHousehold}</p>
                </div>
                <div>
                  <Label className="font-semibold">Ward No</Label>
                  <p>{selectedElderly.wardNo}</p>
                </div>
                <div>
                  <Label className="font-semibold">Habitation</Label>
                  <p>{selectedElderly.habitation}</p>
                </div>
                <div>
                  <Label className="font-semibold">Project Responsible</Label>
                  <p>{selectedElderly.projectResponsible}</p>
                </div>
                <div>
                  <Label className="font-semibold">
                    Name of Local Self Government
                  </Label>
                  <p>{selectedElderly.nameOfLocalSelfGovernment}</p>
                </div>
                <div>
                  <Label className="font-semibold">Date of Reporting</Label>
                  <p>
                    {new Date(
                      selectedElderly.dateOfReporting
                    ).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <Label className="font-semibold">Reported By</Label>
                  <p>{selectedElderly.reportedBy}</p>
                </div>
                <div>
                  <Label className="font-semibold">Bank Account Status</Label>
                  <Badge
                    variant={
                      selectedElderly.statusOfBankAccount === "Available"
                        ? "default"
                        : "secondary"
                    }
                  >
                    {selectedElderly.statusOfBankAccount}
                  </Badge>
                </div>
                {selectedElderly.dateOfMedicalScreening && (
                  <div>
                    <Label className="font-semibold">
                      Medical Screening Date
                    </Label>
                    <p>
                      {new Date(
                        selectedElderly.dateOfMedicalScreening
                      ).toLocaleDateString()}
                    </p>
                  </div>
                )}
                {selectedElderly.dateOfPsychologicalAssessment && (
                  <div>
                    <Label className="font-semibold">
                      Psychological Assessment Date
                    </Label>
                    <p>
                      {new Date(
                        selectedElderly.dateOfPsychologicalAssessment
                      ).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
              {selectedElderly.medicalScreeningResults && (
                <div>
                  <Label className="font-semibold">
                    Medical Screening Results
                  </Label>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {selectedElderly.medicalScreeningResults}
                  </p>
                </div>
              )}
              {selectedElderly.psychologicalScreeningResults && (
                <div>
                  <Label className="font-semibold">
                    Psychological Screening Results
                  </Label>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {selectedElderly.psychologicalScreeningResults}
                  </p>
                </div>
              )}
              {selectedElderly.individualCarePlan && (
                <div>
                  <Label className="font-semibold">Individual Care Plan</Label>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {selectedElderly.individualCarePlan}
                  </p>
                </div>
              )}
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

export default Elderly;
