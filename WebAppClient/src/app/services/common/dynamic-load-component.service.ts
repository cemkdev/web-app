import { Injectable, ViewContainerRef } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DynamicLoadComponentService {

  // ComponentFactoryResolver: Deprecated edilmiştir. Artık inject edilmesine gerek yoktur. Doğal olarak return ederken de kullanılmaz. Direkt olarak "_component"'e atadığımız değeri döndürürüz.
  constructor() { }

  // ViewComponentRef: Dinamik olarak yüklenecek component'i içerisinde barındıran container'dır.
  async loadComponent(componentName: ComponentName, viewContainerRef: ViewContainerRef) {
    let _component: any = null;

    switch (componentName) {
      case ComponentName.BasketsComponent:
        _component = (await import("../../ui/components/baskets/baskets.component")).BasketsComponent;
        // case Component.CreateProductComponent:
        //   _component = await import("../../admin/components/...");
        break;
    }
    viewContainerRef.clear(); // Her dinamik yükleme sürecinde önceki view'leri clear etmemiz gerekmektedir. (Bilinen bir sorun yaratmasa da öngörülemeyecek hatalar için verilmesi gereken bu komutu atlamayalım.)
    return viewContainerRef.createComponent(_component);
    //Return ederken de direkt olarak "_component"'i göndermemiz yeterlidir.
  }
}

// Enum ile seçeceğiz hangi component'i bu service'e göndereceğimizi.
export enum ComponentName {
  BasketsComponent
  //CreateProductComponent
}