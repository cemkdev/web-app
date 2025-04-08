import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../../services/common/models/product.service';
import { List_Products, List_Products_UI } from '../../../../contracts/list_products';
import { ActivatedRoute } from '@angular/router';
import { FileService } from '../../../../services/common/models/file.service';
import { BaseStorageUrl } from '../../../../contracts/base_storage_url';

@Component({
  selector: 'app-list',
  standalone: false,
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent implements OnInit {

  baseStorageUrl: BaseStorageUrl;
  products: List_Products_UI[] = [];
  totalProductCount: number;
  currentPageNo: number;
  totalPageCount: number;
  productCountPerPage: number = 12;
  pageList: number[] = [];

  constructor(
    private productService: ProductService,
    private activatedRoute: ActivatedRoute,
    private fileService: FileService
  ) { }

  async ngOnInit() {

    this.activatedRoute.params.subscribe(async params => {

      this.baseStorageUrl = await this.fileService.getBaseStorageUrl();

      this.currentPageNo = parseInt(params["pageNo"] ?? 1);
      const data: { totalProductCount: number, products: List_Products[] } = await this.productService.read(this.currentPageNo - 1, this.productCountPerPage,
        () => {

        },
        errorMessage => {

        })
      this.manipulateProductData(data.products, this.baseStorageUrl.url);
      this.totalProductCount = data.totalProductCount;
      this.totalPageCount = Math.ceil(this.totalProductCount / this.productCountPerPage);

      this.pageList = [];

      if (this.totalPageCount > 5) {
        if (this.currentPageNo - 2 <= 0)
          for (let i = 1; i <= 5; i++)
            this.pageList.push(i);
        else if (this.currentPageNo + 2 >= this.totalPageCount)
          for (let i = this.totalPageCount - 4; i <= this.totalPageCount; i++)
            this.pageList.push(i);
        else
          for (let i = this.currentPageNo - 2; i <= this.currentPageNo + 2; i++)
            this.pageList.push(i);
      }
      else {
        for (let i = 1; i <= this.totalPageCount; i++)
          this.pageList.push(i);
      }
    })
  }

  manipulateProductData(sourceData: List_Products[], baseStorageUrl: string): void {
    this.products = [];

    for (let i = 0; i < sourceData.length; i++) {
      this.getStars(sourceData[i].rating);

      let [integerPart, fractionPart] = sourceData[i].price.toString().split('.');
      if (fractionPart == undefined)
        fractionPart = "00";

      let manipulatedData = {
        id: sourceData[i].id,
        name: sourceData[i].name,
        stock: sourceData[i].stock,
        priceIntegerPart: integerPart,
        priceFractionPart: fractionPart,
        dateCreated: sourceData[i].dateCreated,
        dateUpdated: sourceData[i].dateUpdated,
        title: sourceData[i].title,
        description: sourceData[i].description,
        rating: sourceData[i].rating,
        hasCover: !sourceData[i].productImageFiles.length ? false : Boolean(sourceData[i].productImageFiles.find(c => c.coverImage === true)),
        productImageFilePath: !sourceData[i].productImageFiles.length ? null : `${baseStorageUrl}/${sourceData[i].productImageFiles.find(c => c.coverImage == true).path}`
      };
      this.products.push(manipulatedData);
    }
  }

  getStars(rating: number): string[] {
    const stars = [];

    for (let i = 1; i <= 5; i++) {
      if (rating >= i) {
        stars.push('bi-star-fill');
      } else if (rating >= i - 0.5) {
        stars.push('bi-star-half');
      } else {
        stars.push('bi-star');
      }
    }
    return stars;
  }
}
