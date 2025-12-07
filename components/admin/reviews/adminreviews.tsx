import {
  MoreVertical,
  ChevronDown,
  Star,
  Search,
  Filter,
  Trash2,
  Edit2,
  AlertCircle,
  CheckCircle,
  X,
} from "lucide-react";
import React, { useState, useEffect, useContext } from "react";
import { format } from "timeago.js";

import AdminAuthContext from "@/app/admin/context/AuthContext";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/app/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";

// Define interfaces for our types
interface Review {
  id: string;
  title: string;
  content: string;
  rating: number;
  user: string;
  username: string;
  course: string;
  created_at: string;
}

interface NotificationType {
  message: string;
  type: "success" | "error";
}

interface RatingStarsProps {
  rating: number;
}

const AdminReviewsPanel = () => {
  // Initialize reviews as an empty array with the correct type
  const { authTokens } = useContext(AdminAuthContext) || {};
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [filterRating, setFilterRating] = useState<string>("all");
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [notification, setNotification] = useState<NotificationType | null>(
    null
  );

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}api/admin/reviews/`,
          {
            headers: {
              Authorization: `Bearer ${authTokens?.access_token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("fetching data harishrestha", data);
        // Validate that data is an array before setting it
        if (Array.isArray(data)) {
          setReviews(data);
        } else {
          console.error("Received non-array data:", data);
          setReviews([]);
          showNotification("Error: Invalid data format received", "error");
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setReviews([]); // Set to empty array on error
        showNotification("Error loading reviews", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [authTokens]);

  const showNotification = (
    message: string,
    type: "success" | "error" = "success"
  ) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleDeleteReview = async (reviewId: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}api/admin/reviews/${reviewId}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${authTokens?.access_token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setReviews(reviews.filter((review) => review.id !== reviewId));
      showNotification("Review deleted successfully");
    } catch (error) {
      console.error("Error deleting review:", error);
      showNotification("Error deleting review", "error");
    }
    setDeleteDialogOpen(false);
  };

  // Ensure reviews is an array before filtering
  const filteredReviews = Array.isArray(reviews)
    ? reviews
        .filter((review) => {
          const matchesSearch =
            review.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            review.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            review.user
              ?.toString()
              .toLowerCase()
              .includes(searchTerm.toLowerCase());
          const matchesRating =
            filterRating === "all" || review.rating === parseInt(filterRating);
          return matchesSearch && matchesRating;
        })
        .sort((a, b) => {
          switch (sortBy) {
            case "newest":
              return (
                new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime()
              );
            case "oldest":
              return (
                new Date(a.created_at).getTime() -
                new Date(b.created_at).getTime()
              );
            case "highest":
              return b.rating - a.rating;
            case "lowest":
              return a.rating - b.rating;
            default:
              return 0;
          }
        })
    : [];

  const RatingStars: React.FC<RatingStarsProps> = ({ rating }) => (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, index) => (
        <Star
          key={index}
          size={16}
          className={index < rating ? "text-yellow-500" : "text-gray-500"}
        />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          Review Management
        </h1>
        <p className="text-gray-600">
          Manage and monitor user reviews across your platform
        </p>
      </div>

      {/* Controls Section */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search reviews..."
            className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:w-80"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filters */}
        <div className="flex gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter size={16} />
                Rating
                <ChevronDown size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setFilterRating("all")}>
                All Ratings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterRating("5")}>
                5 Stars
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterRating("4")}>
                4 Stars
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterRating("3")}>
                3 Stars
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterRating("2")}>
                2 Stars
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterRating("1")}>
                1 Star
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                Sort by
                <ChevronDown size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSortBy("newest")}>
                Newest First
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("oldest")}>
                Oldest First
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("highest")}>
                Highest Rating
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("lowest")}>
                Lowest Rating
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Reviews Grid */}
      {loading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, index) => (
            <Card key={index} className="animate-pulse">
              <CardContent className="p-6">
                <div className="mb-4 h-4 w-3/4 rounded bg-gray-200"></div>
                <div className="mb-4 h-4 w-1/2 rounded bg-gray-200"></div>
                <div className="mb-4 h-20 rounded bg-gray-200"></div>
                <div className="h-4 w-1/4 rounded bg-gray-200"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredReviews.map((review) => (
            <Card
              key={review.id}
              className="transition-shadow duration-300 hover:shadow-lg"
            >
              <CardContent className="p-6">
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <h3 className="mb-1 text-lg font-semibold text-gray-900">
                      {review.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      by {review.username}
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="size-8 p-0">
                        <MoreVertical className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedReview(review);
                          // Add edit logic
                        }}
                        className="flex items-center gap-2"
                      >
                        <Edit2 size={16} />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedReview(review);
                          setDeleteDialogOpen(true);
                        }}
                        className="flex items-center gap-2 text-red-600"
                      >
                        <Trash2 size={16} />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="mb-4">
                  <RatingStars rating={review.rating} />
                </div>

                <p className="mb-4 line-clamp-3 text-gray-700">
                  {review.content}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>
                    {/* {new Date(
                      Date.parse(review.created_at)
                    ).toLocaleDateString()} */}
                    {format(review.created_at)}
                  </span>
                  <span>Course: {review.course}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Review</DialogTitle>
          </DialogHeader>
          <p className="text-gray-600">
            Are you sure you want to delete this review? This action cannot be
            undone.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                selectedReview && handleDeleteReview(selectedReview.id)
              }
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Notification Toast */}
      {notification && (
        <div
          className={`fixed bottom-4 right-4 flex items-center gap-2 rounded-lg p-4 shadow-lg ${
            notification.type === "error"
              ? "bg-red-50 text-red-800"
              : "bg-green-50 text-green-800"
          }`}
        >
          {notification.type === "error" ? (
            <AlertCircle className="size-5" />
          ) : (
            <CheckCircle className="size-5" />
          )}
          <span>{notification.message}</span>
          <button
            onClick={() => setNotification(null)}
            className="ml-2 text-gray-500 hover:text-gray-700"
          >
            <X className="size-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminReviewsPanel;
