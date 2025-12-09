import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  LinearProgress,
  Chip,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Star, TrendingUp, Reviews, StarRate } from "@mui/icons-material";
import { useFeedbackStats } from "../hooks/use-feedback-stats.hooks";

interface RatingDistributionItem {
  rating: number;
  count: number;
}

interface FeedbackStatisticsData {
  totalFeedbacks: number;
  averageRating: number;
  ratingDistribution: RatingDistributionItem[];
}

const FeedbackStats: React.FC = () => {
  const { statistics: stats, isLoading, error } = useFeedbackStats();

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        Có lỗi xảy ra khi tải thống kê: {error.message}
      </Alert>
    );
  }

  if (!stats) {
    return (
      <Alert severity="info" sx={{ m: 2 }}>
        Không có dữ liệu thống kê
      </Alert>
    );
  }

  // Type cast và validate dữ liệu - xử lý cả 2 format có thể có
  let statsData: FeedbackStatisticsData;

  // Kiểm tra xem ratingDistribution là array hay object
  if (Array.isArray((stats as any).ratingDistribution)) {
    // Format từ server (array)
    statsData = stats as unknown as FeedbackStatisticsData;
  } else {
    // Format cũ (object) - chuyển đổi sang array
    const oldStats = stats as any;
    const ratingDistributionArray: RatingDistributionItem[] = [];

    if (
      oldStats.ratingDistribution &&
      typeof oldStats.ratingDistribution === "object"
    ) {
      for (let i = 1; i <= 5; i++) {
        const value = oldStats.ratingDistribution[i];
        let count = 0;

        if (typeof value === "number") {
          count = value;
        } else if (
          typeof value === "object" &&
          value !== null &&
          "count" in value
        ) {
          count = value.count;
        }

        if (count > 0) {
          ratingDistributionArray.push({ rating: i, count });
        }
      }
    }

    statsData = {
      totalFeedbacks: oldStats.totalFeedbacks || 0,
      averageRating: oldStats.averageRating || 0,
      ratingDistribution: ratingDistributionArray,
    };
  }

  // Validate cấu trúc dữ liệu
  if (
    typeof statsData.totalFeedbacks !== "number" ||
    typeof statsData.averageRating !== "number" ||
    !Array.isArray(statsData.ratingDistribution)
  ) {
    console.error("Invalid stats data structure:", statsData);
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        Dữ liệu thống kê không hợp lệ. Vui lòng thử lại sau.
      </Alert>
    );
  }

  // Xử lý rating distribution - chuyển từ array sang object để dễ truy cập
  const distributionMap: { [key: number]: number } = {};

  // Khởi tạo tất cả rating từ 1-5 với giá trị 0
  for (let i = 1; i <= 5; i++) {
    distributionMap[i] = 0;
  }

  // Cập nhật với dữ liệu thực tế từ server
  statsData.ratingDistribution.forEach((item) => {
    if (item.rating >= 1 && item.rating <= 5) {
      distributionMap[item.rating] = item.count;
    }
  });

  // Tính toán các giá trị cần thiết
  const maxRatingCount = Math.max(...Object.values(distributionMap));
  const totalFromDistribution = Object.values(distributionMap).reduce(
    (sum, count) => sum + count,
    0
  );
  const actualTotal = Math.max(totalFromDistribution, statsData.totalFeedbacks);

  const getColorByRating = (rating: number) => {
    if (rating >= 4) return "success";
    if (rating >= 3) return "warning";
    return "error";
  };

  return (
    <Grid container spacing={3}>
      {/* Overview Cards */}
      <Grid size={12}>
        <Card>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  backgroundColor: "primary.light",
                  color: "primary.contrastText",
                }}
              >
                <Reviews />
              </Box>
              <Box>
                <Typography variant="h4" fontWeight="bold">
                  {statsData.totalFeedbacks}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Tổng feedbacks
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid size={12}>
        <Card>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  backgroundColor: "warning.light",
                  color: "warning.contrastText",
                }}
              >
                <StarRate />
              </Box>
              <Box>
                <Typography variant="h4" fontWeight="bold">
                  {statsData.averageRating.toFixed(1)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Đánh giá trung bình
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid size={12}>
        <Card>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  backgroundColor: "success.light",
                  color: "success.contrastText",
                }}
              >
                <TrendingUp />
              </Box>
              <Box>
                <Typography variant="h4" fontWeight="bold">
                  {Math.floor(statsData.totalFeedbacks * 0.1)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Feedbacks gần đây (ước tính)
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid size={12}>
        <Card>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  backgroundColor: "info.light",
                  color: "info.contrastText",
                }}
              >
                <Star />
              </Box>
              <Box>
                <Chip
                  label={`${statsData.averageRating.toFixed(1)}/5`}
                  color={getColorByRating(statsData.averageRating)}
                  variant="filled"
                />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 0.5 }}
                >
                  Chất lượng dịch vụ
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Rating Distribution */}
      <Grid size={12}>
        <Card>
          <CardContent>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="h6">Phân bố đánh giá</Typography>
              <Typography variant="body2" color="text.secondary">
                Tổng: {actualTotal} feedbacks
              </Typography>
            </Box>
            <Grid container spacing={2}>
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = distributionMap[rating] || 0;
                const percentage =
                  actualTotal > 0 ? (count / actualTotal) * 100 : 0;
                const barWidth =
                  maxRatingCount > 0 ? (count / maxRatingCount) * 100 : 0;

                return (
                  <Grid size={12} key={rating}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          minWidth: 60,
                        }}
                      >
                        <Typography variant="body2" sx={{ mr: 0.5 }}>
                          {rating}
                        </Typography>
                        <Star fontSize="small" color="warning" />
                      </Box>
                      <Box sx={{ flexGrow: 1 }}>
                        <LinearProgress
                          variant="determinate"
                          value={barWidth}
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: "grey.200",
                            "& .MuiLinearProgress-bar": {
                              borderRadius: 4,
                              backgroundColor:
                                rating >= 4
                                  ? "success.main"
                                  : rating >= 3
                                  ? "warning.main"
                                  : "error.main",
                            },
                          }}
                        />
                      </Box>
                      <Box sx={{ minWidth: 100, textAlign: "right" }}>
                        <Typography variant="body2" color="text.secondary">
                          {count} ({percentage.toFixed(1)}%)
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                );
              })}
            </Grid>

            {/* Validation summary */}
            {actualTotal > 0 && (
              <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: "divider" }}>
                <Typography variant="caption" color="text.secondary">
                  Tổng kiểm tra:{" "}
                  {Object.values(distributionMap).reduce(
                    (sum: number, count: number) => sum + count,
                    0
                  )}{" "}
                  feedbacks
                  {totalFromDistribution !== statsData.totalFeedbacks && (
                    <>
                      {" "}
                      (Khác với thống kê tổng quát: {statsData.totalFeedbacks})
                    </>
                  )}
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default FeedbackStats;
