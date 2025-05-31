import React from 'react';
import { Toolbar, Typography, TextField } from '@mui/material';

interface AttendanceTableToolbarProps {
  numSelected: number;
  filterName: string;
  onFilterName: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const AttendanceTableToolbar: React.FC<AttendanceTableToolbarProps> = ({
  numSelected,
  filterName,
  onFilterName,
}) => (
    <Toolbar>
      {numSelected > 0 ? (
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {numSelected} selected
        </Typography>
      ) : (
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Presensi
        </Typography>
      )}
      <TextField
        variant="outlined"
        size="small"
        placeholder="Cari..."
        value={filterName}
        onChange={onFilterName}
      />
    </Toolbar>
  );
