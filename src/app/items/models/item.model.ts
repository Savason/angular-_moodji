export interface IItem {
  ean: number;
  sku: string;
  name: string;
  price: string;
  category: string;
  image?: any;
  size?: string;
  color?: string;
  country?: string;
  package_height?: string;
  package_length?: string;
  package_width?: string;
  cross_weight?: string;
  net_weight?: string;
  supplier?: string;
  id?: number;
}

export class Item implements IItem {
  ean: number;
  sku: string;
  name: string;
  price: string;
  category: string;
  image?: any;
  size?: string;
  color?: string;
  country?: string;
  package_height?: string;
  package_length?: string;
  package_width?: string;
  cross_weight?: string;
  net_weight?: string;
  supplier?: string;
  id?: number;


  constructor(ean: number, sku: string, name: string, price: string,
              category: string, image: any, size: string, color: string,
              country: string, package_height: string, package_length: string,
              package_width: string, cross_weight: string,
              net_weight: string, supplier: string, id?: number) {
    this.ean = ean;
    this.sku = sku;
    this.name = name;
    this.price = price;
    this.category = category;
    this.image = image;
    this.size = size;
    this.color = color;
    this.country = country;
    this.package_height = package_height;
    this.package_length = package_length;
    this.package_width = package_width;
    this.cross_weight = cross_weight;
    this.net_weight = net_weight;
    this.supplier = supplier;
    this.id = id;
  }
}
