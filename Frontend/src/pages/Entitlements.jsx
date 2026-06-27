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
  Check,
  ChevronsUpDown,
} from "lucide-react";
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
import { cn } from "@/lib/utils";
import { entitlementsAPI } from "../services/api";
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
          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50 shrink-0" />
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
                      "mr-2 h-4 w-4 shrink-0",
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

const Entitlements = () => {
  const wardOptions = getWardOptions();
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
    documentation: {
      typeOfDocument: "",
      natureOfIssue: "",
      status: "Pending",
      dateOfReporting: "",
    },
    governmentSchemes: {
      eligibleSchemes: "",
      natureOfIssue: "",
      status: "Pending",
    },
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

  const statusOptions = [
    "Applied",
    "Approved",
    "Disbursed",
    "Rejected",
    "Pending",
    "In Progress",
    "Resolved",
    "Under Verification",
    "On Hold",
  ];

  const genderOptions = ["Male", "Female", "Other"];

  // Fetch entitlements
  const fetchEntitlements = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        search: searchTerm,
        ...Object.fromEntries(
          Object.entries(filters).filter(([, value]) => value !== "all")
        ),
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
    const {
      entitlementType,
      documentation,
      governmentSchemes,
      idProofAndDomicile,
      schemes,
      ...rest
    } = formData;

    const normalizedDocumentation = {
      ...(documentation || idProofAndDomicile || {}),
    };
    const normalizedGovernmentSchemes = {
      ...(governmentSchemes || schemes || {}),
      eligibleSchemes:
        entitlementType ||
        governmentSchemes?.eligibleSchemes ||
        schemes?.eligibleSchemes ||
        "",
    };

    const normalizedSchemes = {
      ...(schemes || {}),
      eligibleSchemes: normalizedGovernmentSchemes.eligibleSchemes || "",
      natureOfIssue:
        normalizedGovernmentSchemes.natureOfIssue || schemes?.natureOfIssue || "",
      status: normalizedGovernmentSchemes.status || schemes?.status || "Pending",
    };

    return {
      ...rest,
      documentation: normalizedDocumentation,
      governmentSchemes: normalizedGovernmentSchemes,
      idProofAndDomicile: normalizedDocumentation,
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
      documentation: {
        typeOfDocument: "",
        natureOfIssue: "",
        status: "Pending",
        dateOfReporting: "",
      },
      governmentSchemes: {
        eligibleSchemes: "",
        natureOfIssue: "",
        status: "Pending",
      },
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
      case "Resolved":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "Approved":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "Applied":
      case "Pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case "In Progress":
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
      case "Resolved":
        return <CheckCircle className="h-3 w-3" />;
      case "Approved":
        return <CheckCircle className="h-3 w-3" />;
      case "Applied":
      case "Pending":
      case "In Progress":
      case "Under Verification":
      case "On Hold":
        return <Clock className="h-3 w-3" />;
      case "Rejected":
        return <XCircle className="h-3 w-3" />;
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
                <div className="flex flex-wrap items-center gap-2">
                  <ExcelBulkImportButton
                    label="Import Excel"
                    description="Use the same field names shown in the form to create entitlement records in bulk."
                    templateFields={[
                      { label: "Household Code", key: "householdCode" },
                      { label: "ID Code", key: "idCode" },
                      { label: "Beneficiary ID", key: "beneficiaryId" },
                      { label: "Beneficiary Name", key: "beneficiaryName" },
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
                      { label: "Entitlement Type", key: "entitlementType" },
                      { label: "Application Date", key: "applicationDate" },
                      { label: "Document Type", key: "documentation.typeOfDocument", options: ["Aadhar Card", "Voter ID", "Passport", "Driving License", "PAN Card", "Ration Card", "Birth Certificate", "Domicile Certificate", "Other"] },
                      { label: "Documentation Status", key: "documentation.status", options: ["Applied", "Approved", "Disbursed", "Rejected", "Pending", "In Progress", "Resolved", "Under Verification", "On Hold"] },
                      { label: "Documentation Nature of Issue", key: "documentation.natureOfIssue" },
                      { label: "Government Scheme Issue", key: "governmentSchemes.natureOfIssue" },
                      { label: "Case Status", key: "status", options: ["Applied", "Approved", "Disbursed", "Rejected", "Pending", "In Progress", "Resolved", "Under Verification", "On Hold"] },
                      { label: "Remarks", key: "remarks" },
                      { label: "Follow-up Required", key: "followUpRequired" },
                      { label: "Follow-up Date", key: "followUpDate" },
                    ]}
                    sampleRow={{
                      householdCode: "HH-001",
                      idCode: "ID-001",
                      beneficiaryId: "BEN-001",
                      beneficiaryName: "Lakshmi",
                      name: "Lakshmi",
                      gender: "Female",
                      age: "42",
                      headOfHousehold: "Lakshmi",
                      contactNo: "9876543210",
                      wardNo: "8",
                      habitation: "East Street",
                      projectResponsible: "Field Staff",
                      dateOfReporting: "2026-01-20",
                      reportedBy: "Volunteer",
                      entitlementType: "Pension",
                      applicationDate: "2026-01-21",
                      documentation: "",
                      status: "Pending",
                      remarks: "",
                      followUpRequired: false,
                      followUpDate: "",
                    }}
                    createRecord={entitlementsAPI.create}
                    onImported={fetchEntitlements}
                  />
                  <Button onClick={() => setIsCreateModalOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Entitlement
                  </Button>
                </div>
              )}
            </div>

            <GuidelinesCard
              title="Entitlement Guidelines"
              description="Follow these steps to keep entitlement records complete and consistent."
              items={[
                "Double-check beneficiary ID and household code for consistency.",
                "Specify the exact type of entitlement being applied for (Pension, Aadhaar, etc.).",
                "Update application status regularly (Pending, In Progress, Resolved).",
                "Ensure documentation status is accurate to track pending requirements.",
                "Record any amount disbursed to beneficiaries once the process is complete.",
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
                  <Select
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
                  </Select>
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
                                      documentation: {
                                        typeOfDocument:
                                          entitlement.documentation
                                            ?.typeOfDocument ||
                                          entitlement.idProofAndDomicile
                                            ?.typeOfDocument ||
                                          "",
                                        natureOfIssue:
                                          entitlement.documentation
                                            ?.natureOfIssue ||
                                          entitlement.idProofAndDomicile
                                            ?.natureOfIssue ||
                                          "",
                                        status:
                                          entitlement.documentation?.status ||
                                          entitlement.idProofAndDomicile
                                            ?.status ||
                                          "Pending",
                                        dateOfReporting:
                                          entitlement.documentation
                                            ?.dateOfReporting
                                            ? entitlement.documentation.dateOfReporting.split(
                                                "T"
                                              )[0]
                                            : entitlement.idProofAndDomicile
                                                ?.dateOfReporting
                                            ? entitlement.idProofAndDomicile.dateOfReporting.split(
                                                "T"
                                              )[0]
                                            : "",
                                      },
                                      governmentSchemes: {
                                        eligibleSchemes:
                                          entitlement.governmentSchemes
                                            ?.eligibleSchemes ||
                                          entitlement.entitlementType ||
                                          entitlement.schemes
                                            ?.eligibleSchemes ||
                                          "",
                                        natureOfIssue:
                                          entitlement.governmentSchemes
                                            ?.natureOfIssue ||
                                          entitlement.schemes?.natureOfIssue ||
                                          "",
                                        status:
                                          entitlement.governmentSchemes
                                            ?.status ||
                                          entitlement.schemes?.status ||
                                          "Pending",
                                      },
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
                      <Label htmlFor="householdCode">Household Code</Label>
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
                      />
                    </div>
                    <div>
                      <Label htmlFor="idCode">ID Code</Label>
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
                          {genderOptions.map((gender) => (
                            <SelectItem key={gender} value={gender}>
                              {gender}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="age">Age</Label>
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
                        placeholder="Enter head of household"
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
                        placeholder="Enter contact number"
                        pattern="[6-9][0-9]{9}"
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
                        placeholder="Enter habitation"
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
                        placeholder="Enter reported by"
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
                    <div>
                      <Label htmlFor="documentationType">Document Type</Label>
                      <Select
                        value={formData.documentation?.typeOfDocument || ""}
                        onValueChange={(value) =>
                          setFormData({
                            ...formData,
                            documentation: {
                              ...formData.documentation,
                              typeOfDocument: value,
                            },
                          })
                        }
                      >
                        <SelectTrigger id="documentationType">
                          <SelectValue placeholder="Select document type" />
                        </SelectTrigger>
                        <SelectContent>
                          {documentTypes.map((docType) => (
                            <SelectItem key={docType} value={docType}>
                              {docType}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="documentationStatus">
                        Documentation Status
                      </Label>
                      <Select
                        value={formData.documentation?.status || "Pending"}
                        onValueChange={(value) =>
                          setFormData({
                            ...formData,
                            documentation: {
                              ...formData.documentation,
                              status: value,
                            },
                          })
                        }
                      >
                        <SelectTrigger id="documentationStatus">
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
                    <div className="md:col-span-2">
                      <Label htmlFor="documentationIssue">
                        Documentation Nature of Issue
                      </Label>
                      <Textarea
                        id="documentationIssue"
                        value={formData.documentation?.natureOfIssue || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            documentation: {
                              ...formData.documentation,
                              natureOfIssue: e.target.value,
                            },
                          })
                        }
                        placeholder="Describe documentation issue"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="schemeIssue">Government Scheme Issue</Label>
                      <Textarea
                        id="schemeIssue"
                        value={formData.governmentSchemes?.natureOfIssue || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            governmentSchemes: {
                              ...formData.governmentSchemes,
                              natureOfIssue: e.target.value,
                            },
                          })
                        }
                        placeholder="Describe scheme-related issue"
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
                      <Label htmlFor="edit-householdCode">Household Code</Label>
                      <Input
                        id="edit-householdCode"
                        value={formData.householdCode}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            householdCode: e.target.value,
                          })
                        }
                        placeholder="Enter household code"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-idCode">ID Code</Label>
                      <Input
                        id="edit-idCode"
                        value={formData.idCode}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            idCode: e.target.value,
                          })
                        }
                        placeholder="Enter ID code"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-name">Name *</Label>
                      <Input
                        id="edit-name"
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
                      <Label htmlFor="edit-gender">Gender</Label>
                      <Select
                        value={formData.gender}
                        onValueChange={(value) =>
                          setFormData({ ...formData, gender: value })
                        }
                      >
                        <SelectTrigger id="edit-gender">
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
                      <Label htmlFor="edit-age">Age</Label>
                      <Input
                        id="edit-age"
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
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-headOfHousehold">
                        Head of Household
                      </Label>
                      <Input
                        id="edit-headOfHousehold"
                        value={formData.headOfHousehold}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            headOfHousehold: e.target.value,
                          })
                        }
                        placeholder="Enter head of household"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-contactNo">Contact Number</Label>
                      <Input
                        id="edit-contactNo"
                        value={formData.contactNo}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            contactNo: e.target.value,
                          })
                        }
                        placeholder="Enter contact number"
                        pattern="[6-9][0-9]{9}"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-wardNo">Ward Number *</Label>
                      <WardCombobox
                        id="edit-wardNo"
                        value={formData.wardNo}
                        onChange={(value) =>
                          setFormData({ ...formData, wardNo: value })
                        }
                        options={wardOptions}
                        placeholder="Select ward"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-habitation">Habitation</Label>
                      <Input
                        id="edit-habitation"
                        value={formData.habitation}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            habitation: e.target.value,
                          })
                        }
                        placeholder="Enter habitation"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-status">Overall Status</Label>
                      <Select
                        value={formData.status}
                        onValueChange={(value) =>
                          setFormData({ ...formData, status: value })
                        }
                      >
                        <SelectTrigger id="edit-status">
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
                    <div>
                      <Label htmlFor="edit-entitlementType">Entitlement Type</Label>
                      <Select
                        value={formData.entitlementType}
                        onValueChange={(value) =>
                          setFormData({ ...formData, entitlementType: value })
                        }
                      >
                        <SelectTrigger id="edit-entitlementType">
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
                      <Label htmlFor="edit-applicationDate">Application Date</Label>
                      <Input
                        id="edit-applicationDate"
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
                    <div className="md:col-span-2">
                      <Label htmlFor="edit-remarks">Remarks</Label>
                      <Textarea
                        id="edit-remarks"
                        value={formData.remarks}
                        onChange={(e) =>
                          setFormData({ ...formData, remarks: e.target.value })
                        }
                        placeholder="Enter remarks"
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
                        <div>
                          <Label className="font-semibold">Overall Status</Label>
                          <Badge
                            className={getStatusColor(selectedEntitlement.status)}
                          >
                            {getStatusIcon(selectedEntitlement.status)}
                            <span className="ml-1">
                              {selectedEntitlement.status}
                            </span>
                          </Badge>
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



