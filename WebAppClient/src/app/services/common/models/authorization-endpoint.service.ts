import { Injectable } from '@angular/core';
import { HttpClientService } from '../http-client.service';
import { catchError, firstValueFrom, map, Observable } from 'rxjs';
import { AssignRoleEndpoint } from '../../../entities/assign-role-endpoint';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationEndpointService {

  constructor(private httpClientService: HttpClientService) { }

  // GET
  async getRolesEndpoints(successCallBack?: (response: any) => void, errorCallBack?: (errorMessage: string) => void) {
    const data = await firstValueFrom(
      this.httpClientService.get<AssignRoleEndpoint[]>({
        controller: "endpoints",
        action: "get-roles-endpoints"
      }).pipe(
        map(response => {
          successCallBack && successCallBack(response);
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

  // POST
  async assignRoleEndpoints(rolesEndpoints: AssignRoleEndpoint[], successCallBack?: () => void, errorCallBack?: (errorMessage: string) => void) {
    const observable: Observable<any> = this.httpClientService.post({
      controller: "endpoints",
      action: "assign-role-endpoints"
    }, {
      rolesEndpoints: rolesEndpoints
    });

    const promiseData = observable.subscribe({
      next: successCallBack,
      error: errorCallBack
    });

    await promiseData;
  }
}
