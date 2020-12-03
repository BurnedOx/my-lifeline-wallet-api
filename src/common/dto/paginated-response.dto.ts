interface PagingResponseParams {
  offset: number;
  limit: number;
  total: number;
}

export class PagingResponse {
  constructor(
    key: 'members' | 'accounts' | 'epins',
    value: any[],
    params: PagingResponseParams,
  ) {
    this[key] = {
      items: value,
      limit: parseInt(`${params.limit}`),
      offset: parseInt(`${params.offset}`),
      total: params.total,
    };
  }
}
