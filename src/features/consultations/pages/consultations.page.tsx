import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  TextField,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import PersonIcon from "@mui/icons-material/Person";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useConsultations, useUpdateConsultationStatus } from "../../../hooks/use-consultations.hooks";
import { useAuthStore } from "../../../store/auth.store";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import InfoIcon from "@mui/icons-material/Info";
import { socketService } from "../../../services/socket.service";

export default function ConsultationsPage() {
  const { user } = useAuthStore();
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [detail, setDetail] = useState<any | null>(null);

  const { data: consultationsData, isLoading, error, refetch } = useConsultations();
  const updateStatusMutation = useUpdateConsultationStatus();

  const consultations = useMemo(() => (consultationsData?.data || []).filter(Boolean), [consultationsData]);

  useEffect(() => {
    const onNew = () => {
      refetch();
    };
    socketService.onNewConsultation(onNew as any);
    return () => {
      socketService.offNewConsultation(onNew as any);
    };
  }, [refetch]);

  const filteredConsultations = useMemo(() => {
    const byTab = consultations.filter((c) => {
      if (tabValue === 0) return true;
      if (tabValue === 1) return c.status === "pending";
      if (tabValue === 2) return c.status === "contacted";
      if (tabValue === 3) return c.status === "completed";
      if (tabValue === 4) return c.status === "cancelled";
      return true;
    });
    const term = searchTerm.trim().toLowerCase();
    if (!term) return byTab;
    return byTab.filter((c) =>
      (c.customerName || "").toLowerCase().includes(term) ||
      (c.phoneNumber || "").toLowerCase().includes(term)
    );
  }, [consultations, tabValue, searchTerm]);

  const getStatusColor = (
    status: string
  ): "default" | "warning" | "success" | "error" => {
    switch (status) {
      case "pending":
        return "warning";
      case "contacted":
        return "default";
      case "completed":
        return "success";
      case "cancelled":
        return "error";
      default:
        return "default";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "Chờ xử lý";
      case "contacted":
        return "Đang tư vấn";
      case "completed":
        return "Hoàn thành";
      case "cancelled":
        return "Đã hủy";
      default:
        return status;
    }
  };

  const handleStatusChange = (id: string, status: ConsultationStatus) => {
    updateStatusMutation.mutate({ id, status });
  };

  type ConsultationStatus = "pending" | "contacted" | "completed" | "cancelled";

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">Có lỗi xảy ra khi tải dữ liệu</Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold" color="#731618">
        Tư Vấn Khách Hàng
      </Typography>

      <Paper sx={{ mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 2,
            borderBottom: "1px solid #e0e0e0",
          }}
        >
          <Box>
            <Typography variant="h6">Danh sách yêu cầu tư vấn</Typography>
            <Typography variant="body2" color="text.secondary">
              Tổng số: {consultations.length}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              size="small"
              placeholder="Tìm kiếm theo tên hoặc số điện thoại"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Box>
        </Box>

        <Tabs
          value={tabValue}
          onChange={(_, newValue) => setTabValue(newValue)}
          sx={{ borderBottom: 1, borderColor: "divider", px: 2 }}
        >
          <Tab label={`Tất cả (${consultations.length})`} />
          <Tab label={`Chưa xử lý (${consultations.filter((c) => c.status === "pending").length})`} />
          <Tab
            label={`Đang tư vấn (${consultations.filter((c) => c.status === "contacted").length})`}
          />
          <Tab
            label={`Hoàn thành (${consultations.filter((c) => c.status === "completed").length})`}
          />
          <Tab
            label={`Đã hủy (${consultations.filter((c) => c.status === "cancelled").length})`}
          />
        </Tabs>
      </Paper>

      {filteredConsultations.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <PersonIcon sx={{ fontSize: 64, color: "#ccc", mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            Chưa có yêu cầu tư vấn phù hợp
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={1}>
            Kiểm tra bộ lọc hoặc thử từ khóa khác
          </Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                <TableCell>
                  <strong>Khách hàng</strong>
                </TableCell>
                <TableCell>
                  <strong>Số điện thoại</strong>
                </TableCell>
                <TableCell>
                  <strong>Trạng thái</strong>
                </TableCell>
                <TableCell>
                  <strong>Thời gian</strong>
                </TableCell>
                <TableCell>
                  <strong>Ghi chú</strong>
                </TableCell>
                <TableCell align="center">
                  <strong>Hành động</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredConsultations.map((consultation) => (
                <TableRow
                  key={consultation.id}
                  hover
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <PersonIcon sx={{ color: "#731618" }} />
                      <Typography fontWeight="medium">
                        {consultation.customerName}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <PhoneIcon sx={{ color: "#ff9800", fontSize: 18 }} />
                      <Typography fontFamily="monospace">
                        {consultation.phoneNumber}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Chip
                        label={getStatusLabel(consultation.status)}
                        color={getStatusColor(consultation.status)}
                        size="small"
                      />
                      <Select
                        size="small"
                        value={consultation.status}
                        onChange={(e) =>
                          handleStatusChange(
                            consultation.id,
                            e.target.value as ConsultationStatus
                          )
                        }
                        sx={{ ml: 1, minWidth: 140 }}
                      >
                        <MenuItem value="pending">Chưa xử lý</MenuItem>
                        <MenuItem value="contacted">Đang tư vấn</MenuItem>
                        <MenuItem value="completed">Hoàn thành</MenuItem>
                        <MenuItem value="cancelled">Đã hủy</MenuItem>
                      </Select>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <AccessTimeIcon sx={{ fontSize: 18, color: "#666" }} />
                      <Typography variant="body2" color="text.secondary">
                        {formatDistanceToNow(new Date(consultation.createdAt), {
                          addSuffix: true,
                          locale: vi,
                        })}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {consultation.notes || "-"}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      href={`tel:${consultation.phoneNumber}`}
                      sx={{
                        color: "#ff9800",
                        "&:hover": {
                          bgcolor: "rgba(255, 152, 0, 0.1)",
                        },
                      }}
                    >
                      <PhoneIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => setDetail(consultation)}
                      sx={{ ml: 1 }}
                    >
                      <InfoIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={!!detail} onClose={() => setDetail(null)} fullWidth maxWidth="sm">
        <DialogTitle>Chi tiết yêu cầu tư vấn</DialogTitle>
        <DialogContent dividers>
          {detail && (
            <Box display="grid" gridTemplateColumns={{ xs: "1fr", sm: "1fr 1fr" }} gap={2}>
              <Box>
                <Typography variant="body2" color="text.secondary">Khách hàng</Typography>
                <Typography fontWeight="medium">{detail.customerName}</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">Số điện thoại</Typography>
                <Typography fontFamily="monospace">{detail.phoneNumber}</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">Trạng thái</Typography>
                <Chip label={getStatusLabel(detail.status)} color={getStatusColor(detail.status)} size="small" />
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">Thời gian</Typography>
                <Typography variant="body2" color="text.secondary">
                  {formatDistanceToNow(new Date(detail.createdAt), { addSuffix: true, locale: vi })}
                </Typography>
              </Box>
              <Box gridColumn={{ xs: "1", sm: "1 / span 2" }}>
                <Typography variant="body2" color="text.secondary">Ghi chú</Typography>
                <Typography variant="body2" color="text.secondary">{detail.notes || "-"}</Typography>
              </Box>
              {detail.assignedTo && (
                <Box gridColumn={{ xs: "1", sm: "1 / span 2" }}>
                  <Typography variant="body2" color="text.secondary">Người phụ trách</Typography>
                  <Chip icon={<PersonIcon />} label={`${detail.assignedTo.userName}`} size="small" />
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetail(null)}>Đóng</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
