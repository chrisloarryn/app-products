import { Component, OnInit } from "@angular/core";
import { ProductsService } from "../../providers/products.service";
import { BrowserModule } from "@angular/platform-browser";
import { NgxChartsModule } from "@swimlane/ngx-charts";

@Component({
  selector: "app-products",
  templateUrl: "./products.component.html",
  styleUrls: ["./products.component.scss"],
})
export class ProductsComponent implements OnInit {
  view: any[] = [700, 400];

  // options
  gradient: boolean = true;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;
  legendPosition: string = "below";
  dataMov = [];
  single = [];
  colorScheme = {
    domain: ["#5AA454", "#A10A28", "#C7B42C", "#AAAAAA", "#000000"],
  };
  constructor(public productsService: ProductsService) {}
  ngOnInit(): void {
    this.productsService.loadMovies().then((e) => {
      e.subscribe((data) => {
        data.map((movie) => {
          let item;
          let genre;
          if (movie.Genre.includes(",")) {
            genre = movie.Genre.split(",")[0];
          } else {
            genre = movie.Genre;
          }
          item = {
            [genre]: 1,
          };
          this.dataMov.push(item);
        });
        const reducedData = this.dataMov.reduce((total, movie) => {
          const [movieName] = Object.keys(movie);
          total[movieName] = total[movieName] || 0;
          total[movieName] += movie[movieName];
          return total;
        }, {});
        this.single = Object.keys(reducedData).map((cat) => {
          return { name: cat, value: reducedData[cat] };
        });
        console.log("data graphic loaded", this.single);
        console.log("data loaded", this.dataMov);
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

  onSelect(data): void {
    console.log("Item clicked", JSON.parse(JSON.stringify(data)));
  }

  onActivate(data): void {
    console.log("Activate", JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data): void {
    console.log("Deactivate", JSON.parse(JSON.stringify(data)));
  }
}
