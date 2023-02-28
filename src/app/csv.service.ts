import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class CsvService {
  constructor(private http: HttpClient) {}

  fetchCSV(): Observable<string> {
    return this.http.get("http://localhost:4200/assets/persons.csv", {
      responseType: "text",
    });
  }
}
