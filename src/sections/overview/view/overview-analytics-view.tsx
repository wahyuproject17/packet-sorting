import { useEffect, useState } from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';
import { AnalyticsWidgetSummary } from '../analytics-widget-summary';
import api from '../../../services/api';

interface SmartBoxData {
  id: number;
  status: string;
  packet_key?: string;
  user_key?: string;
  packet_name?:string;
}

export function AttendanceAnalyticsView() {
  const TOTAL_BOXES = 3;

  const [smartBoxes, setSmartBoxes] = useState<SmartBoxData[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedBoxId, setSelectedBoxId] = useState<number | null>(null);
  const [packetName, setPacketName] = useState('');
  const [packetKey, setPacketKey] = useState('');
  const [userKey, setUserKey] = useState('');
  const [loading, setLoading] = useState(true);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [detailData, setDetailData] = useState<SmartBoxData | null>(null);

  const fetchSmartBoxData = async () => {
    try {
      const response = await api.get('/packet');
      const data = response.data.packets;

      // Pastikan tetap ada 3 box
      const completeBoxes: SmartBoxData[] = [];
      for (let i = 1; i <= TOTAL_BOXES; i += 1) {
        const existing = data.find((packet: any) => packet.id === i);
        if (existing) {
          completeBoxes.push({
            id: i,
            status: existing.status,
            packet_name: existing.packet_name,
            packet_key: existing.packet_key,
            user_key: existing.user_key,
          });
        } else {
          completeBoxes.push({ id: i, status: 'kosong' });
        }

      }

      setSmartBoxes(completeBoxes);
    } catch (error) {
      console.error('Error fetching SmartBox data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSmartBoxData();
  }, []);

  const statusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'terisi':
        return 'success';
      case 'kosong':
        return 'error';
      default:
        return 'warning';
    }
  };

  const handleBoxClick = (box: SmartBoxData) => {
  if (
  (!box.status || box.status.toLowerCase() === 'kosong') &&
  (!box.packet_key || !box.user_key)
) {
    setSelectedBoxId(box.id);
    setOpenDialog(true);
  } else if (box.status === 'terisi' || 'dalam pengiriman') {
    setDetailData(box);
    setDetailDialogOpen(true);
  }
};


  const handleSubmit = async () => {
    try {
      await api.put(`/packet/${selectedBoxId}`, {
        box_id: selectedBoxId,
        packet_name: packetName,
        packet_key: packetKey,
        user_key: userKey,
        status: "dalam pengiriman"
      });
      setOpenDialog(false);
      setPacketName('');
      setPacketKey('');
      setUserKey('');
      await fetchSmartBoxData(); // refresh data
    } catch (error) {
      console.error('Failed to update SmartBox:', error);
    }
  };

  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
        Hai, Selamat datang 👋
      </Typography>

      {loading ? (
        <Typography>Loading SmartBoxes...</Typography>
      ) : (
        <Grid container spacing={3}>
          {smartBoxes.map((box) => (
            <Grid key={box.id} xs={12} sm={6} md={4}>
              <Box
                onClick={() => handleBoxClick(box)}
                sx={{ cursor: box.status === 'kosong' ? 'pointer' : 'default' }}
              >
                <AnalyticsWidgetSummary
                  title={`Smart Box ${box.id}`}
                  total={box.status === 'terisi' ? 1 : 0}
                  color={statusColor(box.status)}
                  icon={<img alt="box" src="/assets/icons/glass/ic-box.svg" />}
                  status={box.status}
                />
              </Box>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={detailDialogOpen} onClose={() => setDetailDialogOpen(false)} maxWidth="xs" fullWidth>
      <DialogTitle>Detail Box</DialogTitle>
      <DialogContent dividers>
        <Typography variant="subtitle1"><strong>ID Box:</strong> {detailData?.id}</Typography>
        <Typography variant="subtitle1"><strong>Nama Paket:</strong> {detailData?.packet_name || '-'}</Typography>
        <Typography variant="subtitle1"><strong>Status:</strong> {detailData?.status}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setDetailDialogOpen(false)}>Tutup</Button>
      </DialogActions>
    </Dialog>


      {/* Dialog Form */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Isi Data SmartBox {selectedBoxId}</DialogTitle>
        <DialogContent>
          <TextField
            label="Nama Paket"
            fullWidth
            value={packetName}
            onChange={(e) => setPacketName(e.target.value)}
            margin="normal"
          />
          <TextField
            label="Packet Key"
            fullWidth
            value={packetKey}
            onChange={(e) => setPacketKey(e.target.value)}
            margin="normal"
          />
          <TextField
            label="User Key"
            fullWidth
            value={userKey}
            onChange={(e) => setUserKey(e.target.value)}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            Simpan
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardContent>
  );
}
