import { useState } from 'react';
import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';
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

export default function TMJDTestTableRow({
  selected,
  row: { id, attributes },
  handleClick,
  handleDetails,
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

        <TableCell component="th" scope="row" padding="8">
          <Stack direction="row" alignItems="center" spacing={4}>
            <Typography variant="subtitle2" noWrap>
              {id}
            </Typography>
          </Stack>
        </TableCell>
        <TableCell component="th" scope="row" padding="8">
          <Stack direction="row" alignItems="center" spacing={4}>
            <Typography variant="subtitle2" noWrap>
              {attributes.patient.data.attributes.name}
            </Typography>
          </Stack>
        </TableCell>
        <TableCell component="th" scope="row" padding="8">
          <Stack direction="row" alignItems="center" spacing={4}>
            <Typography variant="subtitle2" noWrap>
              {attributes.result}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell component="th" scope="row" padding="8">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Button variant="contained" color="primary" size="small" onClick={handleDetails}>
              View
            </Button>
          </Stack>
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
            setDeleteDialog(true);
            handleCloseMenu();
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

TMJDTestTableRow.propTypes = {
  handleClick: PropTypes.func,
  attributes: PropTypes.any,
  row: PropTypes.any,
  selected: PropTypes.any,
  handleDetails: PropTypes.func,
  handleDelete: PropTypes.func,
};
