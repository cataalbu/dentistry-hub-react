import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect, useCallback } from 'react';

import { styled } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { Close, CloudUpload } from '@mui/icons-material';
import {
  Box,
  Card,
  Stack,
  Table,
  Modal,
  Button,
  Select,
  MenuItem,
  TableBody,
  InputLabel,
  IconButton,
  FormControl,
  TableContainer,
  TablePagination,
} from '@mui/material';

import { getPatients } from 'src/redux/patient/patientSlice';
import { getTmjdTests } from 'src/redux/tmjdTest/tmjdTestSlice';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import TableNoData from '../TableNoData';
import TableEmptyRows from '../table-empty-rows';
import TMJDTestTableRow from '../TMJDTestTableRow';
import TMJDTestTableHead from '../TMJDTestTableHead';
import TMJDTestTableToolbar from '../TMJDTestTableToolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

export default function TMJDTestView() {
  const dispatch = useDispatch();

  const { tmjdTests, success } = useSelector((state) => state.tmjdTest);
  const { user } = useSelector((state) => state.user);
  const { patients } = useSelector((state) => state.patient);

  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getTmjdTests());
    dispatch(getPatients());
  }, [dispatch]);

  useEffect(() => {
    console.log(tmjdTests);
    console.log(patients);
  }, [tmjdTests, patients]);

  const [addModalOpen, setAddModalOpen] = useState(false);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('id');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  // form

  const [selectPatient, setSelectPatient] = useState('');

  const [clImage, setClImage] = useState(null);
  const [crImage, setCrImage] = useState(null);
  const [sclImage, setSclImage] = useState(null);
  const [scrImage, setScrImage] = useState(null);
  const [solImage, setSolImage] = useState(null);
  const [sorImage, setSorImage] = useState(null);

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = tmjdTests.data.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleDelete = useCallback(
    async (id) => {
      await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/tmjd-tests/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${user.jwt}`,
        },
      });
    },
    [user]
  );
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

  const dataFiltered = applyFilter({
    inputData: tmjdTests.data || [],
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  const handleSubmit = useCallback(async () => {
    const formData = new FormData();
    formData.append('data', JSON.stringify({ patient: selectPatient }));
    formData.append('cl_image', clImage);
    formData.append('cr_image', crImage);
    formData.append('scl_image', sclImage);
    formData.append('scr_image', scrImage);
    formData.append('sol_image', solImage);
    formData.append('sor_image', sorImage);
    const res = await axios.post(`${import.meta.env.VITE_BACKEND_API_URL}/tmjd-tests`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${user.jwt}`,
      },
    });
    console.log(res);
    navigate(`/tmpjd-tests/${res.data.id}`);
  }, [selectPatient, clImage, crImage, sclImage, scrImage, solImage, sorImage, user, navigate]);

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Temporomandibular Disorder Tests</Typography>

        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="eva:plus-fill" />}
          onClick={() => setAddModalOpen(true)}
        >
          New test
        </Button>
      </Stack>
      {success && (
        <Card>
          <TMJDTestTableToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
          />

          <Scrollbar>
            <TableContainer sx={{ overflow: 'unset' }}>
              <Table sx={{ minWidth: 800 }}>
                <TMJDTestTableHead
                  order={order}
                  orderBy={orderBy}
                  rowCount={tmjdTests.data.length}
                  numSelected={selected.length}
                  onRequestSort={handleSort}
                  onSelectAllClick={handleSelectAllClick}
                  headLabel={[
                    { id: 'id', label: 'Id' },
                    { id: 'patientName', label: 'Patient name' },
                    { id: 'result', label: '' },
                    { id: 'details', label: 'Details' },
                    { id: '' },
                  ]}
                />
                <TableBody>
                  {dataFiltered
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <TMJDTestTableRow
                        key={row.id}
                        row={row}
                        selected={selected.indexOf(row.name) !== -1}
                        handleClick={(event) => handleClick(event, row.name)}
                        handleDetails={() => navigate(`/tmpjd-tests/${row.id}`)}
                        handleDelete={async () => {
                          await handleDelete(row.id);
                          dispatch(getTmjdTests());
                        }}
                      />
                    ))}

                  <TableEmptyRows
                    height={77}
                    emptyRows={emptyRows(page, rowsPerPage, tmjdTests.data.length)}
                  />

                  {notFound && <TableNoData query={filterName} />}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            page={page}
            component="div"
            count={tmjdTests.data.length}
            rowsPerPage={rowsPerPage}
            onPageChange={handleChangePage}
            rowsPerPageOptions={[5, 10, 25]}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      )}
      <Modal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '80%',
            height: '90%',
            backgroundColor: 'white',
            padding: '20px',
            overflow: 'scroll',
          }}
        >
          <h2 id="modal-modal-title">Add new TMJD Test</h2>
          <form>
            <FormControl fullWidth>
              <InputLabel id="patient-select-label">Patient</InputLabel>
              <Select
                labelId="patient-select-label"
                id="patient-select"
                value={selectPatient}
                label="Patient"
                onChange={(e) => setSelectPatient(e.target.value)}
              >
                {patients?.data?.map((patient) => (
                  <MenuItem value={patient.id}>{patient.attributes.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                width: 'fit-content',
              }}
            >
              <FormControl
                sx={{
                  mt: 2,
                  mr: 4,
                }}
              >
                <Typography id="patient-select-label" sx={{ mt: 2 }}>
                  Coronal left Image (CL)
                </Typography>
                {!clImage ? (
                  <Button component="label" variant="contained" startIcon={<CloudUpload />}>
                    Upload file
                    <VisuallyHiddenInput
                      type="file"
                      onChange={(e) => setClImage(e.target.files[0])}
                    />
                  </Button>
                ) : (
                  <div style={{ display: 'flex' }}>
                    <p>{clImage.name}</p>
                    <IconButton
                      variant="contained"
                      sx={{ marginLeft: 2 }}
                      onClick={() => setClImage(null)}
                    >
                      <Close fontSize="small" />
                    </IconButton>
                  </div>
                )}
              </FormControl>
              <FormControl
                sx={{
                  mt: 2,
                  mr: 4,
                }}
              >
                <Typography id="patient-select-label" sx={{ mt: 2 }}>
                  Coronal right Image (CR)
                </Typography>
                {!crImage ? (
                  <Button component="label" variant="contained" startIcon={<CloudUpload />}>
                    Upload file
                    <VisuallyHiddenInput
                      type="file"
                      onChange={(e) => setCrImage(e.target.files[0])}
                    />
                  </Button>
                ) : (
                  <div style={{ display: 'flex' }}>
                    <p>{crImage.name}</p>
                    <IconButton
                      variant="contained"
                      sx={{ marginLeft: 2 }}
                      onClick={() => setCrImage(null)}
                    >
                      <Close fontSize="small" />
                    </IconButton>
                  </div>
                )}
              </FormControl>
              <FormControl
                sx={{
                  mt: 2,
                  mr: 4,
                }}
              >
                <Typography id="patient-select-label" sx={{ mt: 2 }}>
                  Sagital Mouth Closed left Image (SCL)
                </Typography>
                {!sclImage ? (
                  <Button component="label" variant="contained" startIcon={<CloudUpload />}>
                    Upload file
                    <VisuallyHiddenInput
                      type="file"
                      onChange={(e) => setSclImage(e.target.files[0])}
                    />
                  </Button>
                ) : (
                  <div style={{ display: 'flex' }}>
                    <p>{sclImage.name}</p>
                    <IconButton
                      variant="contained"
                      sx={{ marginLeft: 2 }}
                      onClick={() => setSclImage(null)}
                    >
                      <Close fontSize="small" />
                    </IconButton>
                  </div>
                )}
              </FormControl>
              <FormControl
                sx={{
                  mt: 2,
                  mr: 4,
                }}
              >
                <Typography id="patient-select-label" sx={{ mt: 2 }}>
                  Sagital Mouth Closed right Image (SCR)
                </Typography>
                {!scrImage ? (
                  <Button component="label" variant="contained" startIcon={<CloudUpload />}>
                    Upload file
                    <VisuallyHiddenInput
                      type="file"
                      onChange={(e) => setScrImage(e.target.files[0])}
                    />
                  </Button>
                ) : (
                  <div style={{ display: 'flex' }}>
                    <p>{scrImage.name}</p>
                    <IconButton
                      variant="contained"
                      sx={{ marginLeft: 2 }}
                      onClick={() => setScrImage(null)}
                    >
                      <Close fontSize="small" />
                    </IconButton>
                  </div>
                )}
              </FormControl>
              <FormControl
                sx={{
                  mt: 2,
                  mr: 4,
                }}
              >
                <Typography id="patient-select-label" sx={{ mt: 2 }}>
                  Sagital Mouth Open left Image (SOL)
                </Typography>
                {!solImage ? (
                  <Button component="label" variant="contained" startIcon={<CloudUpload />}>
                    Upload file
                    <VisuallyHiddenInput
                      type="file"
                      onChange={(e) => setSolImage(e.target.files[0])}
                    />
                  </Button>
                ) : (
                  <div style={{ display: 'flex' }}>
                    <p>{solImage.name}</p>
                    <IconButton
                      variant="contained"
                      sx={{ marginLeft: 2 }}
                      onClick={() => setSolImage(null)}
                    >
                      <Close fontSize="small" />
                    </IconButton>
                  </div>
                )}
              </FormControl>
              <FormControl
                sx={{
                  mt: 2,
                  mr: 4,
                }}
              >
                <Typography id="patient-select-label" sx={{ mt: 2 }}>
                  Sagital Mouth Open right Image (SOR)
                </Typography>
                {!sorImage ? (
                  <Button component="label" variant="contained" startIcon={<CloudUpload />}>
                    Upload file
                    <VisuallyHiddenInput
                      type="file"
                      onChange={(e) => setSorImage(e.target.files[0])}
                    />
                  </Button>
                ) : (
                  <div style={{ display: 'flex' }}>
                    <p>{sorImage.name}</p>
                    <IconButton
                      variant="contained"
                      sx={{ marginLeft: 2 }}
                      onClick={() => setSorImage(null)}
                    >
                      <Close fontSize="small" />
                    </IconButton>
                  </div>
                )}
              </FormControl>
            </Box>
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 8 }}
              onClick={() => handleSubmit()}
              fullWidth
              disabled={
                !selectPatient ||
                !clImage ||
                !crImage ||
                !sclImage ||
                !scrImage ||
                !solImage ||
                !sorImage
              }
            >
              Submit
            </Button>
          </form>
        </div>
      </Modal>
    </Container>
  );
}
