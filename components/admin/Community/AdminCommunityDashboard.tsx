import { Loader2, Plus, Search } from "lucide-react";
import { getImageUrl, uploadFile } from "../helper/helper";
import React, { useState, useEffect, useContext, useCallback } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import AdminAuthContext from "@/app/admin/context/AuthContext";
import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/app/components/ui/dialog";
import { Input } from "@/app/components/ui/input";
import { ScrollArea } from "@/app/components/ui/scroll-area";

interface Community {
  id: number;
  course: number;
  title: string;
  image: string | null | File;
}

interface Course {
  id: number;
  title: string;
  description: string;
  instructor: string;
  skills: string[];
}

interface CommunityForm {
  course: number;
  title: string;
  image: string | null;
}

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}api/admin`;

const AdminCommunityDashboard = () => {
  const router = useRouter();
  const { authTokens } = useContext(AdminAuthContext) || {};
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [communities, setCommunities] = useState<Community[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [uploading, setUploading] = useState(false);

  const [communityForm, setCommunityForm] = useState<CommunityForm>({
    course: 0,
    title: "",
    image: null,
  });

  const handleFileUploadAndView = async (file: File) => {
    try {
      setUploading(true);
      const { cdnUrl, uploadUrl } = await uploadFile(file);
      const imageUrl = await getImageUrl(cdnUrl);
      setCommunityForm((prev) => ({
        ...prev,
        image: imageUrl,
      }));
      toast.success("Image uploaded successfully!");
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      await handleFileUploadAndView(file);
    }
  };

  const fetchCommunities = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/communities/`, {
        headers: {
          Authorization: `Bearer ${authTokens?.access_token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch communities");
      const data = await response.json();
      setCommunities(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to fetch data");
      toast.error("Failed to load communities");
    } finally {
      setIsLoading(false);
    }
  }, [authTokens]);

  const handleCreateCommunity = async () => {
    if (!communityForm.course || !communityForm.title) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("course", communityForm.course.toString());
      formData.append("title", communityForm.title);
      formData.append("image", communityForm.image || "");

      const response = await fetch(`${API_BASE_URL}/communities/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authTokens?.access_token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to create community");
      }

      await response.json();
      setCommunityForm({ course: 0, title: "", image: null });
      fetchCommunities();
      toast.success("Community created successfully");
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Community creation error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to create community"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCommunities();
  }, [fetchCommunities]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}api/courses/`,
          {
            headers: {
              Authorization: `Bearer ${authTokens?.access_token}`,
            },
          }
        );
        const courseData = await response.json();
        setCourses(courseData);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      }
    };

    fetchCourses();
  }, [authTokens?.access_token]);

  const handleCommunityClick = (communityId: number) => {
    router.push(`/admin/Community/${communityId}`);
  };

  return (
    <div className="container mx-auto p-4 lg:p-6">
      <Card>
        <CardHeader>
          <CardTitle>Community Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search communities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Community
              </Button>
            </div>

            <ScrollArea className="h-[600px] rounded-md border">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                {communities
                  .filter((c) =>
                    c.title.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((community) => (
                    <Card
                      key={community.id}
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => handleCommunityClick(community.id)}
                    >
                      <CardHeader className="p-0">
                        {community.image ? (
                          <div className="relative h-40 w-full">
                            <img
                              src={
                                typeof community.image === "string"
                                  ? community.image
                                  : undefined
                              }
                              alt={community.title}
                              className="object-cover w-full h-full rounded-t-lg"
                            />
                          </div>
                        ) : (
                          <div className="h-40 bg-muted flex items-center justify-center rounded-t-lg">
                            <span className="text-muted-foreground">
                              No Image
                            </span>
                          </div>
                        )}
                      </CardHeader>
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <div className="text-sm text-muted-foreground">
                            ID: {community.id}
                          </div>
                          <h3 className="font-semibold line-clamp-1">
                            {community.title}
                          </h3>
                          {community.course && (
                            <p className="text-sm text-muted-foreground line-clamp-1">
                              Course: {community.course}
                            </p>
                          )}
                          <Button variant="ghost" size="sm" className="w-full">
                            View Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </ScrollArea>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Community</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 w-full">
            <select
              value={communityForm.course || ""}
              onChange={(e) =>
                setCommunityForm({
                  ...communityForm,
                  course: parseInt(e.target.value) || 0,
                })
              }
              className="w-full p-2 border rounded-md"
            >
              <option value="">Select a Course</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>

            <Input
              placeholder="Title"
              value={communityForm.title}
              onChange={(e) =>
                setCommunityForm({
                  ...communityForm,
                  title: e.target.value,
                })
              }
            />
            <input
              type="file"
              id="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateCommunity} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...
                </>
              ) : (
                "Create Community"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCommunityDashboard;
