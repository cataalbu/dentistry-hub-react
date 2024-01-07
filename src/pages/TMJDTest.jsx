import { Helmet } from 'react-helmet-async';

import { TMJDTestView } from 'src/sections/tmjdTest/view';

// ----------------------------------------------------------------------

export default function TMJDTestPage() {
  return (
    <>
      <Helmet>
        <title> TMJD Test | DentaFun </title>
      </Helmet>

      <TMJDTestView />
    </>
  );
}
