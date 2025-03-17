import { Injectable } from '@angular/core';
import { HttpClientService } from '../http-client.service';
import { Create_Product } from '../../../contracts/create_product';
import { HttpErrorResponse } from '@angular/common/http';
import { List_Products } from '../../../contracts/list_products';
import { catchError, firstValueFrom, map, Observable } from 'rxjs';
import { List_Product_Image } from '../../../contracts/list_product_image';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private httpClientService: HttpClientService) { }

  // CREATE
  create(product: Create_Product, successCallBack?: any, errorCallBack?: (errorMessage: string) => void) {
    this.httpClientService.post({
      controller: "products"
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

  // LIST / READ
  async read(page: number = 0, size: number = 5, successCallBack?: () => void, errorCallBack?: (errorMessage: string) => void): Promise<{ totalCount: number, products: List_Products[] }> {

    //////////////////////////////////////////////////// deprecated
    // const promiseData: Promise<List_Products[]> = this.httpClientService.get<List_Products[]>({
    //   controller: "products"
    // }).toPromise();

    // promiseData.then(d => successCallBack())
    //   .catch((errorResponse: HttpErrorResponse) => errorCallBack(errorResponse.message));
    // return await promiseData;
    ////////////////////////////////////////////////////

    // try {
    //   const data: { totalCount: number, products: List_Products[] } = await firstValueFrom(
    //     this.httpClientService.get<{ totalCount: number, products: List_Products[] }>({
    //       controller: "products",
    //       queryString: `page=${page}&size=${size}`
    //     })
    //   );
    //   successCallBack();

    //   return data;
    // }
    // catch (errorResponse) {
    //   if (errorCallBack) {
    //     errorCallBack(errorResponse.message);
    //   }
    //   throw errorResponse;
    // }

    const data = await firstValueFrom(
      this.httpClientService.get<{ totalCount: number, products: List_Products[] }>({
        controller: "products",
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

  // DELETE
  async delete(id: string) {
    const deleteObservable: Observable<any> = this.httpClientService.delete<any>({
      controller: "products"
    }, id);

    await firstValueFrom(deleteObservable);
  }

  // LIST / READ - IMAGES
  async readImages(id: string, successCallBack?: () => void): Promise<List_Product_Image[]> {
    const getObservable: Observable<List_Product_Image[]> = this.httpClientService.get<List_Product_Image[]>({
      controller: "products",
      action: "getproductimages"
    }, id);

    const images: List_Product_Image[] = await firstValueFrom(getObservable);
    successCallBack();

    return images;
  }

  // DELETE - IMAGE
  async deleteImage(id: string, imageId: string, successCallBack?: () => void) {
    const deleteObservable = this.httpClientService.delete({
      controller: "products",
      action: "DeleteProductImage",
      queryString: `imageId=${imageId}`
    }, id);
    await firstValueFrom(deleteObservable);
    successCallBack();
  }
}
