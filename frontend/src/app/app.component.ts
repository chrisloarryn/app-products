import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductsService } from './providers/products.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public chats: Observable<any[]>;
  constructor(public productsService: ProductsService) {

  }

  title = 'firechat';
}
