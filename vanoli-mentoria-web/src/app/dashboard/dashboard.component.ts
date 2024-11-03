import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  dashboardData: any;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token'); // Assumindo que o token está armazenado no localStorage
    if (token) {
      this.dashboardService.getDashboardData(token).subscribe(
        data => this.dashboardData = data,
        error => console.error('Erro ao carregar dados do dashboard:', error)
      );
    }
  }
}
