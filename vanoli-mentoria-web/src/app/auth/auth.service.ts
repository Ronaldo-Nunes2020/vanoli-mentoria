import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'https://sua-api.com/auth';  // Substitua pela URL da sua API

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

  // Método de registro
  register(userData: { name: string, email: string, password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  // Método de login
  login(credentials: { email: string, password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  isLoggedIn(): Observable<boolean> {
    // Este é um exemplo básico. Ajuste conforme o mecanismo de autenticação.
    // Por exemplo, verifique se o token está presente no armazenamento local.
    const token = localStorage.getItem('token'); // Exemplo de verificação com token
    return of(!!token);
  }

  logout(): void {
    localStorage.removeItem('token'); // Exemplo: removendo o token do localStorage
  }

  showMessage(message: string): void {
    this.snackBar.open(message, 'Fechar', {
      duration: 3000
    });
  }
  
  
}

