import React from 'react';
import { TableRow, TableCell, Checkbox, Button } from '@mui/material';

interface HistoryTableRowProps {
  row: {
    id: number;
    id_packet: number;
    packet_name: string;
    status: string;
    entry_date: string;
    exit_date: string;
  };
  selected: boolean;
  onSelectRow: () => void;
  onViewDetail: () => void;
}

const toTitleCase = (str: string): string =>
  str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');



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
  return date.toLocaleString('id-ID', options);
};

export const HistoryTableRow: React.FC<HistoryTableRowProps> = ({
  row,
  selected,
  onSelectRow,
  onViewDetail,
}) => (
  <TableRow hover role="checkbox" selected={selected}>
    <TableCell padding="checkbox">
      <Checkbox checked={selected} onChange={onSelectRow} />
    </TableCell>
    <TableCell>{toTitleCase(row.packet_name)}</TableCell>
    <TableCell>{formatDate(row.entry_date)}</TableCell>
    <TableCell>{formatDate(row.entry_date)}</TableCell>
    <TableCell>{toTitleCase(row.status)}</TableCell>
    <TableCell>
      <Button onClick={onViewDetail}>Detail</Button>
    </TableCell>
  </TableRow>
);
