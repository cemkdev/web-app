import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderDetailService } from '../../../../widgets/admin/services/order-detail.service';

@Component({
  selector: 'app-detail',
  standalone: false,
  templateUrl: './detail.component.html',
  styles: `
  .order-detail-widgets{
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    //grid-auto-rows: 150px;
    grid-auto-rows: auto;
    gap: 16px;
  }
  `
})
export class DetailComponent implements OnInit {

  store = inject(OrderDetailService)

  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.store.generateWidgets(id);
      }
    });
  }
}
