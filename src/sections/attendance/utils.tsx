export function emptyRows(page: number, rowsPerPage: number, rowCount: number) {
  return page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rowCount) : 0;
}

export interface History {
  id: number;
  id_packet: number;
  packet_name: string;
  status: string;
  entry_date: string;
  exit_date: string;
  courier_photo?: string | null;
  user_photo?: string | null;
  createdAt: string;
  updatedAt: string;
}

// General: Comparator untuk sorting
function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) return -1;
  if (b[orderBy] > a[orderBy]) return 1;
  return 0;
}

// General: Dapatkan fungsi comparator berdasarkan urutan dan kolom
export function getComparator<Key extends keyof any>(
  order: 'asc' | 'desc',
  orderBy: Key
): (a: { [key in Key]: any }, b: { [key in Key]: any }) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// Umum: Filter dan sort data apa pun berdasarkan full_name (untuk pengguna misalnya)
export function applyFilter({
  inputData,
  comparator,
  filterName,
}: {
  inputData: any[];
  comparator: (a: any, b: any) => number;
  filterName: string;
}) {
  const filteredData = inputData.filter((item) =>
    item.full_name?.toLowerCase().includes(filterName.toLowerCase())
  );
  return filteredData.sort(comparator);
}

export function applyHistoryFilter({
  inputData,
  comparator,
  filterName,
}: {
  inputData: History[];
  comparator: (a: History, b: History) => number;
  filterName: string;
}): History[] {
  const stabilizedData = inputData.map((el, index) => [el, index] as const);
  stabilizedData.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  let filtered = stabilizedData.map((el) => el[0]);

  if (filterName) {
    const lowerFilter = filterName.toLowerCase();
    filtered = filtered.filter((item) =>
      `${item.id_packet} ${item.entry_date} ${item.exit_date}`
        .toLowerCase()
        .includes(lowerFilter)
    );
  }

  return filtered;
}
