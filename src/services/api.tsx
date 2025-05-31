import axios from 'axios';

// Konfigurasi instance Axios
const api = axios.create({
  baseURL: 'http://localhost:3000/api/v1', // Ganti dengan IP dan port backend Express Anda
  timeout: 10000, // Waktu tunggu 10 detik
  headers: {
    'Content-Type': 'application/json',
  },
});

// Tambahkan interceptor untuk menyertakan Bearer Token
api.interceptors.request.use(
  (config) => {
    try {
      // Ambil data pengguna dari localStorage
      const userData = localStorage.getItem('user');

      if (userData) {
        const parsedUserData = JSON.parse(userData); // Parse data JSON
        const token = parsedUserData.token; // Ambil token dari data pengguna

        if (token) {
          config.headers.Authorization = `Bearer ${token}`; // Tambahkan token ke header Authorization
        }
      }
    } catch (error) {
      console.error("Gagal mengambil token dari localStorage:", error);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
