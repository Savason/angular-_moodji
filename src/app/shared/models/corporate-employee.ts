export class CorporateEmployee {
  email: string;
  enabled: boolean;
  id: string|number;
  name: string;
  role_title: string;
  role_id: string | number;

  constructor(name: string, email: string, role_title: string, enabled: boolean, id: string | number,
              role_id: string | number) {
    this.name = name;
    this.email = email;
    this.role_title = role_title;
    this.enabled = enabled;
    this.id = id;
    this.role_id = role_id;
  }
}
