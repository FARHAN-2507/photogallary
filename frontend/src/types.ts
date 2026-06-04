export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  photoCount: number;
}

export interface UploadedBy {
  id: string;
  name: string;
  email: string;
}

export interface Photo {
  id: string;
  originalName: string;
  cloudinaryUrl: string;
  mimeType: string;
  size: number;
  createdAt: string;
  url: string;
  uploadedBy?: UploadedBy | null;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
  hasMore: boolean;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
}

export interface PhotosResponse {
  success: boolean;
  photos: Photo[];
  pagination: Pagination;
}

export interface UploadResponse {
  success: boolean;
  message: string;
  photo: Photo;
}

export interface DeleteResponse {
  success: boolean;
  message: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthResponse>;
  register: (name: string, email: string, password: string, adminKey?: string) => Promise<AuthResponse>;
  logout: () => void;
  isAuthenticated: boolean;
}
