import { Component, OnInit } from "@angular/core";
import { ProductsService } from "../../providers/products.service";
// import { BrowserModule } from "@angular/platform-browser";
// import { NgxChartsModule } from "@swimlane/ngx-charts";

@Component({
  selector: "app-products",
  templateUrl: "./products.component.html",
  styleUrls: ["./products.component.scss"],
})
export class ProductsComponent implements OnInit {
  constructor(public productsService: ProductsService) {}

  ngOnInit(): void {
    this.productsService.loadMovies().then((e) => {
      e.subscribe((data) => {
        console.log("data loaded");
      });
    });
  }

  async getAndStorageData() {
    const data = await this.productsService.fetchDataProducts();
    this.productsService.subjectProducts.next(data.data.stationsByUser);
  }

  deleteData() {
    this.productsService.dataMovie.next(null);
  }

  async saveMovie(movie?: any) {
    this.productsService.addMovie(movie);
  }
}
