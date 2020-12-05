interface PagingResponseParams {
  offset: number;
  limit: number;
  total: number;
}

export class PagingResponse {
  constructor(
    key: 'members' | 'accounts' | 'epins' | 'incomes' | 'transactions',
    value: any[],
    params: PagingResponseParams,
  ) {
    this[key] = {
      items: value,
      limit: params.limit,
      offset: params.offset,
      total: params.total,
    };
  }
}
