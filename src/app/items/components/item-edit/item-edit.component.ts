import {Component, OnDestroy, OnInit} from '@angular/core';
import {ItemsService} from '../../services/items.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {faExclamationTriangle} from '@fortawesome/free-solid-svg-icons/faExclamationTriangle';

@Component({
  selector: 'app-item-edit',
  templateUrl: './item-edit.component.html',
  styleUrls: ['./item-edit.component.scss']
})
export class ItemEditComponent implements OnInit, OnDestroy {
  public isLoaded = false;
  public faExclamationCircle = faExclamationTriangle;
  private editItem;
  public form: FormGroup;
  sub1 = new Subscription();
  sub2 = new Subscription();
  sub3 = new Subscription();
  sub4 = new Subscription();


  constructor(private itemsService: ItemsService,
              private route: ActivatedRoute,
              private routes: Router) {
  }

  getErrorEANMessage() {
    return this.form.get('ean')['errors']['required'] ? 'This field is required' :
      this.form.get('ean')['errors']['minlength'] ? `Field length must be 13 digits. Now ${this.form.get('ean')['errors']['minlength']['actualLength']}` :
        this.form.get('ean')['errors']['forbiddenEmail'] ? 'This EAN is already taken' : '';
  }

  getErrorSKUMessage() {
    return this.form.get('sku')['errors']['required'] ? 'This field is required' : '';
  }

  getErrorNameMessage() {
    return this.form.get('name')['errors']['required'] ? 'This field is required' : '';
  }

  getErrorPriceMessage() {
    return this.form.get('price')['errors']['required'] ? 'This field is required' : '';
  }

  getErrorCategoryMessage() {
    return this.form.get('category')['errors']['required'] ? 'This field is required' : '';
  }

  ngOnInit() {
    this.form = new FormGroup({
      'ean': new FormControl('', [Validators.required, Validators.minLength(13)], this.forbiddenEmails.bind(this)),
      'sku': new FormControl('', [Validators.required]),
      'name': new FormControl('', [Validators.required]),
      'price': new FormControl('', [Validators.required]),
      'category': new FormControl('', [Validators.required]),
      'image': new FormControl(''),
      'size': new FormControl(''),
      'color': new FormControl(''),
      'country': new FormControl(''),
      'package_height': new FormControl(''),
      'package_length': new FormControl(''),
      'package_width': new FormControl(''),
      'cross_weight': new FormControl(''),
      'net_weight': new FormControl(''),
      'supplier': new FormControl(''),
    });
    this.sub1 = this.route.params
      .subscribe((params: Params) => {
        this.sub2 = this.itemsService.getItemByEan(params['ean'])
          .subscribe((data) => {
            if (data) {
              this.isLoaded = true;
              this.editItem = data;
              this.form.patchValue({
                'ean': this.editItem.ean,
                'sku': this.editItem.sku,
                'name': this.editItem.name,
                'price': this.editItem.price,
                'category': this.editItem.category,
                // 'image': this.editItem.image,
                'size': this.editItem.size,
                'color': this.editItem.color,
                'country': this.editItem.country,
                'package_height': this.editItem.package_height,
                'package_length': this.editItem.package_length,
                'package_width': this.editItem.package_width,
                'cross_weight': this.editItem.cross_weight,
                'net_weight': this.editItem.net_weight,
                'supplier': this.editItem.supplier,
              });
            }
          });
      });
  }

  ngOnDestroy() {
    if (this.sub1) {
      this.sub1.unsubscribe();
    }
    if (this.sub2) {
      this.sub2.unsubscribe();
    }
    if (this.sub3) {
      this.sub3.unsubscribe();
    }
    if (this.sub4) {
      this.sub4.unsubscribe();
    }
  }

  updateItem() {
    const formData: FormData = new FormData();
    formData.append('ean', this.form.value.ean);
    formData.append('sku', this.form.value.sku);
    formData.append('name', this.form.value.name);
    formData.append('price', this.form.value.price);
    formData.append('category', this.form.value.category);
    formData.append('size', this.form.value.size);
    formData.append('color', this.form.value.color);
    formData.append('country', this.form.value.country);
    formData.append('package_height', this.form.value.package_height);
    formData.append('package_length', this.form.value.package_length);
    formData.append('package_width', this.form.value.package_width);
    formData.append('cross_weight', this.form.value.cross_weight);
    formData.append('net_weight', this.form.value.net_weight);
    formData.append('supplier', this.form.value.supplier);
    console.log(formData);
    this.sub3 = this.itemsService.updateItem(this.editItem.id, formData)
      .subscribe((data) => {
        console.log(data);
      });
  }

  forbiddenEmails(control: FormControl): Promise<any> {
    return new Promise((resolve) => {
      this.sub4 = this.itemsService.getItemByEan(control.value)
        .subscribe((data) => {
          console.log(control.value);
          if (data !== null && data.ean === this.editItem.ean) {
            resolve(null);
          } else if (data !== null) {
            resolve({forbiddenEmail: true});
          } else {
            resolve(null);
          }
        });
    });
  }

  toItemsList() {
    this.routes.navigateByUrl('items');
  }

}
