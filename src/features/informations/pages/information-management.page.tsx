import { useMemo } from "react";
import {
  Container,
  Typography,
  Breadcrumbs,
  Link,
  Box,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Dashboard, Settings as SettingsIcon } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { InformationList } from "../components/information-list.component";
import { useInformations } from "../queries/information.queries";
import { ROUTE_PATH } from "../../../constants/route-path.constants";

export default function InformationManagementPage() {
  // Fetch informations for statistics
  const {
    data: informationsData,
    isLoading: informationsLoading,
    error,
  } = useInformations({
    page: 1,
    limit: 100,
  });

  const informations = informationsData?.data || [];

  // Calculate statistics
  const statistics = useMemo(() => {
    if (!informations.length) return null;

    // Get recent informations (last 10)
    const recentInformations = [...informations]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 10);

    return {
      totalInformations: informations.length,
      recentInformations,
    };
  }, [informations]);

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
              <SettingsIcon fontSize="small" sx={{ mr: 0.5 }} />
              Quản lý Thông tin
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
            Quản lý Thông tin
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
            Quản lý cấu hình thông tin hệ thống
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
                      Tổng Thông tin
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
                      {informationsLoading ? (
                        <CircularProgress size={24} sx={{ color: "#731618" }} />
                      ) : (
                        statistics?.totalInformations || 0
                      )}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontWeight: 500 }}
                    >
                      Cấu hình đã tạo
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
                    <SettingsIcon sx={{ fontSize: 32 }} />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Information List */}
        <Card
          sx={{
            borderRadius: 3,
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            overflow: "hidden",
          }}
        >
          <Box sx={{ p: 3 }}>
            <InformationList />
          </Box>
        </Card>
      </Container>
    </div>
  );
}

export { InformationManagementPage };
