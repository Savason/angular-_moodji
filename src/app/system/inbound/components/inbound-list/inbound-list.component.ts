import {Component, OnInit} from '@angular/core';
import {BaseMoodjaApi} from '../../../../shared/base-api/base-moodja-api.service';
import {HttpClient} from '@angular/common/http';
import {InboundsService} from '../../services/inbounds.service';

@Component({
  selector: 'app-inbound-list',
  templateUrl: './inbound-list.component.html',
  styleUrls: ['./inbound-list.component.scss']
})
export class InboundListComponent implements OnInit {

  constructor(private inboundsService: InboundsService) {
  }

  ngOnInit() {
  }

  getSomething() {
    this.inboundsService.getInboundsList()
      .subscribe((data) => {
        console.log(data);
      });
  }

}
