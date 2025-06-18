import { useEffect, useState } from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import {
  Box,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';
import { AnalyticsWidgetSummary } from '../analytics-widget-summary';
import api from '../../../services/api';

// Tipe data paket terbaru
interface RecentPacket {
  id: number;
  packet_name: string;
  receipt_number: string;
  destination: string;
  status: string;
  createdAt: string;
}

export function AttendanceAnalyticsView() {
  const [totalPackets, setTotalPackets] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [recentPackets, setRecentPackets] = useState<RecentPacket[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/dashboard');
      const data = response.data?.data;

      setTotalPackets(data.totalPackets);
      setTotalUsers(data.totalUsers);
      setRecentPackets(data.recentPackets);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
        Hai, Selamat datang 👋
      </Typography>

      {loading ? (
        <Typography>Loading data dashboard...</Typography>
      ) : (
        <>
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid xs={12} sm={6} md={4}>
              <AnalyticsWidgetSummary
                title="Total Paket"
                total={totalPackets}
                color="info"
                icon={<img alt="icon" src="/assets/icons/glass/ic-box.svg" />}
              />
            </Grid>
            <Grid xs={12} sm={6} md={4}>
              <AnalyticsWidgetSummary
                title="Total Pengguna"
                total={totalUsers}
                color="success"
                icon={<img alt="icon" src="/assets/icons/glass/ic-glass-users.svg" />}
              />
            </Grid>
          </Grid>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Paket Terbaru
              </Typography>
              <List>
                {recentPackets.length === 0 ? (
                  <Typography>Tidak ada paket terbaru.</Typography>
                ) : (
                  recentPackets.map((packet) => (
                    <Box key={packet.id}>
                      <ListItem>
                        <ListItemText
                          primary={packet.packet_name}
                          secondary={`Tujuan: ${packet.destination} | Status: ${packet.status}`}
                        />
                      </ListItem>
                      <Divider />
                    </Box>
                  ))
                )}
              </List>
            </CardContent>
          </Card>
        </>
      )}
    </DashboardContent>
  );
}
