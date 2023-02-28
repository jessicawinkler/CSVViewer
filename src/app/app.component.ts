import { Component, OnInit } from "@angular/core";
import { CsvService } from "./csv.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  public title: string = "CSV-Viewer";

  private jsonData?: string;

  public tableHeaders?: string[];
  private tableRows: string[][] = [];
  private tableRowsRegex = /\"*\\r\\n/;

  private pageItemCount: number = 3;
  public currentPage: number = 1;
  public pagedData: string[][] = [];
  public pageCount: number = 0;
  public pageInput: string = "";

  constructor(private csvService: CsvService) {}

  ngOnInit() {
    this.fetchCSVData();
  }

  private fetchCSVData() {
    this.csvService.fetchCSV().subscribe((data: any) => {
      this.convertCSVDataForTable(data);
      this.setPageCount();
      this.setPageData();
    });
  }

  private convertCSVDataForTable(data: any) {
    this.jsonData = JSON.stringify(data);

    const splittedData = this.jsonData
      .substring(1, this.jsonData.length - 1)
      .split(this.tableRowsRegex);

    this.tableHeaders = splittedData[0].split(";");
    this.tableHeaders.unshift("No.");

    delete splittedData[0];

    splittedData.forEach((dataset: string) => {
      this.tableRows.push(dataset.split(";"));
    });

    for (let i = 0; i < this.tableRows.length; i++) {
      let page = (i + 1).toString();
      this.tableRows[i].unshift(page);
    }
  }

  private setPageData() {
    const startIndex =
      this.currentPage * this.pageItemCount - this.pageItemCount;
    const endIndex = this.currentPage * this.pageItemCount - 1;

    this.pagedData = [];
    for (let i = startIndex; i <= endIndex; i++) {
      this.pagedData.push(this.tableRows[i]);
    }
  }

  public setPageCount() {
    this.pageCount = Math.ceil(this.tableRows.length / this.pageItemCount);
  }

  public showLastPage() {
    this.currentPage = this.pageCount;
    this.setPageData();
  }

  public showNextPage() {
    if (this.currentPage < this.pageCount) {
      this.currentPage++;
      this.setPageData();
    }
  }

  public showPreviousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.setPageData();
    }
  }

  public showFirstPage() {
    this.currentPage = 1;
    this.setPageData();
  }

  public changePage() {
    const page = Number(this.pageInput);
    if (this.isValidPage(page)) this.currentPage = page;
    this.setPageData();
  }

  public isValidPage(page: number | string) {
    if (page === "") return true;

    if (typeof page === "string") page = Number(page);
    return page > 0 && page <= this.pageCount;
  }
}
