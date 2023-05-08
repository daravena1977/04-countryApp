import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, delay, map, of, tap } from 'rxjs';
import { Country } from '../interfaces/country';
import { CacheStore } from '../interfaces/cache-store.interface';

@Injectable({providedIn: 'root'})
export class CountriesService {

  private apiUrl: string = 'https://restcountries.com/v3.1';

  public cacheStore: CacheStore = {
    byCapital:   {term: '', countries: []},
    byCountries: {term: '', countries: []},
    byRegion:    {region: '', countries: []},
  }

  constructor(private http: HttpClient) {
      console.log('Countries Service init');
   }

  private getCountriesRequest(url: string): Observable<Country[]> {
    return this.http.get<Country[]>(url)
    .pipe(
      catchError (() => of([])),
      // delay(2000),
     )
  }

  searchCountryByAlphaCode( code: string): Observable<Country | null> {
    return this.http.get<Country[]>(`${this.apiUrl}/alpha/${code}`)
    .pipe(
      map( countries => countries.length > 0 ? countries[0] : null),
      catchError (() => of(null)),
    )
  }

  searchCapital(term: string):Observable<Country[]>  {
    const url = `${this.apiUrl}/capital/${term}`

    return this.getCountriesRequest(url)
      .pipe(
        tap( countries => this.cacheStore.byCapital = {term, countries: countries})
      )
  }

  searchCountry(term: string): Observable<Country[]> {
    const url = `${this.apiUrl}/name/${term}`

    return this.getCountriesRequest(url)
      .pipe(
        tap(countries => this.cacheStore.byCountries = {term, countries: countries})
      )
  }

  searchRegion(region: string): Observable<Country[]> {
    const url = `${this.apiUrl}/region/${region}`

    return this.getCountriesRequest(url)
      .pipe(
        tap(countries => this.cacheStore.byRegion = {region: '', countries: countries})
      )
  }

}
