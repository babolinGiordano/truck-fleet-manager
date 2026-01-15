import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { debounceTime, distinctUntilChanged, switchMap, tap, catchError, of, Subject } from 'rxjs';
import { SearchResponse, SearchResult } from '../../models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/search`;

  private searchSubject = new Subject<string>();

  // State con Signals
  private resultsSignal = signal<SearchResponse | null>(null);
  private loadingSignal = signal(false);
  private querySignal = signal('');

  // Public readonly signals
  readonly results = this.resultsSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly query = this.querySignal.asReadonly();

  constructor() {
    this.setupSearchPipeline();
  }

  private setupSearchPipeline(): void {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(query => {
        this.querySignal.set(query);
        if (query.length >= 2) {
          this.loadingSignal.set(true);
        }
      }),
      switchMap(query => {
        if (query.length < 2) {
          return of(null);
        }
        return this.http.get<SearchResponse>(this.apiUrl, { params: { q: query } }).pipe(
          catchError(err => {
            console.error('Search error:', err);
            return of(null);
          })
        );
      }),
      tap(() => this.loadingSignal.set(false))
    ).subscribe(results => {
      this.resultsSignal.set(results);
    });
  }

  search(query: string): void {
    this.searchSubject.next(query);
  }

  clearResults(): void {
    this.resultsSignal.set(null);
    this.querySignal.set('');
  }

  hasResults(): boolean {
    const results = this.resultsSignal();
    return results !== null && results.totalResults > 0;
  }
}
