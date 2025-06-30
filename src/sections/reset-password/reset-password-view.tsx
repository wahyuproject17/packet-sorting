import { useState, useCallback } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import { useRouter } from 'src/routes/hooks';
import { Iconify } from 'src/components/iconify';
import api from '../../services/api'; // API instance

export function ResetPasswordView() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleResetPassword = useCallback(async () => {
    setLoading(true);

    // Validasi form
    if (!newPassword || !confirmPassword) {
      alert('Password baru dan konfirmasi tidak boleh kosong.');
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      alert('Password dan konfirmasi tidak sama.');
      setLoading(false);
      return;
    }

    try {
      // Misal token reset dari URL, kalau ada
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');

      const response = await api.post('/auth/reset-password', {
        token,
        newPassword,
      });

      alert('Password berhasil direset. Silakan login kembali.');
      router.push('/login');
    } catch (error) {
      console.error('Error resetting password:', error);
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert('Terjadi kesalahan saat reset password.');
      }
    } finally {
      setLoading(false);
    }
  }, [newPassword, confirmPassword, router]);

  const renderForm = (
    <Box display="flex" flexDirection="column" alignItems="flex-end">
      <TextField
        fullWidth
        name="newPassword"
        label="Password Baru"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        InputLabelProps={{ shrink: true }}
        type={showPassword ? 'text' : 'password'}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                <Iconify icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{ mb: 3 }}
      />

      <TextField
        fullWidth
        name="confirmPassword"
        label="Konfirmasi Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        InputLabelProps={{ shrink: true }}
        type={showPassword ? 'text' : 'password'}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                <Iconify icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{ mb: 3 }}
      />

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        color="inherit"
        variant="contained"
        loading={loading}
        onClick={handleResetPassword}
      >
        Reset Password
      </LoadingButton>
    </Box>
  );

  return (
    <>
      <Box gap={1.5} display="flex" flexDirection="column" alignItems="center" sx={{ mb: 5 }}>
        <Typography variant="h5">Reset Password</Typography>
        <Typography variant="body2" color="text.secondary">
          Masukkan password baru untuk akun Anda.
        </Typography>
      </Box>

      {renderForm}
    </>
  );
}
