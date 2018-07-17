import {SearchParams} from './search.pagination.model';


export abstract class TableUserBase {
  private _rows;
  private _searchParams: SearchParams = {
    page: 1,
  };
  private _totalRecords: number;

  public abstract updateCurrentTableData(event: any);

  get rows() {
    return this._rows;
  }

  set rows(value: any) {
    this._rows = value;
  }

  get searchParams(): SearchParams {
    return this._searchParams;
  }

  set searchParams(value: SearchParams) {
    this._searchParams = value;
  }

  get totalRecords(): number {
    return this._totalRecords;
  }

  set totalRecords(value: number) {
    this._totalRecords = value;
  }
}
