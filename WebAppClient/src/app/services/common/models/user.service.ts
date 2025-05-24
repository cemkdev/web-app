import { Injectable } from '@angular/core';
import { HttpClientService } from '../http-client.service';
import { User } from '../../../entities/user';
import { Create_User } from '../../../contracts/users/create_user';
import { catchError, firstValueFrom, map, Observable } from 'rxjs';
import { List_User } from '../../../contracts/users/list_user';
import { HttpErrorResponse } from '@angular/common/http';
import { Role } from '../../../contracts/users/user_roles';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClientService: HttpClientService) { }

  // GET / LIST / READ
  async getAllUsers(page: number = 0, size: number = 10, successCallBack?: () => void, errorCallBack?: (errorMessage: string) => void): Promise<{ totalUserCount: number, users: List_User[] }> {
    const data = await firstValueFrom(
      this.httpClientService.get<{ totalUserCount: number, users: List_User[] }>({
        controller: "users",
        action: "get-all-users",
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

  // CREATE USER
  async create(user: User, callBackFunction?: () => void): Promise<Create_User> {
    const observable: Observable<Create_User | User> = this.httpClientService.post<Create_User | User>({
      controller: "users"
    }, user);
    callBackFunction();

    return await firstValueFrom(observable) as Create_User;
  }

  // UPDATE PASSWORD
  async updatePassword(userId: string, resetToken: string, password: string, passwordConfirm: string, successCallBack?: () => void, errorCallBack?: (error) => void) {
    const observable: Observable<any> = this.httpClientService.post({
      controller: "users",
      action: "password-update"
    }, {
      userId: userId,
      resetToken: resetToken,
      password: password,
      passwordConfirm: passwordConfirm
    });

    const promiseData: Promise<any> = firstValueFrom(observable);
    promiseData.then(value => successCallBack()).catch(error => errorCallBack(error));
    await promiseData;
  }

  // GET ROLES BY USERID
  async getRolesByUserId(userId: string, successCallBack?: () => void, errorCallBack?: (errorMessage: string) => void) {
    const data = await firstValueFrom(
      this.httpClientService.get<Role[]>({
        controller: "users",
        action: "get-roles-by-userid"
      }, userId).pipe(
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

  // ASSIGN ROLE
  async assignRoleToUser(userId: string, roles: string[], successCallBack?: () => void, errorCallBack?: (errorMessage: string) => void) {
    const observable: Observable<any> = this.httpClientService.post({
      controller: "users",
      action: "assign-role-user"
    }, {
      userId: userId,
      roles: roles
    });

    const promiseData = firstValueFrom(observable);
    promiseData.then(
      () => successCallBack()
    ).catch(
      error => errorCallBack(error)
    );

    await promiseData;
  }
}
