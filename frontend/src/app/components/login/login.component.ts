import { Component } from "@angular/core";
import { ProductsService } from "../../providers/products.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styles: [],
})
export class LoginComponent {
  constructor(public productsService: ProductsService) {}

  loginApp(provider: string) {
    this.productsService.login(provider);
  }
}
