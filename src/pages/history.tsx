import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { AttendanceView } from 'src/sections/history/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`History - ${CONFIG.appName}`}</title>
      </Helmet>

      <AttendanceView />
    </>
  );
}
