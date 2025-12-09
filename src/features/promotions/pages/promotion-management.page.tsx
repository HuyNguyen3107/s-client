import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Paper,
  Breadcrumbs,
  Link,
  Grid,
  Card,
  CardContent,
  Chip,
  IconButton,
} from "@mui/material";
import {
  Dashboard,
  LocalOffer,
  List,
  Analytics,
  ViewModule,
  ViewList,
} from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { PromotionList } from "../components/promotion-list.component";
import { PromotionValidatorComponent } from "../components/promotion-validator.component";
import { usePromotionStats } from "../hooks/use-promotion-stats.hooks";
import { ROUTE_PATH } from "../../../constants/route-path.constants";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`promotion-tabpanel-${index}`}
      aria-labelledby={`promotion-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `promotion-tab-${index}`,
    "aria-controls": `promotion-tabpanel-${index}`,
  };
}

export default function PromotionManagementPage() {
  const [tabValue, setTabValue] = useState(0);
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  const { statistics, isLoading: statsLoading } = usePromotionStats();

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleViewModeChange = () => {
    setViewMode(viewMode === "grid" ? "table" : "grid");
  };

  return (
    <div className="site-inner">
      <Container maxWidth="xl" sx={{ py: 3 }}>
        {/* Breadcrumbs */}
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
          <Link
            component={RouterLink}
            underline="hover"
            color="inherit"
            to={ROUTE_PATH.DASHBOARD}
            sx={{ display: "flex", alignItems: "center" }}
          >
            <Dashboard fontSize="small" sx={{ mr: 0.5 }} />
            Dashboard
          </Link>
          <Typography
            color="text.primary"
            sx={{ display: "flex", alignItems: "center" }}
          >
            <LocalOffer fontSize="small" sx={{ mr: 0.5 }} />
            Quản lý Mã Giảm Giá
          </Typography>
        </Breadcrumbs>

        {/* Page Header */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{ fontSize: { xs: "24px", sm: "32px", md: "2.125rem" } }}
          >
            Quản lý Mã Giảm Giá
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
          >
            Tạo và quản lý các mã giảm giá cho khách hàng
          </Typography>
        </Box>

        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Box>
                    <Typography color="text.secondary" gutterBottom>
                      Tổng mã giảm giá
                    </Typography>
                    <Typography variant="h4" component="div">
                      {statsLoading ? "-" : statistics?.totalPromotions || 0}
                    </Typography>
                  </Box>
                  <LocalOffer color="primary" sx={{ fontSize: 40 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Box>
                    <Typography color="text.secondary" gutterBottom>
                      Đang hoạt động
                    </Typography>
                    <Typography variant="h4" component="div">
                      {statsLoading ? "-" : statistics?.activePromotions || 0}
                    </Typography>
                    <Chip
                      label="Hoạt động"
                      color="success"
                      size="small"
                      sx={{ mt: 1 }}
                    />
                  </Box>
                  <Analytics color="success" sx={{ fontSize: 40 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Box>
                    <Typography color="text.secondary" gutterBottom>
                      Đã hết hạn
                    </Typography>
                    <Typography variant="h4" component="div">
                      {statsLoading ? "-" : statistics?.expiredPromotions || 0}
                    </Typography>
                    <Chip
                      label="Hết hạn"
                      color="error"
                      size="small"
                      sx={{ mt: 1 }}
                    />
                  </Box>
                  <Analytics color="error" sx={{ fontSize: 40 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Box>
                    <Typography color="text.secondary" gutterBottom>
                      Lượt sử dụng
                    </Typography>
                    <Typography variant="h4" component="div">
                      {statsLoading ? "-" : statistics?.totalUsage || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Tổng cộng
                    </Typography>
                  </Box>
                  <Analytics color="info" sx={{ fontSize: 40 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Tabs */}
        <Paper sx={{ mb: 3 }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider", px: 3, pt: 3 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                aria-label="promotion management tabs"
              >
                <Tab
                  label="Danh sách Mã Giảm Giá"
                  icon={<List />}
                  iconPosition="start"
                  {...a11yProps(0)}
                />
                <Tab
                  label="Kiểm tra Mã Giảm Giá"
                  icon={<Analytics />}
                  iconPosition="start"
                  {...a11yProps(1)}
                />
              </Tabs>

              {/* View Mode Toggle - only show on list tab */}
              {tabValue === 0 && (
                <IconButton
                  onClick={handleViewModeChange}
                  title={`Chuyển sang ${
                    viewMode === "grid" ? "dạng bảng" : "dạng lưới"
                  }`}
                >
                  {viewMode === "grid" ? <ViewList /> : <ViewModule />}
                </IconButton>
              )}
            </Box>
          </Box>

          {/* Tab Panels */}
          <TabPanel value={tabValue} index={0}>
            <PromotionList viewMode={viewMode} />
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <Box sx={{ p: 3 }}>
              <PromotionValidatorComponent />
            </Box>
          </TabPanel>
        </Paper>
      </Container>
    </div>
  );
}

export { PromotionManagementPage };
