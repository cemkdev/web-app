import { Injectable } from '@angular/core';
import { HttpClientService } from '../http-client.service';
import { firstValueFrom, Observable } from 'rxjs';
import { Menu } from '../../../contracts/application-configurations/menu';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {

  constructor(private httpClientService: HttpClientService) { }

  // GETS API endpoint spesifications obtained through reflection during runtime.
  async getAuthorizeDefinitionEndpoints() {
    const observable: Observable<Menu[]> = this.httpClientService.get<Menu[]>({
      controller: "ApplicationServices",
      action: "get-authorize-definition-endpoints"
    });
    const menus = await firstValueFrom(observable);
    return menus;
  }
}
