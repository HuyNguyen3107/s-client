import React, { useMemo } from "react";
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
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  Dashboard,
  Image as ImageIcon,
  List,
  Analytics,
  Collections,
} from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { BackgroundList } from "../components/background-list.component";
import { useBackgrounds } from "../queries/background.queries";
import { useProducts } from "../../products/queries/product.queries";
import { ROUTE_PATH } from "../../../constants/route-path.constants";

/**
 * Background Management Page - Single Responsibility Principle (SRP)
 * Responsible for the main background management interface
 */

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
      id={`background-tabpanel-${index}`}
      aria-labelledby={`background-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `background-tab-${index}`,
    "aria-controls": `background-tabpanel-${index}`,
  };
}

export default function BackgroundManagementPage() {
  const [tabValue, setTabValue] = React.useState(0);

  // Fetch backgrounds for statistics
  const {
    data: backgroundsData,
    isLoading: backgroundsLoading,
    error,
  } = useBackgrounds({
    page: 1,
    limit: 100, // Get backgrounds for statistics (max allowed)
  });

  // Fetch products for form
  const { data: productsData, isLoading: productsLoading } = useProducts({
    page: 1,
    limit: 100, // Get products (max allowed)
  });

  const backgrounds = backgroundsData?.data || [];
  const products = productsData?.data || [];

  // Calculate statistics from backgrounds data
  const statistics = useMemo(() => {
    if (!backgrounds.length) return null;

    // Group backgrounds by product
    const backgroundsByProduct = backgrounds.reduce((acc, background) => {
      const productId = background.productId;
      const productName = background.product?.name || `Product ${productId}`;

      if (!acc[productName]) {
        acc[productName] = 0;
      }
      acc[productName]++;
      return acc;
    }, {} as Record<string, number>);

    // Convert to array and sort by count
    const backgroundsByProductArray = Object.entries(backgroundsByProduct)
      .map(([productName, count]) => ({ productName, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5); // Top 5

    // Get recent backgrounds (last 10)
    const recentBackgrounds = [...backgrounds]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 10);

    return {
      totalBackgrounds: backgrounds.length,
      backgroundsByProduct: backgroundsByProductArray,
      recentBackgrounds,
    };
  }, [backgrounds]);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            py: 8,
            textAlign: "center",
          }}
        >
          <Alert
            severity="error"
            sx={{
              maxWidth: 600,
              borderRadius: 3,
              "& .MuiAlert-message": {
                fontSize: "1.1rem",
              },
            }}
          >
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
              Không thể tải dữ liệu
            </Typography>
            <Typography variant="body1">
              Có lỗi xảy ra: {error.message}
            </Typography>
          </Alert>
        </Box>
      </Container>
    );
  }

  return (
    <div className="site-inner">
      <Container maxWidth="xl" sx={{ py: 4, px: 3 }}>
        {/* Page Header */}
        <Box sx={{ mb: 4 }}>
          <Breadcrumbs
            aria-label="breadcrumb"
            sx={{
              mb: 2,
              "& .MuiBreadcrumbs-separator": {
                mx: 1,
              },
            }}
          >
            <Link
              component={RouterLink}
              underline="hover"
              color="text.secondary"
              to={ROUTE_PATH.DASHBOARD}
              sx={{
                display: "flex",
                alignItems: "center",
                fontWeight: 500,
                "&:hover": {
                  color: "primary.main",
                },
              }}
            >
              <Dashboard fontSize="small" sx={{ mr: 0.5 }} />
              Dashboard
            </Link>
            <Typography
              color="text.primary"
              sx={{ display: "flex", alignItems: "center" }}
            >
              <ImageIcon fontSize="small" sx={{ mr: 0.5 }} />
              Quản lý Hình nền
            </Typography>
          </Breadcrumbs>

          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 700,
              color: "#731618",
              mb: 2,
              fontSize: { xs: "24px", sm: "32px", md: "2.125rem" },
            }}
          >
            Quản lý Hình nền
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              mb: 4,
              fontWeight: 500,
              fontSize: { xs: "0.875rem", sm: "1rem" },
            }}
          >
            Quản lý hình nền cho sản phẩm
          </Typography>
        </Box>

        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Card
              sx={{
                borderRadius: 2,
                boxShadow: "0 2px 8px rgba(115,22,24,0.1)",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 4px 16px rgba(115,22,24,0.15)",
                },
                border: "1px solid #f0f0f0",
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Box>
                    <Typography
                      color="text.secondary"
                      gutterBottom
                      sx={{ fontWeight: 600, fontSize: "0.875rem" }}
                    >
                      Tổng Hình nền
                    </Typography>
                    <Typography
                      variant="h4"
                      component="div"
                      sx={{
                        fontWeight: 700,
                        color: "#731618",
                        mb: 1,
                      }}
                    >
                      {backgroundsLoading ? (
                        <CircularProgress size={24} sx={{ color: "#731618" }} />
                      ) : (
                        statistics?.totalBackgrounds || 0
                      )}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontWeight: 500 }}
                    >
                      Hình nền đã tạo
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: "50%",
                      backgroundColor: "#731618",
                      color: "white",
                    }}
                  >
                    <ImageIcon sx={{ fontSize: 32 }} />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Card
              sx={{
                borderRadius: 2,
                boxShadow: "0 2px 8px rgba(115,22,24,0.1)",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 4px 16px rgba(115,22,24,0.15)",
                },
                border: "1px solid #f0f0f0",
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Box>
                    <Typography
                      color="text.secondary"
                      gutterBottom
                      sx={{ fontWeight: 600, fontSize: "0.875rem" }}
                    >
                      Sản phẩm có Hình nền
                    </Typography>
                    <Typography
                      variant="h4"
                      component="div"
                      sx={{
                        fontWeight: 700,
                        color: "#731618",
                        mb: 1,
                      }}
                    >
                      {backgroundsLoading ? (
                        <CircularProgress size={24} sx={{ color: "#731618" }} />
                      ) : (
                        statistics?.backgroundsByProduct.length || 0
                      )}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontWeight: 500 }}
                    >
                      Sản phẩm đã có hình nền
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: "50%",
                      backgroundColor: "#5f0d10",
                      color: "white",
                    }}
                  >
                    <Collections sx={{ fontSize: 32 }} />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Card
              sx={{
                borderRadius: 2,
                boxShadow: "0 2px 8px rgba(115,22,24,0.1)",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 4px 16px rgba(115,22,24,0.15)",
                },
                border: "1px solid #f0f0f0",
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Box>
                    <Typography
                      color="text.secondary"
                      gutterBottom
                      sx={{ fontWeight: 600, fontSize: "0.875rem" }}
                    >
                      Hình nền gần đây
                    </Typography>
                    <Typography
                      variant="h4"
                      component="div"
                      sx={{
                        fontWeight: 700,
                        color: "#731618",
                        mb: 1,
                      }}
                    >
                      {backgroundsLoading ? (
                        <CircularProgress size={24} sx={{ color: "#731618" }} />
                      ) : (
                        Math.min(statistics?.recentBackgrounds.length || 0, 10)
                      )}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontWeight: 500 }}
                    >
                      Trong 30 ngày qua
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: "50%",
                      backgroundColor: "#a24a4c",
                      color: "white",
                    }}
                  >
                    <Analytics sx={{ fontSize: 32 }} />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Top Products by Background Count */}
        {!backgroundsLoading &&
          statistics &&
          statistics.backgroundsByProduct.length > 0 && (
            <Card
              sx={{
                mb: 4,
                borderRadius: 2,
                boxShadow: "0 2px 8px rgba(115,22,24,0.1)",
                backgroundColor: "#731618",
                color: "white",
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{
                    fontWeight: 700,
                    mb: 2,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Collections sx={{ mr: 1 }} />
                  Sản phẩm có nhiều Hình nền nhất
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 2 }}>
                  {statistics.backgroundsByProduct.map(
                    ({ productName, count }) => (
                      <Chip
                        key={productName}
                        label={`${productName} (${count})`}
                        sx={{
                          backgroundColor: "rgba(255,255,255,0.15)",
                          color: "white",
                          fontWeight: 600,
                          border: "1px solid rgba(255,255,255,0.3)",
                          "&:hover": {
                            backgroundColor: "rgba(255,255,255,0.25)",
                          },
                        }}
                      />
                    )
                  )}
                </Box>
              </CardContent>
            </Card>
          )}

        {/* Tabs */}
        <Paper
          sx={{
            mb: 3,
            borderRadius: 3,
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              borderBottom: 1,
              borderColor: "divider",
              px: 4,
              pt: 3,
              backgroundColor: "#f8f8f8",
            }}
          >
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="background management tabs"
              sx={{
                "& .MuiTabs-indicator": {
                  height: 4,
                  borderRadius: "2px 2px 0 0",
                  backgroundColor: "#731618",
                },
                "& .MuiTab-root": {
                  fontWeight: 600,
                  textTransform: "none",
                  minHeight: 64,
                  "&.Mui-selected": {
                    color: "primary.main",
                    fontWeight: 700,
                  },
                },
              }}
            >
              <Tab
                label="Danh sách Hình nền"
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
            <Box sx={{ px: 3 }}>
              <BackgroundList products={products} />
            </Box>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Box sx={{ px: 3, py: 3 }}>
              <Typography variant="h6" gutterBottom>
                Thống kê chi tiết
              </Typography>

              {backgroundsLoading ? (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    py: 8,
                    backgroundColor: "#f8f8f8",
                    borderRadius: 2,
                    border: "1px solid #f0f0f0",
                  }}
                >
                  <CircularProgress
                    size={40}
                    sx={{
                      color: "#731618",
                      mb: 2,
                    }}
                  />
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ fontWeight: 500 }}
                  >
                    Đang tải dữ liệu thống kê...
                  </Typography>
                </Box>
              ) : statistics ? (
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Card>
                      <CardContent>
                        <Typography variant="subtitle1" gutterBottom>
                          Hình nền theo sản phẩm
                        </Typography>
                        {statistics.backgroundsByProduct.map(
                          ({ productName, count }) => (
                            <Box
                              key={productName}
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                py: 1,
                                borderBottom: "1px solid",
                                borderColor: "divider",
                              }}
                            >
                              <Typography variant="body2">
                                {productName}
                              </Typography>
                              <Chip
                                label={count}
                                size="small"
                                color="primary"
                                variant="outlined"
                              />
                            </Box>
                          )
                        )}
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <Card>
                      <CardContent>
                        <Typography variant="subtitle1" gutterBottom>
                          Hình nền gần đây
                        </Typography>
                        {statistics.recentBackgrounds
                          .slice(0, 5)
                          .map((background) => (
                            <Box
                              key={background.id}
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                py: 1,
                                borderBottom: "1px solid",
                                borderColor: "divider",
                              }}
                            >
                              <Box
                                component="img"
                                src={background.imageUrl}
                                alt={background.name || "Background"}
                                sx={{
                                  width: 40,
                                  height: 40,
                                  objectFit: "cover",
                                  borderRadius: 1,
                                  mr: 2,
                                }}
                              />
                              <Box sx={{ flexGrow: 1 }}>
                                <Typography variant="body2" fontWeight="medium">
                                  {background.name || "Untitled"}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  {new Date(
                                    background.createdAt
                                  ).toLocaleDateString("vi-VN")}
                                </Typography>
                              </Box>
                            </Box>
                          ))}
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    py: 8,
                    backgroundColor: "#f8f8f8",
                    borderRadius: 2,
                    textAlign: "center",
                    border: "1px solid #f0f0f0",
                  }}
                >
                  <Analytics
                    sx={{
                      fontSize: 64,
                      color: "#731618",
                      mb: 2,
                      opacity: 0.7,
                    }}
                  />
                  <Typography
                    variant="h6"
                    color="text.primary"
                    sx={{ fontWeight: 600, mb: 1 }}
                  >
                    Chưa có dữ liệu thống kê
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontWeight: 500 }}
                  >
                    Hãy tạo một số hình nền để xem thống kê
                  </Typography>
                </Box>
              )}
            </Box>
          </TabPanel>
        </Paper>
      </Container>
    </div>
  );
}

export { BackgroundManagementPage };
