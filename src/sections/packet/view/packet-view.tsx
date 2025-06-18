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
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

import { Scrollbar } from 'src/components/scrollbar';
import { TableNoData } from '../table-no-data';
import { UserTableRow } from '../packet-table-row';
import { UserTableHead } from '../packet-table-head';
import { TableEmptyRows } from '../table-empty-rows';
import { UserTableToolbar } from '../packet-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';

import api from '../../../services/api'; // Import API
import { UserProps } from '../types';

export function PacketView() {
  const table = useTable();

  const [packet, setPacket] = useState<UserProps[]>([]);
  const [filterName, setFilterName] = useState('');
  const [selectedPacket, setselectedPacket] = useState<UserProps | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  // Snackbar
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [newPacket, setnewPacket] = useState({ receipt_number: '', packet_name: '', destination: '' });

  const handleSnackbarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Tanggal tidak tersedia';
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  const handleOpenAddDialog = () => {
  setnewPacket({ receipt_number: '', packet_name: '', destination: '' });
  setOpenAddDialog(true);
};

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
  };

  const handleAddPacket = async () => {
    try {
      const response = await api.post('/packet', newPacket);
      setPacket((prevpacket) => [...prevpacket, response.data.data]);
      handleCloseAddDialog();
      setSnackbarMessage('Paket berhasil ditambahkan.');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Gagal menambahkan paket:', error);
      setSnackbarMessage('Gagal menambahkan paket.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  useEffect(() => {
    const fetchpacket = async () => {
      try {
        const response = await api.get('/packet');
        setPacket(response.data.packets);
      } catch (error) {
        console.error('Error fetching packet:', error);
      }
    };
    fetchpacket();
  }, []);


  const handleOpenDeleteDialog = () => {
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleDeleteSelected = async () => {
    try {
      await Promise.all(
        table.selected.map((userId) => api.delete(`/packet/${userId}`))
      );
      const updatedpacket = packet.filter((user) => !table.selected.includes(user.id));
      setPacket(updatedpacket);
      table.onSelectAllRows(false, []);
      handleCloseDeleteDialog();
      setSnackbarMessage('Berhasil menghapus paket yang dipilih.');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error deleting packet:', error);
      setSnackbarMessage('Gagal menghapus paket.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const dataFiltered = applyFilter({
    inputData: packet,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  const handleViewDetail = (user: UserProps) => {
    setselectedPacket(user);
  };

  const handleCloseDetail = () => {
    setselectedPacket(null);
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={5} px={2}>
        <Typography variant="h4">
          Daftar Paket
        </Typography>
        <Button variant="contained" onClick={handleOpenAddDialog} sx={{ height: 40 }}>
          Tambah Packet
        </Button>
      </Box>

      <Card>
        <UserTableToolbar
          numSelected={table.selected.length}
          filterName={filterName}
          onFilterName={(event) => {
            setFilterName(event.target.value);
            table.onResetPage();
          }}
          onDeleteSelected={handleOpenDeleteDialog}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <UserTableHead
                order={table.order}
                orderBy={table.orderBy}
                rowCount={packet.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    packet.map((user) => user.id)
                  )
                }
                headLabel={[
                  { id: 'receipt_number', label: 'Nomor Resi' },
                  { id: 'packet_name', label: 'Nama Paket' },
                   { id: 'destination', label: 'Tujuan' },
                  { id: 'createdAt', label: 'Tanggal Pembuatan' },
                  { id: 'status', label: 'Status' },
                  { id: '' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row) => (
                    <UserTableRow
                      key={row.id}
                      row={{ ...row, createdAt: formatDate(row.createdAt) }}
                      selected={table.selected.includes(row.id)}
                      onSelectRow={() => table.onSelectRow(row.id)}
                      onViewDetail={() => handleViewDetail(row)}
                    />
                  ))}

                <TableEmptyRows
                  height={68}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, packet.length)}
                />

                {notFound && <TableNoData searchQuery={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          page={table.page}
          count={packet.length}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>

      {/* Dialog konfirmasi hapus */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Konfirmasi Hapus</DialogTitle>
        <DialogContent>
          <Typography>
            Yakin ingin menghapus {table.selected.length} item terpilih?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="inherit">
            Batal
          </Button>
          <Button onClick={handleDeleteSelected} color="error" variant="contained">
            Hapus
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Tambah Pengguna */}
      <Dialog open={openAddDialog} onClose={handleCloseAddDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Tambah Paket Baru</DialogTitle>
        <DialogContent dividers>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <input
              type="text"
              placeholder="Nomor Resi"
              value={newPacket.receipt_number}
              onChange={(e) => setnewPacket({ ...newPacket, receipt_number: e.target.value })}
              style={{ padding: '10px', fontSize: '16px', borderRadius: '6px', border: '1px solid #ccc' }}
            />
            <input
              type="text"
              placeholder="Nama Paket"
              value={newPacket.packet_name}
              onChange={(e) => setnewPacket({ ...newPacket, packet_name: e.target.value })}
              style={{ padding: '10px', fontSize: '16px', borderRadius: '6px', border: '1px solid #ccc' }}
            />
            <select
              value={newPacket.destination}
              onChange={(e) => setnewPacket({ ...newPacket, destination: e.target.value })}
              style={{ padding: '10px', fontSize: '16px', borderRadius: '6px', border: '1px solid #ccc' }}
            >
              <option value="">Pilih tujuan</option>
              <option value="Bandung">Bandung</option>
              <option value="Jakarta">Jakarta</option>
              <option value="Semarang">Semarang</option>
            </select>

          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddDialog} color="inherit">
            Batal
          </Button>
          <Button onClick={handleAddPacket} variant="contained">
            Simpan
          </Button>
        </DialogActions>
      </Dialog>


      {/* Detail Dialog */}
      {selectedPacket && (
        <Dialog open={!!selectedPacket} onClose={handleCloseDetail} maxWidth="sm" fullWidth>
          <DialogTitle>Detail Paket</DialogTitle>
          <DialogContent dividers>
            <Typography variant="body1">
              <strong>Nomor Resi:</strong> {selectedPacket.receipt_number}
            </Typography>
            <Typography variant="body1">
              <strong>Nama Paket:</strong> {selectedPacket.packet_name}
            </Typography>
            <Typography variant="body1">
              <strong>Tujuan:</strong> {selectedPacket.destination}
            </Typography>
            <Typography variant="body1">
              <strong>Tanggal Pembuatan:</strong> {formatDate(selectedPacket.createdAt)}
            </Typography>
            <Typography variant="body1">
              <strong>Status:</strong> {selectedPacket.status}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDetail} color="primary">
              Tutup
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <MuiAlert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          elevation={6}
          variant="filled"
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </Box>
  );
}

// Hook useTable
export function useTable() {
  const [page, setPage] = useState(0);
  const [orderBy, setOrderBy] = useState('full_name');
  const [rowsPerPage, setRowsPerPage] = useState(5);
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
