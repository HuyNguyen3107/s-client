import React from "react";
import {
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
  Box,
  Chip,
} from "@mui/material";
import { Dashboard, Collections, List, Analytics } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { CollectionList } from "../components/collection-list.component";
import { useCollectionList } from "../hooks/use-collection-list.hooks";
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
      id={`collection-tabpanel-${index}`}
      aria-labelledby={`collection-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `collection-tab-${index}`,
    "aria-controls": `collection-tabpanel-${index}`,
  };
}

// Collection Management Page - Single Responsibility Principle (SRP)
export default function CollectionManagementPage() {
  const [tabValue, setTabValue] = React.useState(0);

  const { collections, isLoading } = useCollectionList();

  // Calculate statistics from collections data
  const statistics = React.useMemo(() => {
    if (!collections) return null;

    return {
      totalCollections: collections.length,
      activeCollections: collections.filter((c) => c.isActive).length,
      hotCollections: collections.filter((c) => c.isHot).length,
      totalProducts: collections.reduce(
        (sum, c) => sum + (c.productCount || 0),
        0
      ),
    };
  }, [collections]);

  const statsLoading = isLoading;

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
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
            <Collections fontSize="small" sx={{ mr: 0.5 }} />
            Quản lý Bộ Sưu Tập
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
            Quản lý Bộ Sưu Tập
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
          >
            Tạo và quản lý các bộ sưu tập sản phẩm
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
                      Tổng bộ sưu tập
                    </Typography>
                    <Typography variant="h4" component="div">
                      {statsLoading ? "-" : statistics?.totalCollections || 0}
                    </Typography>
                  </Box>
                  <Collections color="primary" sx={{ fontSize: 40 }} />
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
                      {statsLoading ? "-" : statistics?.activeCollections || 0}
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
                      Hot Collections
                    </Typography>
                    <Typography variant="h4" component="div">
                      {statsLoading ? "-" : statistics?.hotCollections || 0}
                    </Typography>
                    <Chip
                      label="Hot"
                      color="warning"
                      size="small"
                      sx={{ mt: 1 }}
                    />
                  </Box>
                  <Analytics color="warning" sx={{ fontSize: 40 }} />
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
                      Tổng sản phẩm
                    </Typography>
                    <Typography variant="h4" component="div">
                      {statsLoading ? "-" : statistics?.totalProducts || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Trong các bộ sưu tập
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
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="collection management tabs"
            >
              <Tab
                label="Danh sách Bộ Sưu Tập"
                icon={<List />}
                iconPosition="start"
                {...a11yProps(0)}
              />
              <Tab
                label="Thống kê"
                icon={<Analytics />}
                iconPosition="start"
                {...a11yProps(1)}
              />
            </Tabs>
          </Box>

          {/* Tab Panels */}
          <TabPanel value={tabValue} index={0}>
            <CollectionList />
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Thống kê chi tiết
              </Typography>

              {/* Statistics Overview */}
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Tổng quan Bộ Sưu Tập
                      </Typography>
                      <Box sx={{ mt: 2 }}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            mb: 1,
                          }}
                        >
                          <Typography>Tổng số bộ sưu tập:</Typography>
                          <Typography fontWeight="bold">
                            {statsLoading
                              ? "-"
                              : statistics?.totalCollections || 0}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            mb: 1,
                          }}
                        >
                          <Typography>Đang hoạt động:</Typography>
                          <Typography fontWeight="bold" color="success.main">
                            {statsLoading
                              ? "-"
                              : statistics?.activeCollections || 0}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            mb: 1,
                          }}
                        >
                          <Typography>Không hoạt động:</Typography>
                          <Typography fontWeight="bold" color="error.main">
                            {statsLoading
                              ? "-"
                              : (statistics?.totalCollections || 0) -
                                (statistics?.activeCollections || 0)}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            mb: 1,
                          }}
                        >
                          <Typography>Hot Collections:</Typography>
                          <Typography fontWeight="bold" color="warning.main">
                            {statsLoading
                              ? "-"
                              : statistics?.hotCollections || 0}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Thống kê Sản Phẩm
                      </Typography>
                      <Box sx={{ mt: 2 }}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            mb: 1,
                          }}
                        >
                          <Typography>
                            Tổng sản phẩm trong bộ sưu tập:
                          </Typography>
                          <Typography fontWeight="bold">
                            {statsLoading
                              ? "-"
                              : statistics?.totalProducts || 0}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            mb: 1,
                          }}
                        >
                          <Typography>
                            Trung bình sản phẩm/bộ sưu tập:
                          </Typography>
                          <Typography fontWeight="bold">
                            {statsLoading || !statistics?.totalCollections
                              ? "-"
                              : Math.round(
                                  (statistics.totalProducts || 0) /
                                    statistics.totalCollections
                                )}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              {/* Collection Details Table */}
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Chi tiết từng Bộ Sưu Tập
                  </Typography>

                  {statsLoading ? (
                    <Typography color="text.secondary">
                      Đang tải dữ liệu...
                    </Typography>
                  ) : collections && collections.length > 0 ? (
                    <Box sx={{ mt: 2 }}>
                      {collections.map((collection, index) => (
                        <Box
                          key={collection.id}
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            py: 2,
                            borderBottom:
                              index < collections.length - 1 ? 1 : 0,
                            borderColor: "divider",
                          }}
                        >
                          <Box sx={{ flex: 1 }}>
                            <Typography fontWeight="bold">
                              {collection.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {collection.description || "Không có mô tả"}
                            </Typography>
                          </Box>

                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
                            }}
                          >
                            <Chip
                              label={
                                collection.isActive ? "Hoạt động" : "Tạm dừng"
                              }
                              color={collection.isActive ? "success" : "error"}
                              size="small"
                            />

                            {collection.isHot && (
                              <Chip label="Hot" color="warning" size="small" />
                            )}

                            <Typography
                              variant="body2"
                              sx={{ minWidth: 80, textAlign: "right" }}
                            >
                              {collection.productCount || 0} sản phẩm
                            </Typography>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  ) : (
                    <Typography color="text.secondary">
                      Chưa có bộ sưu tập nào
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Box>
          </TabPanel>
        </Paper>
      </Container>
    </div>
  );
}

export { CollectionManagementPage };
