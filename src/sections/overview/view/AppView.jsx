/* eslint-disable no-plusplus */
import { useTheme } from '@emotion/react';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';

import getPrescurtation from 'src/utils/prescurtation';

import { getPatients } from 'src/redux/patient/patientSlice';
import { getTmjdTests } from 'src/redux/tmjdTest/tmjdTestSlice';
import { getMriImages } from 'src/redux/mriImage/mriImageSlice';

import Iconify from 'src/components/iconify';

import AppCurrentVisits from '../AppCurrentVisits';
import AppWidgetSummary from '../AppWidgetSummary';

// ----------------------------------------------------------------------

export default function AppView() {
  const theme = useTheme();

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getPatients());
    dispatch(getTmjdTests());
    dispatch(getMriImages());
  }, [dispatch]);

  const { patients } = useSelector((state) => state.patient);
  const { tmjdTests } = useSelector((state) => state.tmjdTest);
  const { mriImages } = useSelector((state) => state.mriImage);

  const [chartData, setChartData] = useState([
    { label: getPrescurtation('MDD'), value: 0 },
    { label: getPrescurtation('ADD'), value: 0 },
    { label: getPrescurtation('LDD'), value: 0 },
    { label: getPrescurtation('N'), value: 0 },
  ]);

  useEffect(() => {
    if (mriImages?.data) {
      let mdd = 0;
      let add = 0;
      let ldd = 0;
      let n = 0;
      mriImages.data.forEach((mriImage) => {
        switch (mriImage.attributes.result) {
          case 'MDD':
            mdd++;
            break;
          case 'ADD':
            add++;
            break;
          case 'LDD':
            ldd++;
            break;
          case 'N':
            n++;
            break;
          default:
            break;
        }
      });
      setChartData([
        { label: getPrescurtation('MDD'), value: mdd },
        { label: getPrescurtation('ADD'), value: add },
        { label: getPrescurtation('LDD'), value: ldd },
        { label: getPrescurtation('N'), value: n },
      ]);
    } else {
      setChartData([
        { label: getPrescurtation('MDD'), value: 0 },
        { label: getPrescurtation('ADD'), value: 0 },
        { label: getPrescurtation('LDD'), value: 0 },
        { label: getPrescurtation('N'), value: 0 },
      ]);
    }
  }, [mriImages]);

  return (
    <Container maxWidth="xl">
      <Grid container spacing={3}>
        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Patients"
            total={patients?.data?.length}
            color="info"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_users.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Total tests"
            total={tmjdTests?.data?.length}
            color="warning"
            icon={
              <Iconify
                icon="healthicons:i-exam-multiple-choice-outline"
                width="64px"
                sx={{ color: theme.palette.warning.main }}
              />
            }
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AppCurrentVisits
            title="MRI Results"
            chart={{
              series: chartData,
            }}
          />
        </Grid>

        {/* <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Patients diagnosed"
            total={87}
            color="success"
            icon={
              <Iconify icon="mdi:patient" width="64px" sx={{ color: theme.palette.success.main }} />
            }
          />
        </Grid> */}

        {/* <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Failed tests"
            total={2}
            color="error"
            icon={
              <Iconify icon="ep:failed" width="64px" sx={{ color: theme.palette.error.main }} />
            }
          />
        </Grid> */}
      </Grid>
    </Container>
  );
}
