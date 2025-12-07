import { Box, Button, Modal, TextField } from "@mui/material"; // Import TextField
import { DataGrid, GridRenderCellParams } from "@mui/x-data-grid";
import React, { FC, useEffect, useState, useContext } from "react";
import toast from "react-hot-toast";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai"; // Import AiOutlineEdit
import { format } from "timeago.js";

import AdminAuthContext from "@/app/admin/context/AuthContext";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/app/components/ui/avatar";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/app/components/ui/hover-card";
import Loader from "../../user/Loader";

const AllUsers: FC = () => {
  const { authTokens } = useContext(AdminAuthContext) || {};
  const [isLoading, setIsLoading] = useState(true);
  const [, setError] = useState<Error | null>(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [userId, setUserId] = useState("");
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    courses_bought: 0,
  });

  interface User {
    id: string;
    username: string;
    email: string;
    date_joined: string;
    image: string;
    courses_bought: number;
  }
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}api/admin/users/`,
          {
            headers: {
              Authorization: `Bearer ${authTokens?.access_token}`,
            },
          }
        );
        const data = await response.json();

        if (Array.isArray(data)) {
          setUsers(data);
        } else {
          console.error("API response is not an array", data);
          setUsers([]);
        }

        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError(
          err instanceof Error ? err : new Error("An unknown error occurred")
        );
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [authTokens]);

  const handleDelete = async () => {
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}api/admin/users/${userId}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${authTokens?.access_token}`,
          },
        }
      );
      toast.success("User deleted successfully");
      setOpenDelete(false);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}api/admin/users/`,
        {
          headers: {
            Authorization: `Bearer ${authTokens?.access_token}`,
          },
        }
      );
      const data = await response.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error deleting user", err);
      toast.error("Failed to delete user");
    }
  };

  const handleEdit = async () => {
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}api/admin/users/${userId}/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authTokens?.access_token}`,
          },
          body: JSON.stringify(userData),
        }
      );
      toast.success("User updated successfully");
      setOpenEdit(false);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}api/admin/users/`,
        {
          headers: {
            Authorization: `Bearer ${authTokens?.access_token}`,
          },
        }
      );
      const data = await response.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log("Error updating user", err);
      toast.error("Failed to update user");
    }
  };

  const openEditModal = async (id: string) => {
    setUserId(id);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}api/admin/users/${id}/`,
        {
          headers: {
            Authorization: `Bearer ${authTokens?.access_token}`,
          },
        }
      );
      const data = await response.json();
      setUserData({
        username: data.username,
        email: data.email,
        courses_bought: data.courses_bought,
      });
      setOpenEdit(true);
    } catch (err) {
      console.error("Error fetching user data:", err);
    }
  };

  return (
    <div className="ml-[14px] mt-[10px]">
      {isLoading ? (
        <Loader className="border-gray-800" />
      ) : (
        <Box m="20px">
          <Box
            m="40px 0 0 0"
            height="80vh"
            sx={{
              "@media (max-width: 768px)": {
                overflow: "auto",
                "& .MuiDataGrid-root": {
                  minWidth: "1200px", // This ensures the table maintains its width on mobile
                },
                "& .MuiDataGrid-virtualScroller": {
                  overflow: "visible",
                },
              },

              "& .MuiDataGrid-root": {
                border: "none",
              },
              "& .MuiDataGrid-row": {
                borderBottom: "1px solid #ccc",
                "&:hover": {
                  backgroundColor: "#f5f5f5",
                },
              },
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#f0f0f0",
                borderBottom: "1px solid #ccc",
                fontWeight: "bold",
                fontSize: "16px",
              },
              "& .MuiDataGrid-footerContainer": {
                backgroundColor: "#f0f0f0",
              },
            }}
          >
            <DataGrid
              checkboxSelection
              rows={users.map((user: User) => ({
                id: user.id,
                username: user.username,
                email: user.email,
                date_joined: user.date_joined,
                image: user.image,
                courses_bought: user.courses_bought,
              }))}
              columns={[
                { field: "id", headerName: "ID", flex: 0.3 },
                { field: "username", headerName: "Username", flex: 0.5 },
                { field: "email", headerName: "Email", flex: 0.5 },
                {
                  field: "date_joined",
                  headerName: "Join At",
                  flex: 0.5,
                  renderCell: (params: GridRenderCellParams) => (
                    <span>{format(params.row.date_joined)}</span>
                  ),
                },
                {
                  field: "edit",
                  headerName: "Edit",
                  flex: 0.2,
                  renderCell: (params: GridRenderCellParams) => (
                    <Button
                      onClick={() => openEditModal(params.row.id)}
                      style={{
                        backgroundColor: "#3f51b5",
                        color: "#fff",
                        padding: "5px 10px",
                        textTransform: "none",
                        fontWeight: "bold",
                      }}
                    >
                      <AiOutlineEdit size={20} />
                    </Button>
                  ),
                },
                {
                  field: "delete",
                  headerName: "Delete",
                  flex: 0.2,
                  renderCell: (params: GridRenderCellParams) => (
                    <Button
                      onClick={() => {
                        setOpenDelete(true);
                        setUserId(params.row.id);
                      }}
                      style={{
                        backgroundColor: "#f44336",
                        color: "#fff",
                        padding: "5px 10px",
                        textTransform: "none",
                        fontWeight: "bold",
                      }}
                    >
                      <AiOutlineDelete size={20} />
                    </Button>
                  ),
                },
                {
                  field: "image",
                  headerName: "Image",
                  flex: 0.5,
                  renderCell: (params: GridRenderCellParams) => (
                    <HoverCard>
                      <HoverCardTrigger>
                        <Avatar>
                          <AvatarImage
                            src={params.row.image}
                            alt={params.row.username}
                          />
                          <AvatarFallback>?</AvatarFallback>
                        </Avatar>
                      </HoverCardTrigger>
                      <HoverCardContent className="rounded-lg border border-gray-200 bg-white p-4 shadow-lg">
                        <div className="flex flex-col items-center">
                          <Avatar className="mb-4 size-32">
                            <AvatarImage
                              src={params.row.image}
                              alt={params.row.username}
                              style={{
                                width: "100%",
                                height: "100%",
                                borderRadius: "50%",
                              }}
                            />
                            <AvatarFallback className="text-2xl font-bold text-gray-400">
                              ?
                            </AvatarFallback>
                          </Avatar>
                          <h4 className="mb-2 text-xl font-semibold text-gray-800">
                            {params.row.username}
                          </h4>
                          <p className="mb-1 text-sm text-gray-600">
                            {params.row.email}
                          </p>
                          <p className="text-sm text-gray-500">
                            Joined: {format(params.row.date_joined)}
                          </p>
                        </div>
                      </HoverCardContent>
                    </HoverCard>
                  ),
                },
                { field: "courses_bought", headerName: "Purchase", flex: 0.5 },
              ]}
            />
          </Box>
          {openDelete && (
            <Modal open={openDelete} onClose={() => setOpenDelete(false)}>
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: 400,
                  bgcolor: "background.paper",
                  border: "2px solid #000",
                  boxShadow: 24,
                  p: 4,
                }}
              >
                <h2>Delete User</h2>
                <p>Are you sure you want to delete this user?</p>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleDelete}
                >
                  Confirm
                </Button>
                <Button variant="outlined" onClick={() => setOpenDelete(false)}>
                  Cancel
                </Button>
              </Box>
            </Modal>
          )}
          {openEdit && (
            <Modal open={openEdit} onClose={() => setOpenEdit(false)}>
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: 400,
                  bgcolor: "background.paper",
                  border: "2px solid #000",
                  boxShadow: 24,
                  p: 4,
                }}
              >
                <h2>Edit User</h2>
                <TextField
                  label="Username"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={userData.username}
                  onChange={(e) =>
                    setUserData({ ...userData, username: e.target.value })
                  }
                />
                <TextField
                  label="Email"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={userData.email}
                  onChange={(e) =>
                    setUserData({ ...userData, email: e.target.value })
                  }
                />
                <TextField
                  label="Courses Bought"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  type="number"
                  value={userData.courses_bought}
                  onChange={(e) =>
                    setUserData({
                      ...userData,
                      courses_bought: +e.target.value,
                    })
                  }
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleEdit}
                >
                  Save Changes
                </Button>
                <Button variant="outlined" onClick={() => setOpenEdit(false)}>
                  Cancel
                </Button>
              </Box>
            </Modal>
          )}
        </Box>
      )}
    </div>
  );
};
export default AllUsers;
