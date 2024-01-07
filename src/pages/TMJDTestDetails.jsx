import { Helmet } from 'react-helmet-async';

import TMJDTestDetailsView from 'src/sections/tmjdTest/view/TMJDTestDetailsView';

// ----------------------------------------------------------------------

export default function TMJDTestDetailsPage() {
  return (
    <>
      <Helmet>
        <title> TMJD Tests | DentaFun </title>
      </Helmet>

      <TMJDTestDetailsView />
    </>
  );
}
