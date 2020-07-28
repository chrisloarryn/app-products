import {Component, OnInit} from '@angular/core';
import {ProductsService} from "../../providers/products.service";

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  constructor(public productsService: ProductsService) {
  }

  ngOnInit(): void {
  }

  async getAndStorageData() {
    const data = await this.productsService.fetchDataProducts();
    this.productsService.subjectProducts.next(data.data.stationsByUser)
  }

  deleteData() {
    this.productsService.subjectProducts.next(null)
  }
}
