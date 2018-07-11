import {Component, OnInit} from '@angular/core';
import {RolesManagementService} from '../../../core/services/roles.management.service';
import {AccordionConfig} from 'ngx-bootstrap';

export function getAccordionConfig(): AccordionConfig {
  return Object.assign(new AccordionConfig(), { closeOthers: true });
}
@Component({
  selector: 'app-roles-table',
  templateUrl: './roles-table.component.html',
  styleUrls: ['./roles-table.component.scss'],
  providers: [{ provide: AccordionConfig, useFactory: getAccordionConfig }]
})
export class RolesTableComponent implements OnInit {
  public permissionTable;
  public fieldArray: Array<any> = [];
  public newAttribute: any = {};

  constructor(private permissionsService: RolesManagementService) {
  }

  ngOnInit() {
    this.permissionsService.getPermissionTable()
      .subscribe((data) => {
        console.log(data);
        this.permissionsService.permissionTable = data;
        this.permissionTable = this.permissionsService.permissionTable;
        console.log(this.permissionTable);
      });
  }

  addFieldValue() {
    this.fieldArray.push(this.newAttribute);
    this.newAttribute = {};
  }

  deleteFieldValue(index) {
    this.fieldArray.splice(index, 1);
  }
}
