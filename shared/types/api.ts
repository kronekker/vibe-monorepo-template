// Standard envelope for API responses
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Default interface for backend communication of configuration to frontend.
export interface AppInfo {
  name: string;
  subtitle: string;
  version: string;
  runtime: string;
  dbType: string;
}

// Example interface to go with the demo SqlLite database CRUD backend operations and user interface interaction
// This can be removed if sample db functionality is removed from the backend
export interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string;
}

// Example interface to go with the demo SqlLite database CRUD backend operations and user interface interaction
// This can be removed if sample db functionality is removed from the backend
export interface CreateUserRequest {
  name: string;
  email: string;
}

// Example interface to go with the demo SqlLite database CRUD backend operations and user interface interaction
// This can be removed if sample db functionality is removed from the backend
export interface PythonRunRequest {
  args: string[];
}

// Example interface to go with the demo SqlLite database CRUD backend operations and user interface interaction
// This can be removed if sample db functionality is removed from the backend
export interface PythonRunResponse {
  output: string;
}
