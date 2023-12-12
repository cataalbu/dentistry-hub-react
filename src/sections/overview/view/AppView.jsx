import { useEffect } from 'react';
import { faker } from '@faker-js/faker';
import { useTheme } from '@emotion/react';
import { useDispatch } from 'react-redux';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import { getPatients } from 'src/redux/patient/patientSlice';

import Iconify from 'src/components/iconify';

import AppNewsUpdate from '../AppNewsUpdate';
import AppCurrentVisits from '../AppCurrentVisits';
import AppWidgetSummary from '../AppWidgetSummary';

// ----------------------------------------------------------------------

export default function AppView() {
  const theme = useTheme();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getPatients());
  }, [dispatch]);

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" sx={{ mb: 5 }}>
        Hi, Welcome back 👋
      </Typography>

      <Grid container spacing={3}>
        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Clients"
            total={123}
            color="info"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_users.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Total tests"
            total={123}
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

        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Patients diagnosed"
            total={87}
            color="success"
            icon={
              <Iconify icon="mdi:patient" width="64px" sx={{ color: theme.palette.success.main }} />
            }
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Failed tests"
            total={2}
            color="error"
            icon={
              <Iconify icon="ep:failed" width="64px" sx={{ color: theme.palette.error.main }} />
            }
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AppCurrentVisits
            title="Current results"
            chart={{
              series: [
                { label: 'MDD', value: 40 },
                { label: 'ADD', value: 27 },
                { label: 'LDD', value: 20 },
                { label: 'N', value: 36 },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <AppNewsUpdate
            title="Recent tests"
            list={[...Array(5)].map((_, index) => ({
              id: faker.string.uuid(),
              title: `${faker.person.firstName()} ${faker.person.lastName()}`,
              description: 'TMJD detected',
              image: `/assets/images/covers/cover_${index + 1}.jpg`,
              postedAt: faker.date.recent(),
            }))}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
