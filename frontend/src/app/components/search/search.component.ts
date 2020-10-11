import { Component, OnInit } from "@angular/core";
import { ProductsService } from "./../../providers/products.service";

@Component({
  selector: "app-search",
  templateUrl: "./search.component.html",
  styleUrls: ["./search.component.scss"],
})
export class SearchComponent implements OnInit {
  constructor(public productsService: ProductsService) {}
  inputSearch = "";
  async fetchMovie() {
    await this.productsService.fetchMovie(this.inputSearch);
  }
  ngOnInit(): void {}
}
