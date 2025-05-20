import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../../base/base.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApplicationService } from '../../../services/common/models/application.service';
import { Action, Menu } from '../../../contracts/application-configurations/menu';

@Component({
  selector: 'app-authorize-menu',
  standalone: false,
  templateUrl: './authorize-menu.component.html'
})
export class AuthorizeMenuComponent extends BaseComponent implements OnInit {
  dataSource: Menu[] = [];

  constructor(
    spinner: NgxSpinnerService,
    private applicationService: ApplicationService
  ) {
    super(spinner);
  }
  async ngOnInit() {
    await this.getMenus();
  }

  childrenAccessor = (node: Menu | Action): any[] => {
    return (node as Menu).actions ?? [];
  };
  hasChild = (_: number, node: Menu | Action): boolean => {
    return Array.isArray((node as Menu).actions) && (node as Menu).actions.length > 0;
  };

  async getMenus(): Promise<void> {
    const menus: Menu[] = await this.applicationService.getAuthorizeDefinitionEndpoints();

    menus.forEach(menu => {
      menu.actions = (menu.actions ?? []).filter(action => !!action.definition);
    });
    this.dataSource = menus;
  }
}