import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {SearchParams} from '../../models/search.pagination.model';
import {faChevronLeft, faChevronRight, faStepBackward, faStepForward} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent {
  public fachevronright = faChevronRight;
  public fastepforward = faStepForward;
  public fachevronleft = faChevronLeft;
  public fastepbackward = faStepBackward;
  public _totalRecords = 0;


  @Output() public paginationClickEvent = new EventEmitter<SearchParams>();

  public totalPages: number;
  public perPage = 10;
  public activePageNumber = 1;

  public searchParams: SearchParams = {
    page: this.activePageNumber,
  };

  @Input()
  set totalRecords(totalRecords: number) {
    this._totalRecords = totalRecords;
    this.totalPages = Math.ceil(totalRecords / this.perPage);
  }

  public changeTablePage(pageNumber: number) {
    this.activePageNumber = pageNumber;
    this.assignSearchParams();
    this.paginationClickEvent.emit(this.searchParams);
  }

  public goToPreviousTablePage() {
    this.activePageNumber--;
    this.assignSearchParams();
    this.paginationClickEvent.emit(this.searchParams);
  }

  public goToNextTablePage() {
    this.activePageNumber++;
    this.assignSearchParams();
    this.paginationClickEvent.emit(this.searchParams);
  }

  public goToFirstPage() {
    this.activePageNumber = 1;
    this.assignSearchParams();
    this.paginationClickEvent.emit(this.searchParams);
  }

  public goToLastPage() {
    this.activePageNumber = Math.ceil(this._totalRecords / this.perPage);
    this.assignSearchParams();
    this.paginationClickEvent.emit(this.searchParams);
  }

  private assignSearchParams() {
    this.searchParams = {
      page: this.activePageNumber,
    };
  }

}
