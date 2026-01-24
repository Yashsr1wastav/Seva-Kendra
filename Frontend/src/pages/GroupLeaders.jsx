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
import { Plus, Search, Edit, Trash2, Eye, Menu } from "lucide-react";
import { groupLeaderAPI } from "../services/api";
import Sidebar from "../components/Sidebar";
import usePermissions from "../hooks/usePermissions";

const GroupLeaders = () => {
  const { canCreate, canEdit, canDelete, canExport } = usePermissions();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [groupLeaders, setGroupLeaders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const [selectedLeader, setSelectedLeader] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    leaderId: "",
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    experience: "",
    qualifications: "",
    status: "Active",
  });

  // Fetch group leaders
  const fetchGroupLeaders = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        search: searchTerm,
      };

      const response = await groupLeaderAPI.getAll(params);
      setGroupLeaders(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      toast.error("Failed to fetch group leaders");
      console.error("Error fetching group leaders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroupLeaders();
  }, [pagination.page, pagination.limit, searchTerm]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = {
        ...formData,
        experience: parseInt(formData.experience) || 0,
        qualifications: formData.qualifications
          .split(",")
          .map((q) => q.trim())
          .filter((q) => q),
      };

      if (selectedLeader) {
        await groupLeaderAPI.update(selectedLeader._id, submitData);
        toast.success("Group leader updated successfully");
        setIsEditModalOpen(false);
      } else {
        await groupLeaderAPI.create(submitData);
        toast.success("Group leader created successfully");
        setIsCreateModalOpen(false);
      }

      fetchGroupLeaders();
      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    try {
      await groupLeaderAPI.delete(id);
      toast.success("Group leader deleted successfully");
      fetchGroupLeaders();
    } catch (error) {
      toast.error("Failed to delete group leader");
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      leaderId: "",
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      experience: "",
      qualifications: "",
      status: "Active",
    });
    setSelectedLeader(null);
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
  };

  // Open edit modal
  const openEditModal = (leader) => {
    setSelectedLeader(leader);
    setFormData({
      leaderId: leader.leaderId,
      firstName: leader.firstName,
      lastName: leader.lastName,
      email: leader.email,
      phoneNumber: leader.phoneNumber,
      experience: leader.experience?.toString() || "",
      qualifications: leader.qualifications?.join(", ") || "",
      status: leader.status,
    });
    setIsEditModalOpen(true);
  };

  // Open view modal
  const openViewModal = (leader) => {
    setSelectedLeader(leader);
    setIsViewModalOpen(true);
  };

  const statuses = ["Active", "Inactive", "On Leave"];

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-6 bg-background shadow-sm border-b lg:border-b-0 lg:justify-start lg:gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 text-muted-foreground hover:bg-secondary rounded-lg lg:hidden"
          >
            <Menu className="h-6 w-6" />
          </button>
          <h1 className="text-2xl font-bold text-foreground">Group Leaders</h1>
        </div>

        {/* Content Area */}
        <div className="p-6 space-y-6">
          {/* Controls */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setPagination((p) => ({ ...p, page: 1 }));
                  }}
                  className="pl-10"
                />
              </div>
            </div>
            {canCreate("education") && (
              <Dialog
                open={isCreateModalOpen}
                onOpenChange={setIsCreateModalOpen}
              >
                <DialogTrigger asChild>
                  <Button onClick={() => resetForm()} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Group Leader
                  </Button>
                </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-screen overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Group Leader</DialogTitle>
                  <DialogDescription>
                    Enter group leader details to add a new group leader to the
                    system.
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="leaderId">Leader ID *</Label>
                      <Input
                        id="leaderId"
                        value={formData.leaderId}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            leaderId: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            firstName: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            lastName: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            email: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phoneNumber">Phone Number *</Label>
                      <Input
                        id="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            phoneNumber: e.target.value,
                          })
                        }
                        placeholder="10 digit number"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="experience">Experience (years)</Label>
                      <Input
                        id="experience"
                        type="number"
                        value={formData.experience}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            experience: e.target.value,
                          })
                        }
                        min="0"
                      />
                    </div>
                    <div>
                      <Label htmlFor="status">Status</Label>
                      <Select
                        value={formData.status}
                        onValueChange={(value) =>
                          setFormData({
                            ...formData,
                            status: value,
                          })
                        }
                      >
                        <SelectTrigger id="status">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {statuses.map((status) => (
                            <SelectItem key={status} value={status}>
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="qualifications">
                      Qualifications (comma separated)
                    </Label>
                    <Input
                      id="qualifications"
                      value={formData.qualifications}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          qualifications: e.target.value,
                        })
                      }
                      placeholder="e.g., BA, MA, MSc"
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
                    <Button type="submit">Add Group Leader</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            )}
          </div>

          {/* Group Leaders Table */}
          <Card>
            <CardHeader>
              <CardTitle>Group Leaders List</CardTitle>
              <CardDescription>
                Manage all group leaders in the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : groupLeaders.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No group leaders found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Leader ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Experience</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {groupLeaders.map((leader) => (
                        <TableRow key={leader._id}>
                          <TableCell className="font-medium">
                            {leader.leaderId}
                          </TableCell>
                          <TableCell>
                            {leader.firstName} {leader.lastName}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {leader.email}
                          </TableCell>
                          <TableCell>{leader.phoneNumber}</TableCell>
                          <TableCell>{leader.experience || 0} years</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                leader.status === "Active"
                                  ? "default"
                                  : leader.status === "Inactive"
                                  ? "destructive"
                                  : "secondary"
                              }
                            >
                              {leader.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <button
                                onClick={() => openViewModal(leader)}
                                className="p-1 hover:bg-secondary rounded"
                                title="View"
                              >
                                <Eye className="h-4 w-4 text-blue-600" />
                              </button>
                              {canEdit("education") && (
                                <button
                                  onClick={() => openEditModal(leader)}
                                  className="p-1 hover:bg-secondary rounded"
                                  title="Edit"
                                >
                                  <Edit className="h-4 w-4 text-green-600" />
                                </button>
                              )}
                              {canDelete("education") && (
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <button
                                      className="p-1 hover:bg-secondary rounded"
                                      title="Delete"
                                    >
                                      <Trash2 className="h-4 w-4 text-red-600" />
                                    </button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>
                                        Delete Group Leader
                                      </AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to delete this group
                                        leader? This action cannot be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>
                                        Cancel
                                      </AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleDelete(leader._id)}
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
                </div>
              )}

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    Page {pagination.page} of {pagination.pages} (Total:{" "}
                    {pagination.total})
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() =>
                        setPagination((p) => ({
                          ...p,
                          page: Math.max(1, p.page - 1),
                        }))
                      }
                      disabled={pagination.page === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() =>
                        setPagination((p) => ({
                          ...p,
                          page: Math.min(p.pages, p.page + 1),
                        }))
                      }
                      disabled={pagination.page === pagination.pages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl max-h-screen overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Group Leader</DialogTitle>
            <DialogDescription>
              Update group leader information.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="editLeaderId">Leader ID *</Label>
                <Input
                  id="editLeaderId"
                  value={formData.leaderId}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      leaderId: e.target.value,
                    })
                  }
                  required
                  disabled
                />
              </div>
              <div>
                <Label htmlFor="editFirstName">First Name *</Label>
                <Input
                  id="editFirstName"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      firstName: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="editLastName">Last Name *</Label>
                <Input
                  id="editLastName"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      lastName: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="editEmail">Email *</Label>
                <Input
                  id="editEmail"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      email: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="editPhoneNumber">Phone Number *</Label>
                <Input
                  id="editPhoneNumber"
                  value={formData.phoneNumber}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      phoneNumber: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="editExperience">Experience (years)</Label>
                <Input
                  id="editExperience"
                  type="number"
                  value={formData.experience}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      experience: e.target.value,
                    })
                  }
                  min="0"
                />
              </div>
              <div>
                <Label htmlFor="editStatus">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      status: value,
                    })
                  }
                >
                  <SelectTrigger id="editStatus">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="editQualifications">
                Qualifications (comma separated)
              </Label>
              <Input
                id="editQualifications"
                value={formData.qualifications}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    qualifications: e.target.value,
                  })
                }
                placeholder="e.g., BA, MA, MSc"
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
              <Button type="submit">Update Group Leader</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Group Leader Details</DialogTitle>
          </DialogHeader>

          {selectedLeader && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Leader ID</p>
                  <p className="text-lg font-semibold">
                    {selectedLeader.leaderId}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Name</p>
                  <p className="text-lg font-semibold">
                    {selectedLeader.firstName} {selectedLeader.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p className="text-lg">{selectedLeader.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Phone</p>
                  <p className="text-lg">{selectedLeader.phoneNumber}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Experience
                  </p>
                  <p className="text-lg">
                    {selectedLeader.experience || 0} years
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <Badge
                    variant={
                      selectedLeader.status === "Active"
                        ? "default"
                        : selectedLeader.status === "Inactive"
                        ? "destructive"
                        : "secondary"
                    }
                  >
                    {selectedLeader.status}
                  </Badge>
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Qualifications
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedLeader.qualifications &&
                    selectedLeader.qualifications.length > 0 ? (
                      selectedLeader.qualifications.map((qual) => (
                        <Badge key={qual} variant="outline">
                          {qual}
                        </Badge>
                      ))
                    ) : (
                      <span>-</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GroupLeaders;
