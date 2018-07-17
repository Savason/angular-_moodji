export interface ISearchParams {
  page: number;
}

export class SearchParams implements ISearchParams {
  page: number;


  constructor(page: number) {
    this.page = page;
  }
}
