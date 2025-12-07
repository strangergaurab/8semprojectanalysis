export interface User {
  id: number;
  username: string;
  email: string;
  image: string;
}

export interface Course {
  id: number;
  title: string;
  price: string;
}

export interface InvoiceData {
  id: number;
  name: string;
  user: User;
  course: Course;
}

export interface RowData {
  id: number;
  invoiceName: string;
  username: string;
  email: string;
  courseTitle: string;
  price: string;
  userImage: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
}

export interface AdminAuthContextType {
  authTokens: AuthTokens | null;
}
