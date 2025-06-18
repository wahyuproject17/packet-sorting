import React from 'react';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableSortLabel from '@mui/material/TableSortLabel';

// Define props type for AttendanceTableHead
interface AttendanceTableHeadProps {
  order: 'asc' | 'desc';
  orderBy: string;
  rowCount: number;
  numSelected: number;
  onSort: (id: string) => void;
  onSelectAllRows: (checked: boolean) => void;
  headLabel: { id: string; label: string }[];
}

export const AttendanceTableHead: React.FC<AttendanceTableHeadProps> = ({
  order,
  orderBy,
  rowCount,
  numSelected,
  onSort,
  onSelectAllRows,
  headLabel,
}) => {
  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSelectAllRows(event.target.checked);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <input
            type="checkbox"
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={handleSelectAllClick}
          />
        </TableCell>
        {headLabel.map((headCell) => (
          <TableCell key={headCell.id} sortDirection={orderBy === headCell.id ? order : false}>
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={() => onSort(headCell.id)}
            >
              {headCell.label}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};
