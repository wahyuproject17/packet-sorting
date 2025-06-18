import React from 'react';
import { TableRow, TableCell, Checkbox, Button } from '@mui/material';
import { HistoryProps } from './types';

interface HistoryTableRowProps {
  row: HistoryProps;
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
    <TableCell>{row.packet?.receipt_number || '-'}</TableCell>
    <TableCell>{toTitleCase(row.packet_name)}</TableCell>
    <TableCell>{toTitleCase(row.packet?.destination || '-')}</TableCell>
    <TableCell>{formatDate(row.createdAt)}</TableCell>
    <TableCell>{toTitleCase(row.status)}</TableCell>
    <TableCell>
      <Button onClick={onViewDetail}>Detail</Button>
    </TableCell>
  </TableRow>
);
