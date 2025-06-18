import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { PacketView } from 'src/sections/packet/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Packet - ${CONFIG.appName}`}</title>
      </Helmet>

      <PacketView />
    </>
  );
}
