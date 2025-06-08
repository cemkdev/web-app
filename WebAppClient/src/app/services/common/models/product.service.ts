import { Injectable } from '@angular/core';
import { HttpClientService } from '../http-client.service';
import { Create_Product } from '../../../contracts/product/create_product';
import { HttpErrorResponse } from '@angular/common/http';
import { List_Product } from '../../../contracts/product/list_products';
import { catchError, firstValueFrom, map, Observable } from 'rxjs';
import { List_Product_Image } from '../../../contracts/product/list_product_image';
import { Update_Product } from '../../../contracts/product/update_product';
import { Product_By_Id } from '../../../contracts/product/product_by_id';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private httpClientService: HttpClientService) { }

  // LIST / READ
  async read(page: number = 0, size: number = 10, successCallBack?: () => void, errorCallBack?: (errorMessage: string) => void): Promise<{ totalProductCount: number, products: List_Product[] }> {

    const data = await firstValueFrom(
      this.httpClientService.get<{ totalProductCount: number, products: List_Product[] }>({
        controller: "products",
        action: "get-all-products",
        queryString: `page=${page}&size=${size}`
      }).pipe(
        map(response => {
          successCallBack && successCallBack();
          return response;
        }),
        catchError((errorResponse: HttpErrorResponse) => {
          if (errorCallBack) {
            errorCallBack(errorResponse.message);
          }
          return [];
        })
      )
    );
    return data;
  }

  // READ BY ID
  async readById(id: string, successCallBack?: () => void, errorCallBack?: (errorMessage: string) => void): Promise<Product_By_Id> {

    const data = await firstValueFrom(
      this.httpClientService.get<Product_By_Id>({
        controller: "products",
        action: "get-product-by-id"
      }, id).pipe(
        map(response => {
          successCallBack && successCallBack();
          return response;
        }),
        catchError((errorResponse: HttpErrorResponse) => {
          if (errorCallBack) {
            errorCallBack(errorResponse.message);
          }
          return [];
        })
      )
    );
    return data;
  }

  // CREATE
  create(product: Create_Product, successCallBack?: any, errorCallBack?: (errorMessage: string) => void) {
    this.httpClientService.post({
      controller: "products",
      action: "create-product"
    }, product)
      .subscribe({
        next: result => {
          successCallBack();
        },
        error: (errorResponse: HttpErrorResponse) => {
          const _error: Array<{ key: string, value: Array<string> }> = errorResponse.error;
          let message = "";
          _error.forEach((v, index) => {
            v.value.forEach((_v, _index) => {
              message += `${_v}<br>`;
            });
          });
          errorCallBack(message);
        }
      });
  }

  // PUT / UPDATE
  update(product: Update_Product, successCallBack?: any, errorCallBack?: (errorMessage: string) => void) {
    this.httpClientService.put({
      controller: "products",
      action: "update-product"
    }, product)
      .subscribe({
        next: result => {
          successCallBack();
        },
        error: (errorResponse: HttpErrorResponse) => {
          const _error: Array<{ key: string, value: Array<string> }> = errorResponse.error;
          let message = "";
          _error.forEach((v, index) => {
            v.value.forEach((_v, _index) => {
              message += `${_v}<br>`;
            });
          });
          errorCallBack(message);
        }
      });
  }

  // DELETE
  async delete(id: string) {
    const deleteObservable: Observable<any> = this.httpClientService.delete<any>({
      controller: "products"
    }, id);

    await firstValueFrom(deleteObservable);
  }

  // DELETE RANGE - POST
  async deleteRange(productIds: string[]) {
    const deleteObservable: Observable<any> = this.httpClientService.deleteRange<any>({
      controller: "products",
      action: "delete-range-of-products"
    }, {
      productIds
    });

    await firstValueFrom(deleteObservable);
  }

  // LIST / READ - IMAGES
  async readImages(id: string, successCallBack?: () => void): Promise<List_Product_Image[]> {
    const getObservable: Observable<List_Product_Image[]> = this.httpClientService.get<List_Product_Image[]>({
      controller: "products",
      action: "get-product-images-by-product-id"
    }, id);

    const images: List_Product_Image[] = await firstValueFrom(getObservable);
    successCallBack();

    return images;
  }

  // DELETE - IMAGE
  async deleteImage(id: string, imageId: string, successCallBack?: () => void) {
    const deleteObservable = this.httpClientService.delete({
      controller: "products",
      action: "delete-product-image",
      queryString: `imageId=${imageId}`
    }, id);
    await firstValueFrom(deleteObservable);
    successCallBack();
  }

  // CHANGE - COVER IMAGE
  async changeCoverImage(imageId: string, productId: string, successCallBack?: () => void): Promise<void> {
    const changeCoverImageObservable = this.httpClientService.put({
      controller: "products",
      action: "change-cover-image",
      queryString: `imageId=${imageId}&productId=${productId}`
    }, {});
    await firstValueFrom(changeCoverImageObservable);
    successCallBack();
  }
}
