import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppInfo, ApiResponse, User, PythonRunResponse } from '@shared/index';

@Injectable({
  providedIn: 'root'
})
export class BackendService {
  private readonly http = inject(HttpClient);

  getAppInfo(): Observable<ApiResponse<AppInfo>> {
    return this.http.get<ApiResponse<AppInfo>>('/api/info');
  }

  getUsers(): Observable<ApiResponse<User[]>> {
    return this.http.get<ApiResponse<User[]>>('/api/users');
  }

  addUser(name: string, email: string): Observable<ApiResponse<User>> {
    return this.http.post<ApiResponse<User>>('/api/users', { name, email });
  }

  deleteUser(id: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`/api/users/${id}`);
  }

  runPythonScript(args: string[]): Observable<ApiResponse<PythonRunResponse>> {
    return this.http.post<ApiResponse<PythonRunResponse>>('/api/python-test', { args });
  }
}
