import PropTypes from 'prop-types';

import Toolbar from '@mui/material/Toolbar';

// ----------------------------------------------------------------------

export default function TMJDTestTableToolbar({ numSelected, filterName, onFilterName }) {
  return (
    <Toolbar
      sx={{
        height: 96,
        display: 'flex',
        justifyContent: 'space-between',
        p: (theme) => theme.spacing(0, 1, 0, 3),
        ...(numSelected > 0 && {
          color: 'primary.main',
          bgcolor: 'primary.lighter',
        }),
      }}
    />
  );
}

TMJDTestTableToolbar.propTypes = {
  numSelected: PropTypes.number,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
};
