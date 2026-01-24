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
  Award,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  RefreshCw,
  Menu,
  Calendar,
  User,
  FileText,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import { entitlementsAPI } from "../services/api";
import Sidebar from "../components/Sidebar";
import usePermissions from "../hooks/usePermissions";

const Entitlements = () => {
  const { canCreate, canEdit, canDelete, canExport } = usePermissions();
  const entitlementTypes = [
    "Pension",
    "Ration Card",
    "Voter ID",
    "Aadhaar Card",
    "PAN Card",
    "Disability Certificate",
    "Caste Certificate",
    "Income Certificate",
    "Birth Certificate",
    "Death Certificate",
    "Widow Pension",
    "Old Age Pension",
    "Disability Pension",
    "Labour Card",
    "Health Insurance",
    "Education Scholarship",
    "Housing Scheme",
    "Other",
  ];

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [entitlements, setEntitlements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    status: "all",
    entitlementType: "all",
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const [selectedEntitlement, setSelectedEntitlement] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    householdCode: "",
    idCode: "",
    beneficiaryId: "",
    beneficiaryName: "",
    name: "",
    gender: "",
    age: "",
    headOfHousehold: "",
    contactNo: "",
    wardNo: "",
    habitation: "",
    projectResponsible: "",
    dateOfReporting: "",
    reportedBy: "",
    entitlementType: "",
    applicationDate: "",
    idProofAndDomicile: {
      typeOfDocument: "",
      natureOfIssue: "",
      status: "Pending",
      dateOfReporting: "",
    },
    schemes: {
      eligibleSchemes: "",
      natureOfIssue: "",
      status: "Pending",
    },
    progressReporting: {},
    remarks: "",
    followUpRequired: false,
    followUpDate: "",
  });

  const documentTypes = [
    "Aadhar Card",
    "Voter ID",
    "Passport",
    "Driving License",
    "PAN Card",
    "Ration Card",
    "Birth Certificate",
    "Domicile Certificate",
    "Other",
  ];

  const statusOptions = ["Pending", "In Progress", "Resolved", "Rejected"];

  const genderOptions = ["Male", "Female", "Other"];

  // Fetch entitlements
  const fetchEntitlements = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        search: searchTerm,
        ...filters,
      };

      const response = await entitlementsAPI.getAll(params);

      // Handle response data with fallbacks
      const entitlementsData =
        response.data.entitlements || response.data.data || response.data || [];
      setEntitlements(Array.isArray(entitlementsData) ? entitlementsData : []);

      // Handle pagination data - if not provided by API, create default pagination
      if (response.data.pagination) {
        setPagination(response.data.pagination);
      } else {
        // Create default pagination based on data length
        setPagination({
          page: 1,
          limit: 10,
          total: entitlementsData.length,
          pages: Math.ceil(entitlementsData.length / 10),
        });
      }
    } catch (error) {
      toast.error("Failed to fetch entitlements");
      console.error("Error fetching entitlements:", error);
      // Set empty array on error to prevent undefined errors
      setEntitlements([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial data load
  useEffect(() => {
    fetchEntitlements();
  }, []);

  // Refetch when search or filters change
  useEffect(() => {
    fetchEntitlements();
  }, [searchTerm, filters]);

  const buildEntitlementPayload = () => {
    const { entitlementType, ...rest } = formData;
    const normalizedSchemes = {
      ...(rest.schemes || {}),
      eligibleSchemes: entitlementType || rest.schemes?.eligibleSchemes || "",
    };

    return {
      ...rest,
      schemes: normalizedSchemes,
    };
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = buildEntitlementPayload();

      if (selectedEntitlement) {
        await entitlementsAPI.update(selectedEntitlement._id, payload);
        toast.success("Entitlement updated successfully");
        setIsEditModalOpen(false);
      } else {
        await entitlementsAPI.create(payload);
        toast.success("Entitlement created successfully");
        setIsCreateModalOpen(false);
      }
      fetchEntitlements();
      resetForm();
    } catch (error) {
      toast.error(
        selectedEntitlement
          ? "Failed to update entitlement"
          : "Failed to create entitlement"
      );
      console.error("Error submitting form:", error);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      householdCode: "",
      idCode: "",
      beneficiaryId: "",
      beneficiaryName: "",
      name: "",
      gender: "",
      age: "",
      headOfHousehold: "",
      contactNo: "",
      wardNo: "",
      habitation: "",
      projectResponsible: "",
      dateOfReporting: "",
      reportedBy: "",
      entitlementType: "",
      applicationDate: "",
      idProofAndDomicile: {
        typeOfDocument: "",
        natureOfIssue: "",
        status: "Pending",
        dateOfReporting: "",
      },
      schemes: {
        eligibleSchemes: "",
        natureOfIssue: "",
        status: "Pending",
      },
      progressReporting: {},
      remarks: "",
      followUpRequired: false,
      followUpDate: "",
    });
    setSelectedEntitlement(null);
  };

  // Handle delete
  const handleDelete = async (id) => {
    try {
      await entitlementsAPI.delete(id);
      toast.success("Entitlement deleted successfully");
      fetchEntitlements();
    } catch (error) {
      toast.error("Failed to delete entitlement");
      console.error("Error deleting entitlement:", error);
    }
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case "Disbursed":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "Approved":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "Applied":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case "Under Verification":
        return "bg-purple-100 text-purple-800 hover:bg-purple-200";
      case "Rejected":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      case "On Hold":
        return "bg-secondary text-foreground hover:bg-secondary";
      default:
        return "bg-secondary text-foreground hover:bg-secondary";
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case "Disbursed":
        return <CheckCircle className="h-3 w-3" />;
      case "Approved":
        return <CheckCircle className="h-3 w-3" />;
      case "Applied":
        return <Clock className="h-3 w-3" />;
      case "Under Verification":
        return <Clock className="h-3 w-3" />;
      case "Rejected":
        return <XCircle className="h-3 w-3" />;
      case "On Hold":
        return <Clock className="h-3 w-3" />;
      default:
        return <Clock className="h-3 w-3" />;
    }
  };

  const getEntitlementTypeLabel = (entitlement) =>
    entitlement?.entitlementType ||
    entitlement?.schemes?.eligibleSchemes ||
    entitlement?.idProofAndDomicile?.typeOfDocument ||
    "N/A";

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeItem="entitlements"
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
          <h1 className="text-lg font-semibold">Entitlements</h1>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="container mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  Entitlements
                </h1>
                <p className="text-muted-foreground">
                  Manage government entitlements and benefits for beneficiaries
                </p>
              </div>
              {canCreate("socialJustice") && (
                <Button onClick={() => setIsCreateModalOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Entitlement
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
                      placeholder="Search beneficiaries..."
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
                    value={filters.entitlementType}
                    onValueChange={(value) =>
                      setFilters({ ...filters, entitlementType: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      {entitlementTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select> */}
                </div>
              </CardContent>
            </Card>

            {/* Entitlements Table */}
            <Card>
              <CardHeader>
                <CardTitle>Entitlements ({pagination.total})</CardTitle>
                <CardDescription>
                  Track and manage government entitlements and benefits
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
                        <TableHead>Entitlement ID</TableHead>
                        <TableHead>Beneficiary Name</TableHead>
                        <TableHead>Entitlement Type</TableHead>
                        <TableHead>Application Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {entitlements.map((entitlement) => (
                        <TableRow key={entitlement._id}>
                          <TableCell className="font-medium">
                            {entitlement.idCode || entitlement._id || "—"}
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">
                                {entitlement.beneficiaryName ||
                                  entitlement.name ||
                                  ""}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {entitlement.age} years, {entitlement.gender}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {getEntitlementTypeLabel(entitlement)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center text-sm">
                              <Calendar className="mr-1 h-3 w-3" />
                              {entitlement.applicationDate
                                ? new Date(
                                    entitlement.applicationDate
                                  ).toLocaleDateString()
                                : "N/A"}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">
                              ₹{entitlement.amountDisbursed || "0"}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={getStatusColor(entitlement.status)}
                            >
                              {getStatusIcon(entitlement.status)}
                              <span className="ml-1">{entitlement.status}</span>
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedEntitlement(entitlement);
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
                                    setSelectedEntitlement(entitlement);
                                    setFormData({
                                      householdCode:
                                        entitlement.householdCode || "",
                                      idCode: entitlement.idCode || "",
                                      beneficiaryId:
                                        entitlement.beneficiaryId || "",
                                      beneficiaryName:
                                        entitlement.beneficiaryName ||
                                        entitlement.name ||
                                        "",
                                      name: entitlement.name || "",
                                      headOfHousehold:
                                        entitlement.headOfHousehold || "",
                                      contactNo: entitlement.contactNo || "",
                                      projectResponsible:
                                        entitlement.projectResponsible || "",
                                      dateOfReporting: entitlement.dateOfReporting
                                        ? entitlement.dateOfReporting.split(
                                            "T"
                                          )[0]
                                        : "",
                                      reportedBy: entitlement.reportedBy || "",
                                      age: entitlement.age || "",
                                      gender: entitlement.gender || "",
                                      wardNo: entitlement.wardNo || "",
                                      habitation: entitlement.habitation || "",
                                      entitlementType:
                                        entitlement.entitlementType ||
                                        entitlement.schemes?.eligibleSchemes ||
                                        "",
                                      entitlementDetails:
                                        entitlement.entitlementDetails || "",
                                      applicationDate: entitlement.applicationDate
                                        ? entitlement.applicationDate.split(
                                            "T"
                                          )[0]
                                        : "",
                                      documentsSubmitted:
                                        entitlement.documentsSubmitted || "",
                                      verificationStatus:
                                        entitlement.verificationStatus || "",
                                      approvalDate: entitlement.approvalDate
                                        ? entitlement.approvalDate.split("T")[0]
                                        : "",
                                      disbursementDate:
                                        entitlement.disbursementDate
                                          ? entitlement.disbursementDate.split(
                                              "T"
                                            )[0]
                                          : "",
                                      amountDisbursed:
                                        entitlement.amountDisbursed || "",
                                      status: entitlement.status || "Applied",
                                      remarks: entitlement.remarks || "",
                                      followUpRequired:
                                        entitlement.followUpRequired || false,
                                      nextFollowUpDate:
                                        entitlement.nextFollowUpDate
                                          ? entitlement.nextFollowUpDate.split(
                                              "T"
                                            )[0]
                                          : "",
                                      contactNumber:
                                        entitlement.contactNumber || "",
                                      address: entitlement.address || "",
                                      schemes: {
                                        eligibleSchemes:
                                          entitlement.entitlementType ||
                                          entitlement.schemes?.eligibleSchemes ||
                                          "",
                                        natureOfIssue:
                                          entitlement.schemes?.natureOfIssue ||
                                          "",
                                        status:
                                          entitlement.schemes?.status ||
                                          "Pending",
                                      },
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
                                        permanently delete the entitlement record.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>
                                        Cancel
                                      </AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() =>
                                          handleDelete(entitlement._id)
                                        }
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
                  <DialogTitle>Add New Entitlement</DialogTitle>
                  <DialogDescription>
                    Fill in the details to create a new entitlement record
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6">
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
                        placeholder="Enter household code"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="idCode">ID Code *</Label>
                      <Input
                        id="idCode"
                        value={formData.idCode}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            idCode: e.target.value,
                          })
                        }
                        placeholder="Enter ID code"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="name">Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            name: e.target.value,
                          })
                        }
                        placeholder="Enter name"
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
                          {genderOptions.map((gender) => (
                            <SelectItem key={gender} value={gender}>
                              {gender}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="age">Age *</Label>
                      <Input
                        id="age"
                        type="number"
                        min="0"
                        max="120"
                        value={formData.age}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            age: e.target.value,
                          })
                        }
                        placeholder="Enter age"
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
                        placeholder="Enter head of household"
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
                        placeholder="Enter contact number"
                        pattern="[6-9][0-9]{9}"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="wardNo">Ward Number *</Label>
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
                      <Label htmlFor="dateOfReporting">
                        Date of Reporting *
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
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="reportedBy">Reported By *</Label>
                      <Input
                        id="reportedBy"
                        value={formData.reportedBy}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            reportedBy: e.target.value,
                          })
                        }
                        placeholder="Enter reported by"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="beneficiaryId">Beneficiary ID</Label>
                      <Input
                        id="beneficiaryId"
                        value={formData.beneficiaryId}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            beneficiaryId: e.target.value,
                          })
                        }
                        placeholder="Enter beneficiary ID"
                      />
                    </div>
                    <div>
                      <Label htmlFor="beneficiaryName">Beneficiary Name</Label>
                      <Input
                        id="beneficiaryName"
                        value={formData.beneficiaryName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            beneficiaryName: e.target.value,
                          })
                        }
                        placeholder="Enter beneficiary name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="entitlementType">Entitlement Type</Label>
                      <Select
                        value={formData.entitlementType}
                        onValueChange={(value) =>
                          setFormData({ ...formData, entitlementType: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select entitlement type" />
                        </SelectTrigger>
                        <SelectContent>
                          {entitlementTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="applicationDate">Application Date</Label>
                      <Input
                        id="applicationDate"
                        type="date"
                        value={formData.applicationDate}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            applicationDate: e.target.value,
                          })
                        }
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
                    <Button type="submit">Create Entitlement</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            {/* Edit Modal */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Edit Entitlement</DialogTitle>
                  <DialogDescription>
                    Update the entitlement information
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="edit-beneficiaryId">
                        Beneficiary ID *
                      </Label>
                      <Input
                        id="edit-beneficiaryId"
                        value={formData.beneficiaryId}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            beneficiaryId: e.target.value,
                          })
                        }
                        placeholder="Enter beneficiary ID"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-status">Status</Label>
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
                          {statusOptions.map((status) => (
                            <SelectItem key={status} value={status}>
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                    <Button type="submit">Update Entitlement</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            {/* View Modal */}
            <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Entitlement Details</DialogTitle>
                  <DialogDescription>
                    View detailed information about this entitlement
                  </DialogDescription>
                </DialogHeader>
                {selectedEntitlement && (
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
                          <p>{selectedEntitlement.householdCode}</p>
                        </div>
                        <div>
                          <Label className="font-semibold">ID Code</Label>
                          <p>{selectedEntitlement.idCode}</p>
                        </div>
                        <div>
                          <Label className="font-semibold">Name</Label>
                          <p>{selectedEntitlement.name}</p>
                        </div>
                        <div>
                          <Label className="font-semibold">Gender</Label>
                          <Badge variant="outline">
                            {selectedEntitlement.gender}
                          </Badge>
                        </div>
                        <div>
                          <Label className="font-semibold">Age</Label>
                          <p>{selectedEntitlement.age} years</p>
                        </div>
                        <div>
                          <Label className="font-semibold">
                            Head of Household
                          </Label>
                          <p>{selectedEntitlement.headOfHousehold}</p>
                        </div>
                        <div>
                          <Label className="font-semibold">
                            Contact Number
                          </Label>
                          <p>{selectedEntitlement.contactNo}</p>
                        </div>
                        <div>
                          <Label className="font-semibold">Ward No</Label>
                          <p>{selectedEntitlement.wardNo}</p>
                        </div>
                        <div>
                          <Label className="font-semibold">Habitation</Label>
                          <p>{selectedEntitlement.habitation}</p>
                        </div>
                        <div>
                          <Label className="font-semibold">
                            Project Responsible
                          </Label>
                          <p>{selectedEntitlement.projectResponsible}</p>
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
                            {selectedEntitlement.dateOfReporting
                              ? new Date(
                                  selectedEntitlement.dateOfReporting
                                ).toLocaleDateString()
                              : "N/A"}
                          </p>
                        </div>
                        <div>
                          <Label className="font-semibold">Reported By</Label>
                          <p>{selectedEntitlement.reportedBy}</p>
                        </div>
                      </div>
                    </div>

                    {/* ID Proof & Domicile */}
                    {selectedEntitlement.idProofAndDomicile && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold border-b pb-2">
                          ID Proof & Domicile
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label className="font-semibold">
                              Type of Document
                            </Label>
                            <p>
                              {selectedEntitlement.idProofAndDomicile
                                .typeOfDocument || "N/A"}
                            </p>
                          </div>
                          <div>
                            <Label className="font-semibold">Status</Label>
                            <Badge
                              className={getStatusColor(
                                selectedEntitlement.idProofAndDomicile.status
                              )}
                            >
                              {getStatusIcon(
                                selectedEntitlement.idProofAndDomicile.status
                              )}
                              <span className="ml-1">
                                {selectedEntitlement.idProofAndDomicile.status}
                              </span>
                            </Badge>
                          </div>
                          {selectedEntitlement.idProofAndDomicile
                            .dateOfReporting && (
                            <div>
                              <Label className="font-semibold">
                                Date of Reporting
                              </Label>
                              <p>
                                {new Date(
                                  selectedEntitlement.idProofAndDomicile.dateOfReporting
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          )}
                        </div>
                        {selectedEntitlement.idProofAndDomicile
                          .natureOfIssue && (
                          <div>
                            <Label className="font-semibold">
                              Nature of Issue
                            </Label>
                            <p className="mt-1 text-sm text-muted-foreground">
                              {
                                selectedEntitlement.idProofAndDomicile
                                  .natureOfIssue
                              }
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Schemes */}
                    {selectedEntitlement.schemes && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold border-b pb-2">
                          Schemes
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label className="font-semibold">Status</Label>
                            <Badge
                              className={getStatusColor(
                                selectedEntitlement.schemes.status
                              )}
                            >
                              {getStatusIcon(
                                selectedEntitlement.schemes.status
                              )}
                              <span className="ml-1">
                                {selectedEntitlement.schemes.status}
                              </span>
                            </Badge>
                          </div>
                        </div>
                        {selectedEntitlement.schemes.eligibleSchemes && (
                          <div>
                            <Label className="font-semibold">
                              Eligible Schemes
                            </Label>
                            <p className="mt-1 text-sm text-muted-foreground">
                              {selectedEntitlement.schemes.eligibleSchemes}
                            </p>
                          </div>
                        )}
                        {selectedEntitlement.schemes.natureOfIssue && (
                          <div>
                            <Label className="font-semibold">
                              Nature of Issue
                            </Label>
                            <p className="mt-1 text-sm text-muted-foreground">
                              {selectedEntitlement.schemes.natureOfIssue}
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Follow-up */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold border-b pb-2">
                        Follow-up
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="font-semibold">
                            Follow-up Required
                          </Label>
                          <Badge
                            variant={
                              selectedEntitlement.followUpRequired
                                ? "default"
                                : "secondary"
                            }
                          >
                            {selectedEntitlement.followUpRequired
                              ? "Yes"
                              : "No"}
                          </Badge>
                        </div>
                        {selectedEntitlement.followUpDate && (
                          <div>
                            <Label className="font-semibold">
                              Follow-up Date
                            </Label>
                            <p>
                              {new Date(
                                selectedEntitlement.followUpDate
                              ).toLocaleDateString()}
                            </p>
                          </div>
                        )}
                      </div>
                      {selectedEntitlement.remarks && (
                        <div>
                          <Label className="font-semibold">Remarks</Label>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {selectedEntitlement.remarks}
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

export default Entitlements;
