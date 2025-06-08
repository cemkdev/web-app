import { Injectable } from '@angular/core';
import { HttpClientService } from '../http-client.service';
import { firstValueFrom, Observable } from 'rxjs';
import { BaseStorageUrl } from '../../../contracts/base_storage_url';

@Injectable({
    providedIn: 'root'
})
export class FileService {

    constructor(private httpClientService: HttpClientService) { }

    // GET - BaseStorageUrl
    async getBaseStorageUrl(): Promise<BaseStorageUrl> {
        const getObservable: Observable<BaseStorageUrl> = this.httpClientService.get<BaseStorageUrl>({
            controller: "files",
            action: "get-base-storage-url"
        });
        return await firstValueFrom(getObservable);
    }
}