import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect, useCallback } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import { Box, Modal, TextField } from '@mui/material';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import { users } from 'src/_mock/user';
import { getPatients } from 'src/redux/patient/patientSlice';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import TableNoData from '../TableNoData';
import PatientTableRow from '../PatientTableRow';
import TableEmptyRows from '../table-empty-rows';
import PatientTableHead from '../PatientTableHead';
import PatientTableToolbar from '../UserTableToolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';

// ----------------------------------------------------------------------

export default function PatientsPage() {
  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [open, setOpen] = useState(false);
  const [patientName, setPatientName] = useState('');
  const [patientCNP, setPatientCNP] = useState('');

  const { patients } = useSelector((state) => state.patient);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getPatients());
  }, [dispatch]);

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = users.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const handleDelete = useCallback(
    async (id) => {
      await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/patients/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.jwt}`,
        },
      });
      dispatch(getPatients());
    },
    [user, dispatch]
  );

  const handleSubmit = useCallback(async () => {
    await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/patients`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.jwt}`,
      },
      body: JSON.stringify({
        data: { name: patientName, CNP: patientCNP },
      }),
    });
    dispatch(getPatients());
  }, [user, patientName, patientCNP, dispatch]);

  const dataFiltered = applyFilter({
    inputData: users,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Patients</Typography>

        <Button
          variant="contained"
          onClick={() => setOpen(true)}
          color="inherit"
          startIcon={<Iconify icon="eva:plus-fill" />}
        >
          New Patient
        </Button>
      </Stack>

      <Card>
        <PatientTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <PatientTableHead
                order={order}
                orderBy={orderBy}
                rowCount={users.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[{ id: 'name', label: 'Name' }, { id: 'cnp', label: 'CNP' }, { id: '' }]}
              />
              <TableBody>
                {patients?.data
                  ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <PatientTableRow
                      key={row.id}
                      name={row.attributes.name}
                      cnp={row.attributes.CNP}
                      avatarUrl={row.avatarUrl}
                      selected={selected.indexOf(row.name) !== -1}
                      handleClick={(event) => handleClick(event, row.name)}
                      handleDelete={() => handleDelete(row.id)}
                    />
                  ))}

                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, users.length)}
                />

                {notFound && <TableNoData query={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          page={page}
          component="div"
          count={users.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            p: 4,
          }}
        >
          <h2>Add new patient</h2>
          <form>
            <TextField
              type="text"
              id="name"
              label="Name"
              variant="outlined"
              margin="normal"
              fullWidth
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
            />
            <TextField
              type="text"
              id="cnp"
              label="CNP"
              variant="outlined"
              margin="normal"
              fullWidth
              value={patientCNP}
              onChange={(e) => setPatientCNP(e.target.value)}
            />
            <Button
              variant="contained"
              onClick={() => {
                handleSubmit();
                setOpen(false);
              }}
              fullWidth
              sx={{ mt: 2 }}
              disabled={!patientName || !patientCNP}
            >
              Add
            </Button>
          </form>
        </Box>
      </Modal>
    </Container>
  );
}
