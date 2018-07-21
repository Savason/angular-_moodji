import {Component} from '@angular/core';

@Component({
  selector: 'app-system-loader',
  template: '<div class="loader_wrapper">\n' +
  ' <div class="circle-loader">\n' +
  '  <div class="checkmark draw"></div>\n' +
  '</div>\n' +
  '<div class="loader_title">Moodja.</div> \n' +
  '</div>',
  styleUrls: ['./system-loader.component.scss']
})
export class SystemLoaderComponent {

}
