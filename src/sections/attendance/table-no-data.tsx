import React from 'react';
import { Box, Typography } from '@mui/material';

interface TableNoDataProps {
  searchQuery: string;
}

export const TableNoData: React.FC<TableNoDataProps> = ({ searchQuery }) => (
    <Box sx={{ textAlign: 'center', padding: 10 }}>
      <Typography variant="body1">
        Tidak ada data ditemukan {searchQuery && `untuk "${searchQuery}"`}
      </Typography>
    </Box>
  );
