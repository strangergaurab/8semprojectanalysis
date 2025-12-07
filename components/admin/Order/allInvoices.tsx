import React, { useEffect, useState, useContext } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box, Typography, Avatar, Chip } from "@mui/material";
import { AiOutlineMail } from "react-icons/ai";
import AdminAuthContext from "@/app/admin/context/AuthContext";
import { InvoiceData, RowData, AdminAuthContextType } from "./types";
import { fetchInvoices } from "./api";

const AllInvoices: React.FC = () => {
  const { authTokens } = useContext(AdminAuthContext) || {};
  const [invoices, setInvoices] = useState<RowData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getInvoices = async () => {
      if (!authTokens?.access_token) {
        setError("Authentication token not found");
        setLoading(false);
        return;
      }

      try {
        const data = await fetchInvoices(authTokens.access_token);
        const transformedData = data.map(
          (invoice: InvoiceData): RowData => ({
            id: invoice.id,
            invoiceName: invoice.name,
            username: invoice.user.username,
            email: invoice.user.email,
            courseTitle: invoice.course.title,
            price: invoice.course.price,
            userImage: invoice.user.image,
          })
        );
        setInvoices(transformedData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch invoices"
        );
      } finally {
        setLoading(false);
      }
    };

    getInvoices();
  }, [authTokens]);

  const columns: GridColDef[] = [
    {
      field: "invoiceName",
      headerName: "Invoice ID",
      flex: 0.7,
      minWidth: 130,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color="primary"
          variant="outlined"
          size="small"
          className="font-semibold"
        />
      ),
    },
    {
      field: "username",
      headerName: "User",
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <Box className="flex items-center gap-3">
          <Avatar
            src={params.row.userImage}
            alt={params.value}
            className="border-2 border-gray-200"
          />
          <Typography className="font-medium">{params.value}</Typography>
        </Box>
      ),
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <Typography className="text-gray-600">{params.value}</Typography>
      ),
    },
    {
      field: "courseTitle",
      headerName: "Course",
      flex: 1.2,
      minWidth: 250,
      renderCell: (params) => (
        <Typography className="font-medium text-blue-600">
          {params.value}
        </Typography>
      ),
    },
    {
      field: "price",
      headerName: "Price",
      flex: 0.5,
      minWidth: 100,
      renderCell: (params) => (
        <Typography className="font-semibold">
          ${Number(params.value).toFixed(2)}
        </Typography>
      ),
    },
    {
      field: "contact",
      headerName: "Contact",
      flex: 0.3,
      minWidth: 80,
      renderCell: (params) => (
        <a
          href={`mailto:${params.row.email}`}
          aria-label={`Email ${params.row.username}`}
        >
          <AiOutlineMail
            className="text-red-600 hover:text-blue-600"
            size={20}
          />
        </a>
      ),
    },
  ];

  if (!authTokens) {
    return (
      <Box className="p-8">
        <Typography color="error" variant="h6" align="center">
          Please log in to view invoices
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="p-8">
        <Typography color="error" variant="h6" align="center">
          Error: {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box className="p-6">
      <Typography
        variant="h4"
        component="h1"
        className="text-center font-bold mb-8 text-gray-800"
      >
        Premium User Invoices
      </Typography>

      <Box className="bg-white rounded-xl shadow-lg overflow-hidden">
        <DataGrid
          rows={invoices}
          columns={columns}
          loading={loading}
          checkboxSelection
          disableRowSelectionOnClick
          autoHeight
          pageSizeOptions={[10, 25, 50]}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 10 },
            },
          }}
          sx={{
            border: "none",
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#f8fafc",
              borderBottom: "2px solid #e2e8f0",
              "& .MuiDataGrid-columnHeaderTitle": {
                fontWeight: "600",
                color: "#475569",
              },
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "1px solid #f1f5f9",
            },
            "& .MuiDataGrid-row": {
              "&:hover": {
                backgroundColor: "#f8fafc",
              },
            },
            "& .MuiDataGrid-footerContainer": {
              borderTop: "2px solid #e2e8f0",
              backgroundColor: "#f8fafc",
            },
            "& .MuiCheckbox-root": {
              color: "#94a3b8",
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default AllInvoices;
