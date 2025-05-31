import React from 'react';
import { TableRow, TableCell, Checkbox, Button } from '@mui/material';

interface AttendanceTableRowProps {
  row: {
    id: string;
    fullname: string;
    date: string;
    status: string;
  };
  selected: boolean;
  onSelectRow: () => void;
  onViewDetail: () => void;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  };
  return date.toLocaleString('id-ID', options); // Menggunakan format lokal Indonesia
};

export const AttendanceTableRow: React.FC<AttendanceTableRowProps> = ({
  row,
  selected,
  onSelectRow,
  onViewDetail,
}) => (
    <TableRow hover role="checkbox" selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onChange={onSelectRow} />
      </TableCell>
      <TableCell>{row.fullname}</TableCell>
      <TableCell>{formatDate(row.date)}</TableCell>
      <TableCell>{row.status}</TableCell>
      <TableCell>
        <Button onClick={onViewDetail}>Detail</Button>
      </TableCell>
    </TableRow>
  );
