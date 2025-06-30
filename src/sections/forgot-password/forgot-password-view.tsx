import { useState, useCallback } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import { useRouter } from 'src/routes/hooks';
import api from '../../services/api'; // Import API instance

export function ForgotPasswordView() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = useCallback(async () => {
    setLoading(true);

    if (!email) {
      alert('Email tidak boleh kosong.');
      setLoading(false);
      return;
    }

    try {
      const response = await api.post('/auth/forgot-password', { email });

      alert('Link reset password telah dikirim ke email Anda.');
      router.push('/login');
    } catch (error) {
      console.error('Error sending forgot password email:', error);
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert('Terjadi kesalahan saat mengirim email reset password.');
      }
    } finally {
      setLoading(false);
    }
  }, [email, router]);

  const renderForm = (
    <Box display="flex" flexDirection="column" alignItems="flex-end">
      <TextField
        fullWidth
        name="email"
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        InputLabelProps={{ shrink: true }}
        sx={{ mb: 3 }}
      />

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        color="inherit"
        variant="contained"
        loading={loading}
        onClick={handleForgotPassword}
      >
        Kirim Link Reset Password
      </LoadingButton>
    </Box>
  );

  return (
    <>
      <Box gap={1.5} display="flex" flexDirection="column" alignItems="center" sx={{ mb: 5 }}>
        <Typography variant="h5">Lupa Password</Typography>
        <Typography variant="body2" color="text.secondary">
          Masukkan email yang terdaftar, kami akan mengirim link untuk reset password.
        </Typography>
      </Box>

      {renderForm}
    </>
  );
}
