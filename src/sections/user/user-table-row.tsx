import { TableRow, TableCell, Checkbox, IconButton } from '@mui/material';
import { Iconify } from 'src/components/iconify';
import { UserProps } from './types'; // Import tipe yang sama

interface UserTableRowProps {
  row: UserProps;
  selected: boolean;
  onSelectRow: () => void;
  onViewDetail: () => void;
}

export function UserTableRow({ row, selected, onSelectRow, onViewDetail }: UserTableRowProps) {
  const { full_name, email, createdAt  }= row;

  return (
    <TableRow hover selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell>

      <TableCell>{full_name}</TableCell>
      <TableCell>{email}</TableCell>
      <TableCell>{createdAt}</TableCell>

      <TableCell align="right">
        <IconButton onClick={onViewDetail}>
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}
