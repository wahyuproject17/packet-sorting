import { Helmet } from 'react-helmet-async';
import { CONFIG } from 'src/config-global';
import { ForgotPasswordView } from '../sections/forgot-password';

// ----------------------------------------------------------------------
export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Reset Password - ${CONFIG.appName}`}</title>
      </Helmet>

      <ForgotPasswordView />
    </>
  );
}