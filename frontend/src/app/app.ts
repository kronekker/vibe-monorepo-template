import { Component, OnInit, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppInfo, User, ApiResponse } from '@shared/index';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  private readonly http = inject(HttpClient);

  // Application State Signals
  protected readonly appInfo = signal<AppInfo | null>(null);
  protected readonly users = signal<User[]>([]);
  protected readonly error = signal<string | null>(null);

  ngOnInit() {
    this.fetchAppInfo();
    this.fetchUsers();
  }

  fetchAppInfo() {
    this.http.get<ApiResponse<AppInfo>>('/api/info').subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.appInfo.set(res.data);
        } else {
          this.error.set(res.error || 'Failed to fetch application info.');
        }
      },
      error: (err) => this.error.set(err.message)
    });
  }

  fetchUsers() {
    this.http.get<ApiResponse<User[]>>('/api/users').subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.users.set(res.data);
        } else {
          this.error.set(res.error || 'Failed to fetch users.');
        }
      },
      error: (err) => this.error.set(err.message)
    });
  }

  addUser(nameInput: HTMLInputElement, emailInput: HTMLInputElement) {
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();

    if (!name || !email) {
      alert('Please fill in both name and email.');
      return;
    }

    this.http.post<ApiResponse<User>>('/api/users', { name, email }).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          // Append new user to list
          this.users.update(prev => [...prev, res.data!]);
          // Reset form fields
          nameInput.value = '';
          emailInput.value = '';
        } else {
          alert(`Error: ${res.error}`);
        }
      },
      error: (err) => alert(`HTTP Error: ${err.message}`)
    });
  }
}
