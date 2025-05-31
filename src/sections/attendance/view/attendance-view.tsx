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

import { Scrollbar } from 'src/components/scrollbar';
import { TableNoData } from '../table-no-data';
import { AttendanceTableRow } from '../attendance-table-row';
import { AttendanceTableHead } from '../attendance-table-head';
import { TableEmptyRows } from '../table-empty-rows';
import { AttendanceTableToolbar } from '../attendance-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';

import api from '../../../services/api'; // Import API

// Format tanggal untuk Indonesia
const formatDate = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit', 
    hour12: false // Menggunakan format 24 jam
  };
  return new Date(dateString).toLocaleString('id-ID', options);
};


// Tipe data untuk presensi
interface Attendance {
  id: string;
  fullname: string;
  date: string;
  status: string;
  information: string;
}

export function AttendanceView() {
  const table = useTable();

  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [filterName, setFilterName] = useState<string>('');
  const [selectedAttendance, setSelectedAttendance] = useState<Attendance | null>(null);

  // Fetch attendances from API
  useEffect(() => {
    const fetchAttendances = async () => {
      try {
        const response = await api.get('/presence'); // Sesuaikan endpoint API jika perlu
        setAttendances(response.data);
      } catch (error) {
        console.error('Error fetching attendances:', error);
      }
    };
    fetchAttendances();
  }, []);

  const dataFiltered = applyFilter({
    inputData: attendances,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  // Handle attendance detail view
  const handleViewDetail = (attendance: Attendance) => {
    setSelectedAttendance(attendance);
  };

  const handleCloseDetail = () => {
    setSelectedAttendance(null);
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
                onSelectAllRows={(checked: boolean) => // Menambahkan tipe boolean
                  table.onSelectAllRows(
                    checked,
                    attendances.map((attendance) => attendance.id)
                  )
                }
                headLabel={[
                  { id: 'fullname', label: 'Full Name' },
                  { id: 'date', label: 'Attendance Date' },
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
                    <AttendanceTableRow
                      key={row.id}
                      row={row}
                      selected={table.selected.includes(row.id)}
                      onSelectRow={() => table.onSelectRow(row.id)}
                      onViewDetail={() => handleViewDetail(row)} // View detail button
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

      {/* Detail Dialog */}
      {selectedAttendance && (
        <Dialog open={!!selectedAttendance} onClose={handleCloseDetail} maxWidth="sm" fullWidth>
          <DialogTitle>Attendance Details</DialogTitle>
          <DialogContent dividers>
            <Typography variant="body1">
              <strong>Full Name:</strong> {selectedAttendance.fullname}
            </Typography>
            <Typography variant="body1">
              <strong>Attendance Date:</strong> {formatDate(selectedAttendance.date)}
            </Typography>
            <Typography variant="body1">
              <strong>Status:</strong> {selectedAttendance.status}
            </Typography>
            <Typography variant="body1">
              <strong>Alasan:</strong> {selectedAttendance.information}
            </Typography>
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

// Hook to manage table state
export function useTable() {
  const [page, setPage] = useState(0);
  const [orderBy, setOrderBy] = useState<string>('fullname');
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
    if (checked) {
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
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
