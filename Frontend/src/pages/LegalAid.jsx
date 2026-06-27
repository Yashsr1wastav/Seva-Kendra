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
  Scale,
  FileSpreadsheet,
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
  AlertCircle,
  Phone,
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
import { legalAidServiceAPI } from "../services/api";
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

const LegalAid = () => {
  const wardOptions = getWardOptions();
  const { canCreate, canEdit, canDelete, canExport } = usePermissions();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [legalAidServices, setLegalAidServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    status: "all",
    caseType: "all",
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const [selectedService, setSelectedService] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    householdCode: "",
    uniqueId: "",
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
    natureOfIssue: "",
    status: "Pending",
    priority: "Medium",
    actionPlan: "",
    progressReporting: {},
    photoDocumentation: [],
    remarks: "",
    followUpRequired: false,
    followUpDate: "",
  });

  const caseTypes = [
    "Property Dispute",
    "Family Dispute",
    "Domestic Violence",
    "Labor Rights",
    "Consumer Rights",
    "Land Rights",
    "Government Benefits",
    "Legal Documentation",
    "Other",
  ];

  const natureOfIssueOptions = [
    "Property Dispute",
    "Family Dispute",
    "Domestic Violence",
    "Labor Rights",
    "Consumer Rights",
    "Land Rights",
    "Government Benefits",
    "Legal Documentation",
    "Criminal Case",
    "Civil Case",
    "Other",
  ];

  const genderOptions = ["Male", "Female", "Other"];

  const statusOptions = [
    "Pending",
    "In Progress",
    "Resolved",
    "Closed",
    "Referred",
  ];

  // Fetch legal aid services
  const fetchLegalAidServices = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        search: searchTerm,
      };

      if (filters.status && filters.status !== "all") params.caseStatus = filters.status;
      if (filters.caseType && filters.caseType !== "all") params.caseType = filters.caseType;

      const response = await legalAidServiceAPI.getAll(params);

      // Handle different possible response structures
      const servicesData =
        response.data.legalAidServices ||
        response.data.data ||
        response.data ||
        [];
      const paginationData = response.data.pagination || {
        page: 1,
        limit: 10,
        total: Array.isArray(servicesData) ? servicesData.length : 0,
        pages: 1,
      };

      setLegalAidServices(Array.isArray(servicesData) ? servicesData : []);
      setPagination(paginationData);
    } catch (error) {
      toast.error("Failed to fetch legal aid services");
      console.error("Error fetching legal aid services:", error);
      setLegalAidServices([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchLegalAidServices();
  }, []);

  // Handle page changes and search/filter changes
  useEffect(() => {
    if (pagination.page !== 1) {
      fetchLegalAidServices();
    }
  }, [pagination.page, pagination.limit]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setPagination((prev) => ({ ...prev, page: 1 }));
      fetchLegalAidServices();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, filters.status, filters.caseType]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedService) {
        await legalAidServiceAPI.update(selectedService._id, formData);
        toast.success("Legal aid service updated successfully");
        setIsEditModalOpen(false);
      } else {
        await legalAidServiceAPI.create(formData);
        toast.success("Legal aid service created successfully");
        setIsCreateModalOpen(false);
      }
      fetchLegalAidServices();
      resetForm();
    } catch (error) {
      toast.error(
        selectedService
          ? "Failed to update legal aid service"
          : "Failed to create legal aid service"
      );
      console.error("Error submitting form:", error);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      householdCode: "",
      uniqueId: "",
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
      natureOfIssue: "",
      status: "Pending",
      priority: "Medium",
      actionPlan: "",
      progressReporting: {},
      photoDocumentation: [],
      remarks: "",
      followUpRequired: false,
      followUpDate: "",
    });
    setSelectedService(null);
  };

  // Handle delete
  const handleDelete = async (id) => {
    try {
      await legalAidServiceAPI.delete(id);
      toast.success("Legal aid service deleted successfully");
      fetchLegalAidServices();
    } catch (error) {
      toast.error("Failed to delete legal aid service");
      console.error("Error deleting legal aid service:", error);
    }
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case "Resolved":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "Closed":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "Settled":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "In Progress":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case "Hearing Scheduled":
        return "bg-purple-100 text-purple-800 hover:bg-purple-200";
      case "Open":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "Dismissed":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      case "Under Review":
        return "bg-secondary text-foreground hover:bg-secondary/80";
      default:
        return "bg-secondary text-foreground hover:bg-secondary/80";
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case "Resolved":
        return <CheckCircle className="h-3 w-3" />;
      case "Closed":
        return <CheckCircle className="h-3 w-3" />;
      case "Settled":
        return <CheckCircle className="h-3 w-3" />;
      case "In Progress":
        return <Clock className="h-3 w-3" />;
      case "Hearing Scheduled":
        return <Calendar className="h-3 w-3" />;
      case "Open":
        return <FileText className="h-3 w-3" />;
      case "Dismissed":
        return <XCircle className="h-3 w-3" />;
      case "Under Review":
        return <AlertCircle className="h-3 w-3" />;
      default:
        return <Clock className="h-3 w-3" />;
    }
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeItem="legalaid"
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
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
                <Scale className="h-6 w-6 text-purple-600" />
                <h1 className="text-2xl font-bold text-foreground">
                  Legal Aid Services
                </h1>
              </div>
            </div>
            {canCreate("socialJustice") && (
              <Button onClick={() => setIsCreateModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Legal Case
              </Button>
            )}
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="container mx-auto p-6 space-y-6">
            {/* Bulk Import Card */}
            {canCreate("socialJustice") && (
              <Card className="border border-muted bg-card shadow-sm">
                <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4">
                  <div className="space-y-1">
                    <h3 className="font-semibold text-foreground flex items-center gap-2">
                      <FileSpreadsheet className="h-5 w-5 text-green-600" />
                      Bulk Import Legal Aid Cases
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
                      { label: "Unique ID", key: "uniqueId" },
                      { label: "Name", key: "name" },
                      { label: "Gender", key: "gender", options: ["Male", "Female", "Other"] },
                      { label: "Age", key: "age" },
                      { label: "Contact Number", key: "contactNo" },
                      { label: "Head of Household", key: "headOfHousehold" },
                      { label: "Ward Number", key: "wardNo" },
                      { label: "Habitation", key: "habitation" },
                      { label: "Project Responsible", key: "projectResponsible" },
                      { label: "Date of Reporting", key: "dateOfReporting" },
                      { label: "Reported By", key: "reportedBy" },
                      { label: "Nature of Issue", key: "natureOfIssue", options: ["Property Dispute", "Family Dispute", "Domestic Violence", "Labor Rights", "Consumer Rights", "Land Rights", "Government Benefits", "Legal Documentation", "Criminal Case", "Civil Case", "Other"] },
                      { label: "Case Status", key: "status", options: ["Pending", "In Progress", "Resolved", "Closed", "Referred"] },
                      { label: "Priority", key: "priority", options: ["Low", "Medium", "High", "Urgent"] },
                      { label: "Action Plan", key: "actionPlan" },
                      { label: "Remarks", key: "remarks" },
                      { label: "Follow-up Required", key: "followUpRequired" },
                      { label: "Follow-up Date", key: "followUpDate" },
                    ]}
                    sampleRow={{
                      householdCode: "HH-002",
                      uniqueId: "LA-001",
                      name: "Ravi",
                      gender: "Male",
                      age: "36",
                      contactNo: "9876543210",
                      headOfHousehold: "Ravi",
                      wardNo: "5",
                      habitation: "North Colony",
                      projectResponsible: "Case Worker",
                      dateOfReporting: "2026-02-01",
                      reportedBy: "Volunteer",
                      natureOfIssue: "Property Dispute",
                      status: "Pending",
                      priority: "Medium",
                      actionPlan: "Collect documents and draft notice",
                      remarks: "",
                      followUpRequired: true,
                      followUpDate: "2026-02-10",
                    }}
                    createRecord={legalAidServiceAPI.create}
                    onImported={fetchLegalAidServices}
                  />
                </CardContent>
              </Card>
            )}

            <GuidelinesCard
              title="Legal Aid Case Guidelines"
              description="Ensure efficient tracking and resolution of legal assistance cases."
              items={[
                "Categorize cases accurately (Property, Family, Domestic Violence, etc.).",
                "Set priority levels based on urgency and legal timelines.",
                "Maintain clear records of action plans and latest case status.",
                "Track follow-up dates to ensure timely legal interventions.",
                "Document all counseling provided and referrals made to legal experts.",
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
                      placeholder="Search cases..."
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
                    value={filters.caseType}
                    onValueChange={(value) =>
                      setFilters({ ...filters, caseType: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by case type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Case Types</SelectItem>
                      {caseTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Legal Aid Services Table */}
            <Card>
              <CardHeader>
                <CardTitle>Legal Aid Cases ({pagination.total})</CardTitle>
                <CardDescription>
                  Track and manage legal assistance cases and services
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
                        <TableHead>Case ID</TableHead>
                        <TableHead>Client Name</TableHead>
                        <TableHead>Case Type</TableHead>
                        <TableHead>Registration Date</TableHead>
                        <TableHead>Next Hearing</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Array.isArray(legalAidServices) &&
                      legalAidServices.length > 0 ? (
                        legalAidServices.map((service) => (
                          <TableRow key={service._id}>
                            <TableCell className="font-medium">
                              {service.uniqueId || service.householdCode || "-"}
                            </TableCell>
                            <TableCell>
                              <div>
                                <div className="font-medium">
                                  {service.name}
                                </div>
                                <div className="text-sm text-muted-foreground flex items-center">
                                  <Phone className="mr-1 h-3 w-3" />
                                  {service.contactNo || "-"}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {service.natureOfIssue}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center text-sm">
                                <Calendar className="mr-1 h-3 w-3" />
                                {service.dateOfReporting
                                  ? new Date(
                                      service.dateOfReporting
                                    ).toLocaleDateString()
                                  : "N/A"}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center text-sm">
                                <Calendar className="mr-1 h-3 w-3" />
                                {service.followUpDate
                                  ? new Date(
                                      service.followUpDate
                                    ).toLocaleDateString()
                                  : "Not scheduled"}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge
                                className={getStatusColor(service.status)}
                              >
                                {getStatusIcon(service.status)}
                                <span className="ml-1">
                                  {service.status || "Pending"}
                                </span>
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedService(service);
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
                                      setSelectedService(service);
                                      setFormData({
                                        householdCode:
                                          service.householdCode || "",
                                        uniqueId: service.uniqueId || "",
                                        name: service.name || "",
                                        headOfHousehold:
                                          service.headOfHousehold || "",
                                        contactNo: service.contactNo || "",
                                        projectResponsible:
                                          service.projectResponsible || "",
                                        dateOfReporting: service.dateOfReporting
                                          ? service.dateOfReporting.split("T")[0]
                                          : "",
                                        reportedBy: service.reportedBy || "",
                                        natureOfIssue:
                                          service.natureOfIssue || "",
                                        actionPlan: service.actionPlan || "",
                                        status: service.status || "Pending",
                                        priority: service.priority || "Medium",
                                        age: service.age || "",
                                        gender: service.gender || "",
                                        wardNo: service.wardNo || "",
                                        habitation: service.habitation || "",
                                        remarks: service.remarks || "",
                                        followUpRequired:
                                          service.followUpRequired || false,
                                        followUpDate: service.followUpDate
                                          ? service.followUpDate.split("T")[0]
                                          : "",
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
                                          permanently delete the legal aid case.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>
                                          Cancel
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={() =>
                                            handleDelete(service._id)
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
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8">
                            <div className="flex flex-col items-center justify-center text-muted-foreground">
                              <Scale className="h-8 w-8 mb-2" />
                              <p>No legal aid cases found</p>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
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
                  <DialogTitle>Add New Legal Case</DialogTitle>
                  <DialogDescription>
                    Fill in the details to create a new legal aid case
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
                      <Label htmlFor="uniqueId">Unique ID *</Label>
                      <Input
                        id="uniqueId"
                        value={formData.uniqueId}
                        onChange={(e) =>
                          setFormData({ ...formData, uniqueId: e.target.value })
                        }
                        placeholder="Enter unique ID"
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
                          setFormData({ ...formData, age: e.target.value })
                        }
                        placeholder="Enter age"
                        required
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
                      <Label htmlFor="natureOfIssue">Nature of Issue *</Label>
                      <Select
                        value={formData.natureOfIssue}
                        onValueChange={(value) =>
                          setFormData({ ...formData, natureOfIssue: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select nature of issue" />
                        </SelectTrigger>
                        <SelectContent>
                          {natureOfIssueOptions.map((issue) => (
                            <SelectItem key={issue} value={issue}>
                              {issue}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="status">Case Status</Label>
                      <Select
                        value={formData.status}
                        onValueChange={(value) =>
                          setFormData({ ...formData, status: value })
                        }
                      >
                        <SelectTrigger id="status">
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
                      <Label htmlFor="actionPlan">Action Plan *</Label>
                      <Input
                        id="actionPlan"
                        value={formData.actionPlan}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            actionPlan: e.target.value,
                          })
                        }
                        placeholder="Enter action plan"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="followUpDate">Follow-up Date</Label>
                      <Input
                        id="followUpDate"
                        type="date"
                        value={formData.followUpDate}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            followUpDate: e.target.value,
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
                    <Button type="submit">Create Case</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            {/* Edit Modal */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Edit Legal Case</DialogTitle>
                  <DialogDescription>
                    Update the case information
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="edit-status">Case Status</Label>
                      <Select
                        value={formData.status}
                        onValueChange={(value) =>
                          setFormData({ ...formData, status: value })
                        }
                      >
                        <SelectTrigger id="edit-status">
                          <SelectValue placeholder="Select case status" />
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
                      <Label htmlFor="edit-followUpDate">Follow-up Date</Label>
                      <Input
                        id="edit-followUpDate"
                        type="date"
                        value={formData.followUpDate || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, followUpDate: e.target.value })
                        }
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
                    <Button type="submit">Update Case</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            {/* View Modal */}
            <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Legal Case Details</DialogTitle>
                  <DialogDescription>
                    View detailed information about this legal case
                  </DialogDescription>
                </DialogHeader>
                {selectedService && (
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
                          <p>{selectedService.householdCode}</p>
                        </div>
                        <div>
                          <Label className="font-semibold">Unique ID</Label>
                          <p>{selectedService.uniqueId}</p>
                        </div>
                        <div>
                          <Label className="font-semibold">Name</Label>
                          <p>{selectedService.name}</p>
                        </div>
                        <div>
                          <Label className="font-semibold">Gender</Label>
                          <Badge variant="outline">
                            {selectedService.gender}
                          </Badge>
                        </div>
                        <div>
                          <Label className="font-semibold">Age</Label>
                          <p>{selectedService.age} years</p>
                        </div>
                        <div>
                          <Label className="font-semibold">
                            Contact Number
                          </Label>
                          <p>{selectedService.contactNo}</p>
                        </div>
                        <div>
                          <Label className="font-semibold">
                            Head of Household
                          </Label>
                          <p>{selectedService.headOfHousehold}</p>
                        </div>
                        <div>
                          <Label className="font-semibold">Ward No</Label>
                          <p>{selectedService.wardNo}</p>
                        </div>
                        <div>
                          <Label className="font-semibold">Habitation</Label>
                          <p>{selectedService.habitation}</p>
                        </div>
                        <div>
                          <Label className="font-semibold">
                            Project Responsible
                          </Label>
                          <p>{selectedService.projectResponsible}</p>
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
                            {selectedService.dateOfReporting
                              ? new Date(
                                  selectedService.dateOfReporting
                                ).toLocaleDateString()
                              : "N/A"}
                          </p>
                        </div>
                        <div>
                          <Label className="font-semibold">Reported By</Label>
                          <p>{selectedService.reportedBy}</p>
                        </div>
                      </div>
                    </div>

                    {/* Case Details */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold border-b pb-2">
                        Case Details
                      </h3>
                      {selectedService.natureOfIssue && (
                        <div>
                          <Label className="font-semibold">
                            Nature of Issue
                          </Label>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {selectedService.natureOfIssue}
                          </p>
                        </div>
                      )}
                      {selectedService.actionPlan && (
                        <div>
                          <Label className="font-semibold">Action Plan</Label>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {selectedService.actionPlan}
                          </p>
                        </div>
                      )}
                      {selectedService.remarks && (
                        <div>
                          <Label className="font-semibold">Remarks</Label>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {selectedService.remarks}
                          </p>
                        </div>
                      )}
                    </div>

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
                              selectedService.followUpRequired
                                ? "default"
                                : "secondary"
                            }
                          >
                            {selectedService.followUpRequired ? "Yes" : "No"}
                          </Badge>
                        </div>
                        {selectedService.followUpDate && (
                          <div>
                            <Label className="font-semibold">
                              Follow-up Date
                            </Label>
                            <p>
                              {new Date(
                                selectedService.followUpDate
                              ).toLocaleDateString()}
                            </p>
                          </div>
                        )}
                      </div>
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

export default LegalAid;



