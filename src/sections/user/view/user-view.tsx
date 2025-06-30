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
import { UserTableRow } from '../user-table-row';
import { UserTableHead } from '../user-table-head';
import { TableEmptyRows } from '../table-empty-rows';
import { UserTableToolbar } from '../user-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';

import api from '../../../services/api';
import { UserProps } from '../types';

export function UserView() {
  const table = useTable();

  const [users, setUsers] = useState<UserProps[]>([]);
  const [filterName, setFilterName] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserProps | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [newUser, setNewUser] = useState({ full_name: '', email: '', password: '' });
  const [editUser, setEditUser] = useState<UserProps | null>(null);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  const handleSnackbarClose = () => setSnackbarOpen(false);

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Tanggal tidak tersedia';
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data.data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenAddDialog = () => {
    setNewUser({ full_name: '', email: '', password: '' });
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => setOpenAddDialog(false);

  const handleAddUser = async () => {
    try {
      const response = await api.post('/users', newUser);
      setUsers((prev) => [...prev, response.data.data]);
      handleCloseAddDialog();
      setSnackbarMessage('Pengguna berhasil ditambahkan.');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Gagal menambahkan pengguna:', error);
      setSnackbarMessage('Gagal menambahkan pengguna.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleOpenEditDialog = (user: UserProps) => {
    setEditUser(user);
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setEditUser(null);
    setOpenEditDialog(false);
  };

  const handleEditUser = async () => {
    if (!editUser) return;
    try {
      const response = await api.put(`/users/${editUser.id}`, editUser);
      setUsers((prev) => prev.map((u) => (u.id === editUser.id ? response.data.data : u)));
      handleCloseEditDialog();
      setSnackbarMessage('Pengguna berhasil diperbarui.');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Gagal memperbarui pengguna:', error);
      setSnackbarMessage('Gagal memperbarui pengguna.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleDeleteSelected = async () => {
    try {
      await Promise.all(table.selected.map((id) => api.delete(`/users/${id}`)));
      setUsers((prev) => prev.filter((user) => !table.selected.includes(user.id)));
      table.onSelectAllRows(false, []);
      setOpenDeleteDialog(false);
      setSnackbarMessage('Pengguna berhasil dihapus.');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Gagal menghapus pengguna:', error);
      setSnackbarMessage('Gagal menghapus pengguna.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleViewDetail = (user: UserProps) => setSelectedUser(user);
  const handleCloseDetail = () => setSelectedUser(null);

  const dataFiltered = applyFilter({
    inputData: users,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <Box>
      {/* Toolbar */}
      <Box display="flex" justifyContent="space-between" mb={5} px={2}>
        <Typography variant="h4">Daftar Pengguna</Typography>
        <Button variant="contained" onClick={handleOpenAddDialog}>Tambah Pengguna</Button>
      </Box>

      <Card>
        <UserTableToolbar
          numSelected={table.selected.length}
          filterName={filterName}
          onFilterName={(e) => {
            setFilterName(e.target.value);
            table.onResetPage();
          }}
          onDeleteSelected={() => setOpenDeleteDialog(true)}
        />

        <Scrollbar>
          <TableContainer>
            <Table sx={{ minWidth: 800 }}>
              <UserTableHead
                order={table.order}
                orderBy={table.orderBy}
                rowCount={users.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    users.map((u) => u.id)
                  )
                }
                headLabel={[
                  { id: 'full_name', label: 'Nama Lengkap' },
                  { id: 'email', label: 'Email' },
                  { id: 'createdAt', label: 'Tanggal Pembuatan' },
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
                      onEdit={() => handleOpenEditDialog(row)}
                    />
                  ))}

                <TableEmptyRows
                  height={68}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, users.length)}
                />

                {notFound && <TableNoData searchQuery={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          count={users.length}
          page={table.page}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>

      {/* Dialog Tambah */}
      <Dialog open={openAddDialog} onClose={handleCloseAddDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Tambah Pengguna Baru</DialogTitle>
        <DialogContent dividers>
          <Box display="flex" flexDirection="column" gap={2}>
            <input
              type="text"
              placeholder="Nama Lengkap"
              value={newUser.full_name}
              onChange={(e) => setNewUser({ ...newUser, full_name: e.target.value })}
            />
            <input
              type="email"
              placeholder="Email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            />
            <input
              type="password"
              placeholder="Password"
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddDialog}>Batal</Button>
          <Button onClick={handleAddUser} variant="contained">Simpan</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Edit */}
      <Dialog open={openEditDialog} onClose={handleCloseEditDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Pengguna</DialogTitle>
        <DialogContent dividers>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <input
              type="text"
              placeholder="Nama Lengkap"
              value={editUser?.full_name || ''}
              onChange={(e) =>
                setEditUser((prev) =>
                  prev ? { ...prev, full_name: e.target.value } : prev
                )
              }
              style={{
                padding: '10px',
                fontSize: '16px',
                borderRadius: '6px',
                border: '1px solid #ccc',
              }}
            />

            <input
              type="email"
              placeholder="Email"
              value={editUser?.email || ''}
              onChange={(e) =>
                setEditUser((prev) =>
                  prev ? { ...prev, email: e.target.value } : prev
                )
              }
              style={{
                padding: '10px',
                fontSize: '16px',
                borderRadius: '6px',
                border: '1px solid #ccc',
              }}
            />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseEditDialog} color="inherit">
            Batal
          </Button>
          <Button onClick={handleEditUser} variant="contained">
            Simpan Perubahan
          </Button>
        </DialogActions>
      </Dialog>


      {/* Dialog Detail */}
      <Dialog open={!!selectedUser} onClose={handleCloseDetail} maxWidth="sm" fullWidth>
        <DialogTitle>Detail Pengguna</DialogTitle>
        <DialogContent dividers>
          <Typography><strong>Nama:</strong> {selectedUser?.full_name}</Typography>
          <Typography><strong>Email:</strong> {selectedUser?.email}</Typography>
          <Typography><strong>Tanggal:</strong> {formatDate(selectedUser?.createdAt)}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetail}>Tutup</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Hapus */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Hapus Pengguna</DialogTitle>
        <DialogContent>
          <Typography>Yakin ingin menghapus {table.selected.length} pengguna?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Batal</Button>
          <Button onClick={handleDeleteSelected} variant="contained" color="error">Hapus</Button>
        </DialogActions>
      </Dialog>

      
      {/* Detail Dialog */}
      {selectedUser && (
        <Dialog open={!!selectedUser} onClose={handleCloseDetail} maxWidth="sm" fullWidth>
          <DialogTitle>Detail Pengguna</DialogTitle>
          <DialogContent dividers>
            <Typography variant="body1">
              <strong>Nama Lengkap:</strong> {selectedUser.full_name}
            </Typography>
            <Typography variant="body1">
              <strong>Email:</strong> {selectedUser.email}
            </Typography>
            <Typography variant="body1">
              <strong>Tanggal Pembuatan:</strong> {formatDate(selectedUser.createdAt)}
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
      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleSnackbarClose}>
        <MuiAlert onClose={handleSnackbarClose} severity={snackbarSeverity} elevation={6} variant="filled">
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
