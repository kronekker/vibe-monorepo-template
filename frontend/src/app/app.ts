import { Component, OnInit, signal, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppInfo, ApiResponse } from '@shared/index';
import { ThemeSelectorComponent } from './core/components/theme-selector/theme-selector';
import { BackendService } from './core/services/backend.service';

@Component({
  selector: 'app-root',
  imports: [RouterModule, ThemeSelectorComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  private readonly backendService = inject(BackendService);

  // Application State Signals
  protected readonly appInfo = signal<AppInfo | null>(null);
  protected readonly isSidebarOpen = signal(true);

  toggleSidebar() {
    this.isSidebarOpen.update(v => !v);
  }

  ngOnInit() {
    this.fetchAppInfo();
  }

  fetchAppInfo() {
    this.backendService.getAppInfo().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.appInfo.set(res.data);
        }
      },
      error: (err) => console.error('Failed to fetch application info:', err.message)
    });
  }
}
