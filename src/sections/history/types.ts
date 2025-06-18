export interface HistoryProps {
  id: number;
  id_packet: number;
  packet_name: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  packet?: {
    id: number;
    destination: string;
    receipt_number: string;
  };
}