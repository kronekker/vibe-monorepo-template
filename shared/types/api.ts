export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface AppInfo {
  name: string;
  subtitle: string;
  version: string;
  runtime: string;
  dbType: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
}

export interface PythonRunRequest {
  args: string[];
}

export interface PythonRunResponse {
  output: string;
}
