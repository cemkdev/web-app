import { Component, OnInit, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApplicationService } from '../../../services/common/models/application.service';
import { BaseComponent } from '../../../base/base.component';
import { Menu } from '../../../contracts/application-configurations/menu';
import { AlertifyService } from '../../../services/admin/alertify.service';

@Component({
  selector: 'app-role-access',
  standalone: false,
  templateUrl: './role-access.component.html'
})
export class RoleAccessComponent extends BaseComponent implements OnInit {
  data: Menu[] = [];

  roles = ['User', 'Manager', 'Admin', 'Editor', 'Supervisor']; // Example roles
  availableRoles = ['User', 'Manager', 'Admin', 'Editor', 'Supervisor']; // Initially all roles available
  selectedRoles: string[] = ['User', 'Manager', 'Admin']; // Initially selected roles

  permissions: { [code: string]: { [role: string]: boolean } } = {};

  constructor(
    spinner: NgxSpinnerService,
    private alertify: AlertifyService,
    private applicationService: ApplicationService
  ) {
    super(spinner);
  }
  async ngOnInit() {
    await this.getMenus();

    for (const module of this.data) {
      for (const action of module.actions) {
        this.permissions[action.code] = {};
        for (const role of this.roles) {
          this.permissions[action.code][role] = false;
        }
      }
    }
    this.initRoles(); // Başlangıçta seçilen roller için `availableRoles` güncellemesi
  }
  async getMenus(): Promise<void> {
    this.data = await this.applicationService.getAuthorizeDefinitionEndpoints();
  }

  // Başlangıçta seçilen rollerin availableRoles'dan çıkarılmasını sağla
  initRoles() {
    for (let role of this.selectedRoles) {
      this.removeRoleFromAvailable(role);
    }
  }

  addRole(role: string) {
    // Eğer zaten 4 rol seçildiyse, yeni rol eklenmesin
    if (this.selectedRoles.length < 4) {
      // Yeni rolü selectedRoles'a ekleyelim
      this.selectedRoles.push(role);
      // Eklenen rolü availableRoles'dan kaldıralım
      this.removeRoleFromAvailable(role);
    } else {
      // 4 rol seçildiğinde yeni rol eklenemez, kullanıcıya uyarı gösterilebilir
      alert('You can only select up to 4 roles.');
    }
  }

  @ViewChild('roleSelect') roleSelect!: any;
  removeRole(role: string) {
    const index = this.selectedRoles.indexOf(role);
    if (index > -1) {
      this.selectedRoles.splice(index, 1);
      this.addRoleToAvailable(role);

      // Force UI update
      this.availableRoles = [...this.availableRoles];

      // Seçimi sıfırla (select'i temizle)
      if (this.roleSelect) {
        this.roleSelect.writeValue(null);
      }
    }
  }

  removeRoleFromAvailable(role: string) {
    const index = this.availableRoles.indexOf(role);
    if (index > -1) {
      this.availableRoles.splice(index, 1);
    }
  }

  addRoleToAvailable(role: string) {
    if (this.availableRoles.indexOf(role) === -1) {
      this.availableRoles.push(role);
    }
  }
}
