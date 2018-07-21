import {Component, OnInit} from '@angular/core';
import {RolesManagementService} from '../../services/roles.management.service';
import {AccordionConfig} from 'ngx-bootstrap';

export function getAccordionConfig(): AccordionConfig {
  return Object.assign(new AccordionConfig(), {closeOthers: true});
}

@Component({
  selector: 'app-roles-table',
  templateUrl: './roles-table.component.html',
  styleUrls: ['./roles-table.component.scss'],
  providers: [{provide: AccordionConfig, useFactory: getAccordionConfig}]
})
export class RolesTableComponent implements OnInit {
  public isLoaded = false;
  public permissionTable;
  public userRoles = [];
  public RMS  = [];
  // public fieldArray: Array<any> = [];
  // public newAttribute: any = {};
  name;
  cc;

  constructor(private permissionsService: RolesManagementService) {
  }

  ngOnInit() {
    this.permissionsService.getPermissionTable()
      .subscribe((data) => {
        this.isLoaded = true;
        console.log(data);
        this.permissionTable = data.parentPermission;
        this.userRoles = data.roles;
        console.log(this.permissionTable);
        console.log(this.userRoles);
      });
    // this.permissionsService.getUsersRoles()
    //   .subscribe((data) => {
    //     this.userRoles = data;
    //   });
  }

  addNewColumn(event, id) {
    this.userRoles.push({role: ''});
  }

  saveRole(event) {
    const roleName = {
      name: event.target.value
    };
    console.log(roleName);
    // this.permissionsService.createUserRole(roleName)
    //   .subscribe((data) => {
    //     console.log(data);
    //   });
  }

  deleteRole(id) {
    this.userRoles.splice(id, 1);
    this.permissionsService.deleteUserRole(id)
      .subscribe((data) => {
        console.log(data);
        this.cc = this.userRoles.filter(role => role.id !== id);
        console.log(this.cc);
        this.userRoles = this.cc;
      });

  }

  deleteFieldValue(index) {
    // this.fieldArray.splice(index, 1);
  }
}
