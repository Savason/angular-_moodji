export interface IRoleModel {
  name: string;
  role_id?: string;
}

export class RoleModel implements IRoleModel {
  name: string;
  role_id?: string;


  constructor(name: string, id?: string) {
    this.name = name;
    this.role_id = id;
  }
}
