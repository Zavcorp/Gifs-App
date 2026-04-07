import { HttpClient } from '@angular/common/http';
import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { environment } from '@environments/environment';
import type { GiphyResponse } from '../interfaces/giphy.interfaces';
import { Gif } from '../interfaces/gif.interface';
import { GifMapper } from '../mapper/gif.mapper';
import { map,Observable, tap } from 'rxjs';


const loadFromLocalStorage = () => {
  const gifsFromLocalStorage = localStorage.getItem('gifs')  ?? '{}';
  const gifs = JSON.parse(gifsFromLocalStorage);

  return gifs;
}

@Injectable({providedIn: 'root'})
export class GifService {

  private http= inject(HttpClient);

  trendingGifs = signal<Gif[]>([]);
  trendingGifsLoading = signal(true);

  searchHistory = signal<Record<string, Gif[]>>(loadFromLocalStorage());
  searchHistoryKeys = computed( () => Object.keys(this.searchHistory()));

  constructor() {
    this.loadTrendingGifs();
  }

  //Efecto
  saveGifsToLocalStorage = effect(() => {
     const historyString = JSON.stringify(this.searchHistory());
     localStorage.setItem('gifs', historyString);
  })

  loadTrendingGifs() {
    this.http.
    get<GiphyResponse>(`${environment.giphyUrl}/gifs/trending`, {
       params: {
        api_key: environment.giphyApiKey,
        limit: 20,
       }
    }).subscribe((resp) => {
        const gifs = GifMapper.mapGiphyItemsToGitArray(resp.data);
        this.trendingGifs.set(gifs);
        this.trendingGifsLoading.set(false);
        console.log({gifs});
    });
  }

  searchGifs(query: string): Observable<Gif[]> {
     return this.http.
      get<GiphyResponse>(`${environment.giphyUrl}/gifs/search`, {
        params: {
          api_key: environment.giphyApiKey,
          q: query,
          limit: 20,
        }
      })
      .pipe(
        map(({ data }) => data),
        map((items) => GifMapper.mapGiphyItemsToGitArray(items)),

        //Historial
        tap((items) => {
          this.searchHistory.update( (history) => ({
            ...history,
            [query.toLowerCase()]: items,
          }))
        })

      );


    // .subscribe((resp) => {
    //     const gifs = GifMapper.mapGiphyItemsToGitArray(resp.data);
    //     console.log({ search: gifs});
    // });

  }

  getHistoryGifs(query: string): Gif[] {
      return this.searchHistory()[query] ?? [];
  }



}
