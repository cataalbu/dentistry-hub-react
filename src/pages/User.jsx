import { Helmet } from 'react-helmet-async';

import { PatientsView } from 'src/sections/patients/view';

// ----------------------------------------------------------------------

export default function PatientsPage() {
  return (
    <>
      <Helmet>
        <title> Patients | DentaFun </title>
      </Helmet>

      <PatientsView />
    </>
  );
}
