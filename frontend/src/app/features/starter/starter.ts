import { Component, OnInit, signal, inject } from '@angular/core';
import { User, ApiResponse, PythonRunResponse } from '@shared/index';
import { BackendService } from '../../core/services/backend.service';

@Component({
  selector: 'app-starter',
  standalone: true,
  templateUrl: './starter.html',
  styles: [`
    .vb-delete-btn {
      background: none;
      border: none;
      padding: var(--space-1);
      color: var(--color-text-muted);
      opacity: 0.5;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: var(--radius-sm);
      transition: all var(--transition-fast);
    }
    .vb-delete-btn:hover {
      color: var(--color-error);
      background-color: hsla(0, 85%, 60%, 0.1);
      opacity: 1;
    }
    .vb-delete-btn:focus-visible {
      outline: 2px solid var(--color-error);
    }
  `]
})
export class Starter implements OnInit {
  private readonly backendService = inject(BackendService);

  protected readonly users = signal<User[]>([]);
  protected readonly error = signal<string | null>(null);
  protected readonly pythonOutput = signal<string | null>(null);
  protected readonly isPythonRunning = signal<boolean>(false);

  ngOnInit() {
    this.fetchUsers();
  }

  fetchUsers() {
    this.backendService.getUsers().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.users.set(res.data);
        } else {
          this.error.set(res.error || 'Failed to fetch users.');
        }
      },
      error: (err: any) => this.error.set(err.error?.error || err.message)
    });
  }

  addUser(nameInput: HTMLInputElement, emailInput: HTMLInputElement) {
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();

    if (!name || !email) {
      alert('Please fill in both name and email.');
      return;
    }

    this.backendService.addUser(name, email).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.users.update(prev => [...prev, res.data!]);
          nameInput.value = '';
          emailInput.value = '';
        } else {
          alert(`Error: ${res.error}`);
        }
      },
      error: (err: any) => alert(`HTTP Error: ${err.error?.error || err.message}`)
    });
  }

  deleteUser(id: number) {
    if (!confirm('Are you sure you want to delete this user?')) {
      return;
    }

    this.backendService.deleteUser(id).subscribe({
      next: (res) => {
        if (res.success) {
          this.users.update(prev => prev.filter(user => user.id !== id));
        } else {
          alert(`Error: ${res.error}`);
        }
      },
      error: (err: any) => alert(`HTTP Error: ${err.error?.error || err.message}`)
    });
  }

  runPythonScript(argInput: HTMLInputElement) {
    const arg = argInput.value.trim();
    const args = arg ? [arg] : [];
    
    this.isPythonRunning.set(true);
    this.pythonOutput.set(null);
    this.error.set(null);

    this.backendService.runPythonScript(args).subscribe({
      next: (res) => {
        this.isPythonRunning.set(false);
        if (res.success && res.data) {
          this.pythonOutput.set(res.data.output);
        } else {
          this.error.set(res.error || 'Failed to run python script.');
        }
      },
      error: (err: any) => {
        this.isPythonRunning.set(false);
        this.error.set(err.error?.error || err.message);
      }
    });
  }
}
