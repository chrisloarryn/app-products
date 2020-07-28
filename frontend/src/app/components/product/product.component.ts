import {Component, OnInit} from '@angular/core';
import {ProductsService} from "../../providers/products.service";

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

  constructor(public productsService: ProductsService) {
  }

  ngOnInit(): void {

  }

}
