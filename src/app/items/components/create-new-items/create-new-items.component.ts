import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {Item} from '../../models/item.model';
import {ItemsService} from '../../services/items.service';
import {Subscription} from 'rxjs';
import {NotificationsService} from '../../../shared/services/notifications.service';

@Component({
  selector: 'app-create-new-items',
  templateUrl: './create-new-items.component.html',
  styleUrls: ['./create-new-items.component.scss']
})
export class CreateNewItemsComponent implements OnInit, OnDestroy {
  public form: FormGroup;
  fileToUpload: File = null;
  sub1 = new Subscription();
  @ViewChild('fileInput') fileInput;

  constructor(private routes: Router,
              private itemsService: ItemsService,
              private notificationService: NotificationsService) {
  }

  getErrorEANMessage() {
    return this.form.get('ean')['errors']['required'] ? 'This field is required' :
      this.form.get('ean')['errors']['minlength'] ? `Field length must be 13 digits. Now ${this.form.get('ean')['errors']['minlength']['actualLength']}` : '';
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
      'ean': new FormControl('', [Validators.required, Validators.minLength(13)]),
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
  }

  ngOnDestroy() {
    if (this.sub1) {
      this.sub1.unsubscribe();
    }
  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
    console.log(files.item(0));
  }

  createItem() {
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
    if (this.fileToUpload) {
      console.log(this.fileToUpload);
      console.log(this.fileToUpload.name);
      formData.append('image', this.fileToUpload, this.fileToUpload.name);
    }
    console.log(this.form);
    // const {ean, sku, name, price, category, image, size, color, country, package_height, package_length, package_width, cross_weight, net_weight, supplier} = this.form.value;
    // const item = new Item(ean, sku, name, price, category, image, size, color, country, package_height, package_length, package_width, cross_weight, net_weight, supplier);
    // console.log(item);
    this.sub1 = this.itemsService.createNewItem(formData)
      .subscribe((data) => {
          if (data.success) {
            console.log(data);
            this.routes.navigateByUrl('items');
            this.notificationService.notify('success', '', `Item ${data.value.name} has been created successfully!`);
          } else if (data.error) {
            console.log(data.error_description);
            this.notificationService.notify('warn', '', `${data.error}`);
          }
        },
        error2 => {
          this.notificationService.notify('error', '', `Something went wrong please try repeat letter!`);
        });
  }

  toItemsList() {
    this.routes.navigateByUrl('items');
  }
}
