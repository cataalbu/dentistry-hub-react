import { useSelector } from 'react-redux';
import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import {
  Box,
  Stack,
  Modal,
  Button,
  Select,
  MenuItem,
  Container,
  Typography,
  InputLabel,
  FormControl,
} from '@mui/material';

import getPrescurtation from 'src/utils/prescurtation';

export default function TMJDTestDetailsView() {
  const [tmjdTest, setTmjdTest] = useState(null);
  const [reportProblemOpen, setReportProblemOpen] = useState(false);
  const [reportProblemImage, setReportProblemImage] = useState(null);

  const [problemSolution, setProblemSolution] = useState('');

  const { user } = useSelector((state) => state.user);
  const { id } = useParams();
  const navigate = useNavigate();

  const handleReportProblem = useCallback(
    async (imageId, solution) => {
      await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/mri-images/${imageId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.jwt}`,
        },
        body: JSON.stringify({
          data: { problemReported: true, reportedProblemSolution: solution },
        }),
      });
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_API_URL}/tmjd-tests/${id}?populate=deep`,
        {
          headers: {
            Authorization: `Bearer ${user.jwt}`,
          },
        }
      );
      const data = await res.json();
      if (data.data) {
        setTmjdTest(data.data);
      }
    },
    [user, id]
  );

  useEffect(() => {
    (async () => {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_API_URL}/tmjd-tests/${id}?populate=deep`,
        {
          headers: {
            Authorization: `Bearer ${user.jwt}`,
          },
        }
      );
      const data = await res.json();
      if (data.data) {
        setTmjdTest(data.data);
      } else {
        navigate('/tmpjd-tests');
      }
    })();
  }, [user, id, navigate]);

  useEffect(() => {
    console.log(tmjdTest);
  }, [tmjdTest]);

  return (
    <Container>
      <h1>Temporomandibular Disorder Test Details</h1>
      {tmjdTest ? (
        <Stack>
          <Typography variant="h4">#{tmjdTest.id}</Typography>
          <Typography style={{ fontSize: 22 }}>
            <span
              style={{
                fontWeight: 'bold',
              }}
            >
              Patient:
            </span>
            <span style={{ marginLeft: 16 }}>
              {tmjdTest.attributes.patient.data.attributes.name}
            </span>
          </Typography>
          <Box
            style={{
              marginTop: 32,
            }}
          >
            <Typography style={{ fontSize: 22, fontWeight: 'bold' }}>
              Coronal left Image (CL)
            </Typography>
            <Box
              style={{
                display: 'flex',
                alignItems: 'center',
                marginTop: 16,
              }}
            >
              <img
                src={
                  import.meta.env.VITE_BACKENd_IMAGE_URL +
                  tmjdTest.attributes.cl_image.data.attributes.image.data.attributes.url
                }
                alt="cl_image"
                style={{ width: 400, height: 'auto', marginRight: 32 }}
              />
              <Box>
                <Typography style={{ fontSize: 18 }}>
                  <span
                    style={{
                      fontWeight: 'bold',
                    }}
                  >
                    Result:
                  </span>
                  <span style={{ marginLeft: 32 }}>
                    {getPrescurtation(tmjdTest.attributes.cl_image.data.attributes.result)}
                  </span>
                </Typography>

                {tmjdTest.attributes.cl_image.data.attributes.problemReported ? (
                  <Typography style={{ fontSize: 18 }}>
                    <span
                      style={{
                        fontWeight: 'bold',
                      }}
                    >
                      Reported result:
                    </span>
                    <span style={{ marginLeft: 32 }}>
                      {getPrescurtation(
                        tmjdTest.attributes.cl_image.data.attributes.reportedProblemSolution
                      )}
                    </span>
                  </Typography>
                ) : null}
                {!tmjdTest.attributes.cl_image.data.attributes.problemReported ? (
                  <Button
                    onClick={() => {
                      setReportProblemOpen(true);
                      setReportProblemImage({
                        type: 'CL',
                        id: tmjdTest.attributes.cl_image.data.id,
                      });
                    }}
                    style={{ marginTop: 16 }}
                    variant="contained"
                  >
                    Report a problem
                  </Button>
                ) : null}
              </Box>
            </Box>
          </Box>
          <Box
            style={{
              marginTop: 32,
            }}
          >
            <Typography style={{ fontSize: 22, fontWeight: 'bold' }}>
              Coronal right Image (CR)
            </Typography>
            <Box
              style={{
                display: 'flex',
                alignItems: 'center',
                marginTop: 16,
              }}
            >
              <img
                src={
                  import.meta.env.VITE_BACKENd_IMAGE_URL +
                  tmjdTest.attributes.cr_image.data.attributes.image.data.attributes.url
                }
                alt="cl_image"
                style={{ width: 400, height: 'auto', marginRight: 32 }}
              />
              <Box>
                <Typography style={{ fontSize: 18 }}>
                  <span
                    style={{
                      fontWeight: 'bold',
                    }}
                  >
                    Result:
                  </span>
                  <span style={{ marginLeft: 32 }}>
                    {getPrescurtation(tmjdTest.attributes.cr_image.data.attributes.result)}
                  </span>
                </Typography>

                {tmjdTest.attributes.cr_image.data.attributes.problemReported ? (
                  <Typography style={{ fontSize: 18 }}>
                    <span
                      style={{
                        fontWeight: 'bold',
                      }}
                    >
                      Reported result:
                    </span>
                    <span style={{ marginLeft: 32 }}>
                      {getPrescurtation(
                        tmjdTest.attributes.cr_image.data.attributes.reportedProblemSolution
                      )}
                    </span>
                  </Typography>
                ) : null}
                {!tmjdTest.attributes.cr_image.data.attributes.problemReported ? (
                  <Button
                    onClick={() => {
                      setReportProblemOpen(true);
                      setReportProblemImage({
                        type: 'CR',
                        id: tmjdTest.attributes.cr_image.data.id,
                      });
                    }}
                    style={{ marginTop: 16 }}
                    variant="contained"
                  >
                    Report a problem
                  </Button>
                ) : null}
              </Box>
            </Box>
          </Box>
          <Box
            style={{
              marginTop: 32,
            }}
          >
            <Typography style={{ fontSize: 22, fontWeight: 'bold' }}>
              Sagital Mouth Closed left Image (SCL)
            </Typography>
            <Box
              style={{
                display: 'flex',
                alignItems: 'center',
                marginTop: 16,
              }}
            >
              <img
                src={
                  import.meta.env.VITE_BACKENd_IMAGE_URL +
                  tmjdTest.attributes.scl_image.data.attributes.image.data.attributes.url
                }
                alt="cl_image"
                style={{ width: 400, height: 'auto', marginRight: 32 }}
              />
              <Box>
                <Typography style={{ fontSize: 18 }}>
                  <span
                    style={{
                      fontWeight: 'bold',
                    }}
                  >
                    Result:
                  </span>
                  <span style={{ marginLeft: 32 }}>
                    {getPrescurtation(tmjdTest.attributes.scl_image.data.attributes.result)}
                  </span>
                </Typography>

                {tmjdTest.attributes.scl_image.data.attributes.problemReported ? (
                  <Typography style={{ fontSize: 18 }}>
                    <span
                      style={{
                        fontWeight: 'bold',
                      }}
                    >
                      Reported result:
                    </span>
                    <span style={{ marginLeft: 32 }}>
                      {getPrescurtation(
                        tmjdTest.attributes.scl_image.data.attributes.reportedProblemSolution
                      )}
                    </span>
                  </Typography>
                ) : null}
                {!tmjdTest.attributes.scl_image.data.attributes.problemReported ? (
                  <Button
                    onClick={() => {
                      setReportProblemOpen(true);
                      setReportProblemImage({
                        type: 'SCL',
                        id: tmjdTest.attributes.scl_image.data.id,
                      });
                    }}
                    style={{ marginTop: 16 }}
                    variant="contained"
                  >
                    Report a problem
                  </Button>
                ) : null}
              </Box>
            </Box>
          </Box>
          <Box
            style={{
              marginTop: 32,
            }}
          >
            <Typography style={{ fontSize: 22, fontWeight: 'bold' }}>
              Sagital Mouth Closed right Image (SCR)
            </Typography>
            <Box
              style={{
                display: 'flex',
                alignItems: 'center',
                marginTop: 16,
              }}
            >
              <img
                src={
                  import.meta.env.VITE_BACKENd_IMAGE_URL +
                  tmjdTest.attributes.scr_image.data.attributes.image.data.attributes.url
                }
                alt="cl_image"
                style={{ width: 400, height: 'auto', marginRight: 32 }}
              />
              <Box>
                <Typography style={{ fontSize: 18 }}>
                  <span
                    style={{
                      fontWeight: 'bold',
                    }}
                  >
                    Result:
                  </span>
                  <span style={{ marginLeft: 32 }}>
                    {getPrescurtation(tmjdTest.attributes.scr_image.data.attributes.result)}
                  </span>
                </Typography>

                {tmjdTest.attributes.scr_image.data.attributes.problemReported ? (
                  <Typography style={{ fontSize: 18 }}>
                    <span
                      style={{
                        fontWeight: 'bold',
                      }}
                    >
                      Reported result:
                    </span>
                    <span style={{ marginLeft: 32 }}>
                      {getPrescurtation(
                        tmjdTest.attributes.scr_image.data.attributes.reportedProblemSolution
                      )}
                    </span>
                  </Typography>
                ) : null}
                {!tmjdTest.attributes.scr_image.data.attributes.problemReported ? (
                  <Button
                    onClick={() => {
                      setReportProblemOpen(true);
                      setReportProblemImage({
                        type: 'SCR',
                        id: tmjdTest.attributes.scr_image.data.id,
                      });
                    }}
                    style={{ marginTop: 16 }}
                    variant="contained"
                  >
                    Report a problem
                  </Button>
                ) : null}
              </Box>
            </Box>
          </Box>
          <Box
            style={{
              marginTop: 32,
            }}
          >
            <Typography style={{ fontSize: 22, fontWeight: 'bold' }}>
              Sagital Mouth Open left Image (SOL)
            </Typography>
            <Box
              style={{
                display: 'flex',
                alignItems: 'center',
                marginTop: 16,
              }}
            >
              <img
                src={
                  import.meta.env.VITE_BACKENd_IMAGE_URL +
                  tmjdTest.attributes.sol_image.data.attributes.image.data.attributes.url
                }
                alt="cl_image"
                style={{ width: 400, height: 'auto', marginRight: 32 }}
              />
              <Box>
                <Typography style={{ fontSize: 18 }}>
                  <span
                    style={{
                      fontWeight: 'bold',
                    }}
                  >
                    Result:
                  </span>
                  <span style={{ marginLeft: 32 }}>
                    {getPrescurtation(tmjdTest.attributes.sol_image.data.attributes.result)}
                  </span>
                </Typography>

                {tmjdTest.attributes.sol_image.data.attributes.problemReported ? (
                  <Typography style={{ fontSize: 18 }}>
                    <span
                      style={{
                        fontWeight: 'bold',
                      }}
                    >
                      Reported result:
                    </span>
                    <span style={{ marginLeft: 32 }}>
                      {getPrescurtation(
                        tmjdTest.attributes.sol_image.data.attributes.reportedProblemSolution
                      )}
                    </span>
                  </Typography>
                ) : null}
                {!tmjdTest.attributes.sol_image.data.attributes.problemReported ? (
                  <Button
                    onClick={() => {
                      setReportProblemOpen(true);
                      setReportProblemImage({
                        type: 'SOL',
                        id: tmjdTest.attributes.sol_image.data.id,
                      });
                    }}
                    style={{ marginTop: 16 }}
                    variant="contained"
                  >
                    Report a problem
                  </Button>
                ) : null}
              </Box>
            </Box>
          </Box>
          <Box
            style={{
              marginTop: 32,
            }}
          >
            <Typography style={{ fontSize: 22, fontWeight: 'bold' }}>
              Sagital Mouth Open right Image (SOR)
            </Typography>
            <Box
              style={{
                display: 'flex',
                alignItems: 'center',
                marginTop: 16,
              }}
            >
              <img
                src={
                  import.meta.env.VITE_BACKENd_IMAGE_URL +
                  tmjdTest.attributes.sor_image.data.attributes.image.data.attributes.url
                }
                alt="cl_image"
                style={{ width: 400, height: 'auto', marginRight: 32 }}
              />
              <Box>
                <Typography style={{ fontSize: 18 }}>
                  <span
                    style={{
                      fontWeight: 'bold',
                    }}
                  >
                    Result:
                  </span>
                  <span style={{ marginLeft: 32 }}>
                    {getPrescurtation(tmjdTest.attributes.sor_image.data.attributes.result)}
                  </span>
                </Typography>

                {tmjdTest.attributes.sor_image.data.attributes.problemReported ? (
                  <Typography style={{ fontSize: 18 }}>
                    <span
                      style={{
                        fontWeight: 'bold',
                      }}
                    >
                      Reported result:
                    </span>
                    <span style={{ marginLeft: 32 }}>
                      {getPrescurtation(
                        tmjdTest.attributes.sor_image.data.attributes.reportedProblemSolution
                      )}
                    </span>
                  </Typography>
                ) : null}
                {!tmjdTest.attributes.sor_image.data.attributes.problemReported ? (
                  <Button
                    onClick={() => {
                      setReportProblemOpen(true);
                      setReportProblemImage({
                        type: 'SOR',
                        id: tmjdTest.attributes.sor_image.data.id,
                      });
                    }}
                    style={{ marginTop: 16 }}
                    variant="contained"
                  >
                    Report a problem
                  </Button>
                ) : null}
              </Box>
            </Box>
          </Box>
        </Stack>
      ) : null}
      <Modal
        open={reportProblemOpen}
        onClose={() => {
          setReportProblemOpen(false);
          setReportProblemImage(null);
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 600,
            bgcolor: 'background.paper',
            p: 4,
          }}
        >
          {reportProblemImage ? (
            <>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Report a problem for the {reportProblemImage.type} image
              </Typography>
              <FormControl
                fullWidth
                style={{
                  marginTop: 16,
                }}
              >
                <InputLabel id="select-label">Select solution</InputLabel>

                <Select
                  value={problemSolution}
                  onChange={(e) => {
                    setProblemSolution(e.target.value);
                  }}
                  label="Problem solution"
                  placeholder="Select solution"
                  id="select-label"
                  fullWidth
                >
                  <MenuItem value="N">{getPrescurtation('N')}</MenuItem>
                  <MenuItem value="LDD">{getPrescurtation('LDD')}</MenuItem>
                  <MenuItem value="ADD">{getPrescurtation('ADD')}</MenuItem>
                  <MenuItem value="MDD">{getPrescurtation('MDD')}</MenuItem>
                </Select>
              </FormControl>
              <Button
                onClick={() => {
                  handleReportProblem(reportProblemImage.id, problemSolution);
                  setReportProblemOpen(false);
                  setReportProblemImage(null);
                  setProblemSolution('');
                }}
                style={{ marginTop: 16 }}
                variant="contained"
                disabled={problemSolution === ''}
              >
                Submit
              </Button>
            </>
          ) : null}
        </Box>
      </Modal>
    </Container>
  );
}
