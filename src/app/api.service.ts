import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, retry } from 'rxjs/operators';

const apiBaseUrl = "http://localhost:8080/api/library"

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  
  
  constructor(private apiClient : HttpClient) {}

  getAllAuthors(): Observable<any> {
    return this.apiClient.get<any[]>(`${apiBaseUrl}/author`);
  }

  createAuthor(data): Observable<any> {
    console.log(data);
    return this.apiClient.post(apiBaseUrl+'/author', data);
  }

  createBook(book): Observable<any> {
    return this.apiClient.post(apiBaseUrl+'/book', book);
  }

  readBooks(): Observable<any> {
    return this.apiClient.get(apiBaseUrl+'/book');
  }

  readBook(bookId): Observable<any> {
    return this.apiClient.get(`${apiBaseUrl}/book/${bookId}`);
  }

  removeBook(bookId) : Observable<any> {
    return this.apiClient.delete(`${apiBaseUrl}/book/${bookId}`);
  }

  createAMember(member) : Observable<any> {
    return this.apiClient.post(apiBaseUrl+"/member", member);
  }

  lendABook(lend) : Observable<any> {
    return this.apiClient.post(apiBaseUrl+"/book/lend", lend);
  }

  updateBook(bookId, updateData): Observable<any> {
    return this.apiClient.patch(`${apiBaseUrl}/book/${bookId}`, updateData);
  }

  getMembers(): Observable<any>  {
    return this.apiClient.get(apiBaseUrl+'/member');
  }

  getMemberLentBooks(memberId: number) {
    return this.apiClient.get<any[]>(`${apiBaseUrl}/member/${memberId}/lentbooks`);
  }

  getAvailableBooksForMember(memberId: number) {
    return this.apiClient.get<any[]>(`${apiBaseUrl}/member/${memberId}/availablebooks`);
  }

  checkIsbnExists(isbn: string, excludeBookId?: number) {
    return this.apiClient.get<boolean>(`${apiBaseUrl}/book/check-isbn/${isbn}${excludeBookId ? '?excludeBookId=' + excludeBookId : ''}`);
  }
  
}
