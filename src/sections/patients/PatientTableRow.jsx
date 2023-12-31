import { useState } from 'react';
import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import { Button, Dialog } from '@mui/material';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function PatientTableRow({
  selected,
  name,
  avatarUrl,
  cnp,
  handleClick,
  handleDelete,
}) {
  const [open, setOpen] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(false);

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={handleClick} />
        </TableCell>

        <TableCell component="th" scope="row" padding="none">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar alt={name} src={avatarUrl} />
            <Typography variant="subtitle2" noWrap>
              {name}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell>
          <Typography variant="subtitle2" noWrap>
            {cnp}
          </Typography>{' '}
        </TableCell>

        <TableCell align="right">
          <IconButton onClick={handleOpenMenu}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: { width: 140 },
        }}
      >
        <MenuItem
          onClick={() => {
            handleCloseMenu();
            setDeleteDialog(true);
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>
      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
        <Stack direction="column" alignItems="center" justifyContent="space-between" sx={{ p: 3 }}>
          <Typography variant="subtitle1" sx={{ pr: 3 }}>
            Are you sure you want to delete?
          </Typography>
          <Stack sx={{ mt: 3 }} direction="row" spacing={2}>
            <Button variant="outlined" onClick={() => setDeleteDialog(false)}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                handleDelete();
                setDeleteDialog(false);
              }}
              sx={{ backgroundColor: 'error.main' }}
            >
              Delete
            </Button>
          </Stack>
        </Stack>
      </Dialog>
    </>
  );
}

PatientTableRow.propTypes = {
  avatarUrl: PropTypes.any,
  cnp: PropTypes.any,
  handleClick: PropTypes.func,
  name: PropTypes.any,
  selected: PropTypes.bool,
  handleDelete: PropTypes.func,
};
