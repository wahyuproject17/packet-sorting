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

export function UserTableRow({
  row,
  selected,
  onSelectRow,
  onViewDetail,
  onEdit,
}: UserTableRowProps) {
  const { full_name, email, createdAt } = row;

  return (
    <TableRow hover selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell>

      <TableCell>{full_name}</TableCell>
      <TableCell>{email}</TableCell>
      <TableCell>{createdAt}</TableCell>

      <TableCell align="right">
        <IconButton onClick={onViewDetail} color="primary">
          <Iconify icon="eva:eye-fill" />
        </IconButton>
        <IconButton onClick={onEdit} color="secondary">
          <Iconify icon="eva:edit-fill" />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}
