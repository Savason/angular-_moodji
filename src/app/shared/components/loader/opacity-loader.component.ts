import {Component, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'app-opacity-loader',
  template: '<div class="loader_wrapper">\n' +
  ' <div class="circle-loader">\n' +
  '  <div class="checkmark draw"></div>\n' +
  '</div>\n' +
  '<div class="loader_title"></div> \n' +
  '</div>',
  styleUrls: ['./opacity-loader.component.scss'],
})
export class OpacityLoaderComponent {

}
