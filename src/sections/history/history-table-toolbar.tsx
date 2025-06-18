import React from 'react';
import { Toolbar, Typography, TextField, IconButton, Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

interface AttendanceTableToolbarProps {
  numSelected: number;
  filterName: string;
  onFilterName: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDeleteSelected?: () => void; // optional handler tombol hapus
}

export const AttendanceTableToolbar: React.FC<AttendanceTableToolbarProps> = ({
  numSelected,
  filterName,
  onFilterName,
  onDeleteSelected,
}) => (
  <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
    {numSelected > 0 ? (
      <>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {numSelected} selected
        </Typography>
        <Tooltip title="Hapus">
          <IconButton onClick={onDeleteSelected} color="error">
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </>
    ) : (
      <>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Riwayat Paket
        </Typography>
        <TextField
          variant="outlined"
          size="small"
          placeholder="Cari..."
          value={filterName}
          onChange={onFilterName}
        />
      </>
    )}
  </Toolbar>
);
