export interface IRoleModel {
  name: string;
  id?: string;
}

export class RoleModel implements IRoleModel {
  name: string;
  id?: string;


  constructor(name: string, id?: string) {
    this.name = name;
    this.id = id;
  }
}
