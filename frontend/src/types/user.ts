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

export interface Message {
  role: "user" | "assistant";
  content: string;
}

export interface Chat {
  _id: string;
  userId: string;
  persona: "hitesh" | "piyush";
  title?: string;
  createdAt: string;
  updatedAt: string;
}

export type Persona = Chat["persona"];
