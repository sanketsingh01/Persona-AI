export interface User {
  _id: string;
  name: string;
  email: string;
  avatar: {
    url: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;
}
