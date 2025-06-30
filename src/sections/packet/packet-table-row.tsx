import { TableRow, TableCell, Checkbox, IconButton } from '@mui/material';
import { Iconify } from 'src/components/iconify';
import { UserProps } from './types';

interface UserTableRowProps {
  row: UserProps;
  selected: boolean;
  onSelectRow: () => void;
  onViewDetail: () => void;
  onEdit: () => void;
}

export function UserTableRow({ row, selected, onSelectRow, onViewDetail, onEdit }: UserTableRowProps) {
  const { receipt_number, packet_name, destination, status, createdAt } = row;

  return (
    <TableRow hover selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell>

      <TableCell>{receipt_number}</TableCell>
      <TableCell>{packet_name}</TableCell>
      <TableCell>{destination}</TableCell>
      <TableCell>{createdAt}</TableCell>
      <TableCell>{status}</TableCell>

      <TableCell align="right">
        {/* Tombol View Detail */}
        <IconButton onClick={onViewDetail} color="primary">
          <Iconify icon="eva:eye-fill" />
        </IconButton>

        {/* Tombol Edit */}
        <IconButton onClick={onEdit} color="secondary">
          <Iconify icon="eva:edit-fill" />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}
