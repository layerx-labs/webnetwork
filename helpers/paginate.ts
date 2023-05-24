const ITEMS_PER_PAGE = 10;

export function calculateTotalPages(count: number): number {
  return Math.ceil(count / ITEMS_PER_PAGE);
}

function paginate(
  query: any = {},
  { page = 1 }: { page?: number } = { page: 1 },
  order: any[] = []
) {
  page = Math.ceil(page);
  if (page < 1) {
    page = 1;
  }
  const offset = (page - 1) * ITEMS_PER_PAGE;
  return {
    ...query,
    distinct: true,
    offset,
    limit: ITEMS_PER_PAGE,
    order,
  };
}

export function paginateArray(items, itemsPerPage: number, page) {
  const pages = Math.ceil(items.length / itemsPerPage);
  const data = items.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return {
    pages,
    page,
    data,
  };
}

export default paginate;
