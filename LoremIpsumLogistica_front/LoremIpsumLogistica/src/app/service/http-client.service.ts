import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HttpClientService {
  private apiUrl = 'https://localhost:5001/';

  constructor(private http: HttpClient) { }

  get(link: string): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + link);
  }

  delete(id: number, link: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl + link}/${id}`);
  }

  getById(id: number, link: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl + link}/${id}`);
  }

  save(data: any, link: string): Observable<any> {
    return this.http.post(this.apiUrl + link, data, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      responseType: 'text'
    });
  }

  update(data: any, link: string): Observable<any> {
    return this.http.put(`${this.apiUrl + link}`, data, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      responseType: 'text'
    });
  }

  updateById(id: number, data: any, link: string): Observable<any> {
    return this.http.put(`${this.apiUrl + link}/${id}`, data, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      responseType: 'text'
    });
  }
}
