import React from 'react';
import { TableRow, TableCell } from '@mui/material';

interface TableEmptyRowsProps {
  height: number;
  emptyRows: number;
}

export const TableEmptyRows: React.FC<TableEmptyRowsProps> = ({ height, emptyRows }) => (
    <>
      {Array.from({ length: emptyRows }).map((_, index) => (
        <TableRow key={index} style={{ height }}>
          <TableCell colSpan={6} />
        </TableRow>
      ))}
    </>
  );
