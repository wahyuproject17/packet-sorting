import { useState, useCallback, useEffect } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Avatar from '@mui/material/Avatar';

import { Scrollbar } from 'src/components/scrollbar';
import { TableNoData } from '../table-no-data';
import { HistoryTableRow } from '../attendance-table-row';
import { AttendanceTableHead } from '../attendance-table-head';
import { TableEmptyRows } from '../table-empty-rows';
import { AttendanceTableToolbar } from '../attendance-table-toolbar';
import { emptyRows, applyHistoryFilter, getComparator } from '../utils';

import api from '../../../services/api';

const formatDate = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  };
  return new Date(dateString).toLocaleString('id-ID', options);
};

interface Attendance {
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

export function AttendanceView() {
  const table = useTable();

  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [filterName, setFilterName] = useState<string>('');
  const [selectedAttendance, setSelectedAttendance] = useState<Attendance | null>(null);

  useEffect(() => {
    const fetchAttendances = async () => {
      try {
        const response = await api.get('/history');
        setAttendances(response.data.histories);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchAttendances();
  }, []);

  const dataFiltered = applyHistoryFilter({
    inputData: attendances,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  });

  const toTitleCase = (str: string): string =>
    str
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

  const notFound = !dataFiltered.length && !!filterName;

  const handleViewDetail = (attendance: Attendance) => {
    setSelectedAttendance(attendance);
  };

  const handleCloseDetail = () => {
    setSelectedAttendance(null);
  };

  // --- FUNGSI DELETE SELECTED ---
  const handleDeleteSelected = async () => {
    if (table.selected.length === 0) return;

    const confirm = window.confirm('Yakin ingin menghapus data yang dipilih?');
    if (!confirm) return;

    try {
      // Hapus satu per satu lewat API
      await Promise.all(
        table.selected.map((id) => api.delete(`/history/${id}`))
      );

      // Update state, buang data yg sudah dihapus
      setAttendances((prev) =>
        prev.filter((item) => !table.selected.includes(String(item.id)))
      );

      // Reset selected rows
      table.onSelectAllRows(false, []);
    } catch (error) {
      console.error('Gagal menghapus data:', error);
    }
  };

  return (
    <Box>
      <Card>
        <AttendanceTableToolbar
          numSelected={table.selected.length}
          filterName={filterName}
          onFilterName={(event) => {
            setFilterName(event.target.value);
            table.onResetPage();
          }}
          onDeleteSelected={handleDeleteSelected} // <-- tombol hapus
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <AttendanceTableHead
                order={table.order}
                orderBy={table.orderBy}
                rowCount={attendances.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked: boolean) =>
                  table.onSelectAllRows(
                    checked,
                    attendances.map((attendance) => String(attendance.id))
                  )
                }
                headLabel={[
                  { id: 'packet_name', label: 'Nama Paket' },
                  { id: 'entry_date', label: 'Waktu Masuk' },
                  { id: 'exit_date', label: 'Waktu Keluar' },
                  { id: 'status', label: 'Status' },
                  { id: '', label: '' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row) => (
                    <HistoryTableRow
                      key={row.id}
                      row={row}
                      selected={table.selected.includes(String(row.id))}
                      onSelectRow={() => table.onSelectRow(String(row.id))}
                      onViewDetail={() => handleViewDetail(row)}
                    />
                  ))}

                <TableEmptyRows
                  height={68}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, attendances.length)}
                />

                {notFound && <TableNoData searchQuery={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          page={table.page}
          count={attendances.length}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>

      {selectedAttendance && (
        <Dialog open={!!selectedAttendance} onClose={handleCloseDetail} maxWidth="sm" fullWidth>
          <DialogTitle>Detail Histori</DialogTitle>
          <DialogContent dividers>
            <Typography variant="body1">
              <strong>Nama Paket:</strong> {toTitleCase(selectedAttendance.packet_name)}
            </Typography>
            <Typography variant="body1">
              <strong>Waktu Masuk:</strong> {formatDate(selectedAttendance.entry_date)}
            </Typography>
            <Typography variant="body1">
              <strong>Waktu Keluar:</strong> {formatDate(selectedAttendance.exit_date)}
            </Typography>
            <Typography variant="body1">
              <strong>Status:</strong> {toTitleCase(selectedAttendance.status)}
            </Typography>
            {selectedAttendance.courier_photo && (
              <Box mt={2}>
                <Typography variant="body1"><strong>Foto Kurir:</strong></Typography>
                <Avatar
                  alt="Courier"
                  src={selectedAttendance.courier_photo}
                  sx={{ width: 100, height: 100 }}
                  variant="rounded"
                />
              </Box>
            )}
            {selectedAttendance.user_photo && (
              <Box mt={2}>
                <Typography variant="body1"><strong>Foto User:</strong></Typography>
                <Avatar
                  alt="User"
                  src={selectedAttendance.user_photo}
                  sx={{ width: 100, height: 100 }}
                  variant="rounded"
                />
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDetail} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
}

export function useTable() {
  const [page, setPage] = useState(0);
  const [orderBy, setOrderBy] = useState<string>('id_packet');
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [selected, setSelected] = useState<string[]>([]);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  const onSort = useCallback(
    (id: string) => {
      const isAsc = orderBy === id && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    },
    [order, orderBy]
  );

  const onSelectAllRows = useCallback((checked: boolean, newSelecteds: string[]) => {
    setSelected(checked ? newSelecteds : []);
  }, []);

  const onSelectRow = useCallback(
    (inputValue: string) => {
      const newSelected = selected.includes(inputValue)
        ? selected.filter((value) => value !== inputValue)
        : [...selected, inputValue];
      setSelected(newSelected);
    },
    [selected]
  );

  const onResetPage = useCallback(() => {
    setPage(0);
  }, []);

  const onChangePage = useCallback((event: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const onChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      onResetPage();
    },
    [onResetPage]
  );

  return {
    page,
    order,
    onSort,
    orderBy,
    selected,
    rowsPerPage,
    onSelectRow,
    onResetPage,
    onChangePage,
    onSelectAllRows,
    onChangeRowsPerPage,
  };
}
