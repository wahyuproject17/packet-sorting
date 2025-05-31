export function emptyRows(page: number, rowsPerPage: number, rowCount: number) {
    const emptyRowCount = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rowCount) : 0;
    return emptyRowCount;
  }
  
  export function applyFilter({
    inputData,
    comparator,
    filterName,
  }: {
    inputData: any[];
    comparator: (a: any, b: any) => number;
    filterName: string;
  }) {
    const filteredData = inputData.filter((item) => item.fullname.toLowerCase().includes(filterName.toLowerCase()));
    return filteredData.sort(comparator);
  }
  
  export function getComparator<Key extends keyof any>(
    order: 'asc' | 'desc',
    orderBy: Key
  ): (a: { [key in Key]: number | string }, b: { [key in Key]: number | string }) => number {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }
  
  function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }
  