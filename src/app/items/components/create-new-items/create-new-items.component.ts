import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {ItemsService} from '../../services/items.service';
import {Subscription} from 'rxjs';
import {NotificationsService} from '../../../shared/services/notifications.service';
import {systemIcon} from '../../../shared/variables/variables';

@Component({
  selector: 'app-create-new-items',
  templateUrl: './create-new-items.component.html',
  styleUrls: ['./create-new-items.component.scss'],
})
export class CreateNewItemsComponent implements OnInit, OnDestroy {
  public form: FormGroup;
  public url: string;
  public prewImg = false;
  public cancelIcon = systemIcon.cancelIcon;
  public formErrorIcon = systemIcon.errorForm;
  fileToUpload: File = null;
  sub1 = new Subscription();
  sub2 = new Subscription();

  @ViewChild('fileInput') fileInput;

  constructor(private routes: Router,
              private itemsService: ItemsService,
              private notificationService: NotificationsService,
              private element: ElementRef) {
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
  }

  ngOnDestroy() {
    if (this.sub1) {
      this.sub1.unsubscribe();
    }
  }

  handleFileInput = (event: any): void => {
    this.fileToUpload = event.target.files.item(0);
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();

      reader.onload = (event: ProgressEvent) => {
        this.url = (<FileReader>event.target).result;
        this.prewImg = true;
        console.log(this.url);
      };

      reader.readAsDataURL(event.target.files[0]);
    }
  };


  backToDefaultImg() {
    this.prewImg = false;
    const input = this.element.nativeElement.querySelector('#image');
    input.value = null;
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
      formData.append('image', this.fileToUpload, this.fileToUpload.name);
    }
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

  forbiddenEmails(control: FormControl): Promise<any> {
    return new Promise((resolve) => {
      this.sub2 = this.itemsService.getItemByEan(control.value)
        .subscribe((data) => {
          if (data !== null) {
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
