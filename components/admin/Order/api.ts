import { InvoiceData } from "@/app/components/admin/Order/types";
export const fetchInvoices = async (
  authToken: string
): Promise<InvoiceData[]> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/admin/invoices`,
    {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data;
};
