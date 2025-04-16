import { Inject, Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {

  constructor(@Inject("baseSignalRUrl") private baseSignalRUrl: string) { }

  //////// Bunlar Microsoft'un da sitesinde "ASP.NET Core SignalR JavaScript istemcisi" başlığında yer alıyor. Aslında direkt uygulanıyor sayılır oradaki bilgiler.

  // connection'ı tutacağımız field. HubConnection türünden.
  // private _connection: HubConnection;
  // get connection(): HubConnection { // Burada da dışarı açtık.
  //   return this._connection;
  // }

  // Başlatılmış bir hub dönecek.
  start(hubUrl: string) {
    hubUrl = this.baseSignalRUrl + hubUrl;

    // Öncelikle bir Hub oluşturmamız gerekiyor.
    // Bu builder bizim Hub'ı oluşturmamızı sağlaycak olan builder.
    // Yani bizim server'daki Hub ile bağlantı kuracak olan javascript'teki Hub'ı oluşturabilmemiz için bizim burada HubConnectionBuilder nesnesi oluşturmamız lazım.
    const builder: HubConnectionBuilder = new HubConnectionBuilder();
    // Bu builder üzerinden bizim bir tane hub yani HubConnection oluşturmamız lazım.
    const hubConnection: HubConnection = builder.withUrl(hubUrl)
      .withAutomaticReconnect()
      .build();
    // Connection'ı başlatıyoruz.
    hubConnection.start()
      .then(() => console.log("Connected")) // Bağlantı gerçekleştirildiyse...
      .catch(error => setTimeout(() => this.start(hubUrl), 2000)); // Bağlantı gerçekleştirilemediyse, 2 sn'de bir tekrar start'ı tetikle(recursive) ki bağlantı gelir gelmez yeniden start olsun.
    // Whatsapp'ın wifi gelince çat diye tüm mesajları alması gibi. O da wifi yokken arkada sürekli olarak kontrol ediyor.

    // if'in dışında ekstradan işlemlerimiz olacak. Ne gibi?
    // Gün gelecek, kurulan bu bağlantı kopacak ya da bu bağlantı koptuktan sonra kurulma süreci olacak.
    // Bağlantıyı tekrardan kurmaya çalışacağız. Ya da bu bağlantıyı tekrardan kurmaya çalışırken, bağlantı ister istemez kopacak ve kurulamayacak.
    // Bunun gibi durumları yönetmek isteyebiliriz. Bunun için;
    // --- if'in dışında artık _connection varmış gibi düüşünüyorum.
    hubConnection.onreconnected(connectionId => console.log("Reconnected."));
    hubConnection.onreconnecting(error => console.log("Reconnecting error!")); // Bu da kopan bağlantının tekrardan bağlanma sürecinde olduğunu ifade ediyor ve bir hata alırsan da buna yönelik bir işlem gerçekleştirebiliyorsun callback fonk. ile. Biz burada sadece console'a bastırdık durumu.
    hubConnection.onclose(error => console.log("Close reconnection.")); // Tekrardan bağlantı kurmaya çalıştın ve kuramadın. Burada bir hata verecek ve buna istinaden çalışmanı yapman gerekecek.

    return hubConnection;
  }

  // SignalR üzerinden herhangi bir client'ın, diğer client'lara mesaj gönderme ihtiyacı olursa, invoke'u kullanma durumu söz konusu olabilir.
  // Bir event fırlatmak gibi düşünebiliriz.
  // Buradan yazıyorum ve enter'a basıyorum ve bu method tetikleniyor ve karşı tarafa mesaj düşüyor.
  // Backend'de hangi fonksiyona bir mesaj göndereceksem bu fonksiyonun ismini burada parametreden almamız lazım.
  // Baya api'daki "ProductAddedMessageAsync()" method'una karşılık gelecek buradaki parametre karşıladığımız isim.
  invoke(hubUrl: string, procedureName: string, message: any, successCallback?: (value) => void, errorCallback?: (error) => void) {
    this.start(hubUrl).invoke(procedureName, message)
      .then(successCallback)
      .catch(errorCallback);
  }

  // Server'dan gelecek olan anlık mesajların hepsini runtime'da yakalamamızı sağlaycak olan temel alıcı fonksiyonları tanımlamızı sağlayan bir fonk.
  // Client olarak ben tetikleneceksem, bana bir mesaj gelecekse, hangi event tetiklenecekse onu buradan tetikliyor olacağım.
  on(hubUrl: string, procedureName: string, callBack: (...message: any) => void) {
    this.start(hubUrl).on(procedureName, callBack);
  }
}
