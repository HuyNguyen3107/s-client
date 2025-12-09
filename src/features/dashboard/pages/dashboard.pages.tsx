import {
  FaUsers,
  FaBox,
  FaSpinner,
  FaExclamationTriangle,
  FaStar,
  FaChartLine,
  FaPercentage,
  FaClipboardList,
  FaTags,
  FaArrowUp,
  FaCheckCircle,
  FaTimesCircle,
  FaComment,
} from "react-icons/fa";
import styles from "./dashboard.pages.module.scss";
import { useSafeDashboardStatistics } from "../../../hooks/use-safe-dashboard-statistics.hooks";
import { useRecentActivities } from "../../../hooks/use-recent-activities.hooks";
import usePageMetadata from "../../../hooks/use-page-metadata.hooks";

type Props = {};

function DashboardPage({}: Props) {
  const { data, isLoading, isError, isAuthenticated } =
    useSafeDashboardStatistics();
  const { data: activities, isLoading: activitiesLoading } =
    useRecentActivities();

  // Set page metadata automatically based on route
  usePageMetadata();

  if (isLoading) {
    return (
      <div className={styles.dashboardContainer}>
        <div className={styles.dashboardHeader}>
          <div className={styles.headerContent}>
            <div>
              <h1 className={styles.pageTitle}>
                <FaChartLine className={styles.titleIcon} />
                Tổng quan Dashboard
              </h1>
              <p className={styles.pageSubtitle}>Đang tải dữ liệu...</p>
            </div>
          </div>
        </div>
        <div className={styles.loadingState}>
          <FaSpinner className={styles.spinner} />
          <p>Đang tải dữ liệu dashboard...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={styles.dashboardContainer}>
        <div className={styles.dashboardHeader}>
          <div className={styles.headerContent}>
            <div>
              <h1 className={styles.pageTitle}>
                <FaChartLine className={styles.titleIcon} />
                Tổng quan Dashboard
              </h1>
              <p className={styles.pageSubtitle}>
                {isAuthenticated
                  ? "Có lỗi khi tải dữ liệu chi tiết"
                  : "Hiển thị dữ liệu cơ bản"}
              </p>
            </div>
          </div>
        </div>

        {/* Fallback stats even when error */}
        <div className={styles.statsGrid}>
          <div className={`${styles.statCard} ${styles.usersCard}`}>
            <div className={styles.statIcon}>
              <FaUsers />
            </div>
            <div className={styles.statContent}>
              <p className={styles.statLabel}>Người dùng</p>
              <h3 className={styles.statNumber}>--</h3>
              <div className={styles.statTrend}>
                <span className={styles.trendBadge}>N/A</span>
              </div>
            </div>
          </div>
          <div className={`${styles.statCard} ${styles.productsCard}`}>
            <div className={styles.statIcon}>
              <FaBox />
            </div>
            <div className={styles.statContent}>
              <p className={styles.statLabel}>Sản phẩm</p>
              <h3 className={styles.statNumber}>--</h3>
              <div className={styles.statTrend}>
                <span className={styles.trendBadge}>N/A</span>
              </div>
            </div>
          </div>
          <div className={`${styles.statCard} ${styles.promotionsCard}`}>
            <div className={styles.statIcon}>
              <FaTags />
            </div>
            <div className={styles.statContent}>
              <p className={styles.statLabel}>Khuyến mãi</p>
              <h3 className={styles.statNumber}>--</h3>
              <div className={styles.statTrend}>
                <span className={styles.trendBadge}>N/A</span>
              </div>
            </div>
          </div>
          <div className={`${styles.statCard} ${styles.feedbacksCard}`}>
            <div className={styles.statIcon}>
              <FaStar />
            </div>
            <div className={styles.statContent}>
              <p className={styles.statLabel}>Đánh giá</p>
              <h3 className={styles.statNumber}>--</h3>
              <div className={styles.statTrend}>
                <span className={styles.trendBadge}>N/A</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.contentGrid}>
          <div className={styles.chartSection}>
            <h2 className={styles.sectionTitle}>
              <FaExclamationTriangle /> Thông báo
            </h2>
            <div className={styles.errorState}>
              <FaExclamationTriangle className={styles.errorIcon} />
              <p>
                {isAuthenticated
                  ? "Có lỗi xảy ra khi tải dữ liệu chi tiết. Vui lòng thử lại sau hoặc liên hệ quản trị viên."
                  : "Dữ liệu cơ bản tạm thời không khả dụng. Dashboard vẫn hoạt động bình thường."}
              </p>
            </div>
          </div>

          <div className={styles.recentActivity}>
            <h2 className={styles.sectionTitle}>
              <FaClipboardList /> Hoạt động gần đây
            </h2>
            <div className={styles.activityList}>
              <div className={styles.activityItem}>
                <div className={styles.activityIcon}>
                  <FaExclamationTriangle />
                </div>
                <div className={styles.activityContent}>
                  <p className={styles.activityText}>
                    Không thể tải hoạt động gần đây
                  </p>
                  <span className={styles.activityTime}>
                    Vui lòng thử lại sau
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Calculate trends and additional stats
  const totalProducts = data?.products?.totalProducts || 0;
  const totalVariants = data?.products?.totalProductVariants || 0;
  const activePromotions = data?.promotions?.activePromotions || 0;
  const totalPromotions = data?.promotions?.totalPromotions || 0;
  const averageRating = data?.feedbacks?.averageRating || 0;
  const totalFeedbacks = data?.feedbacks?.totalFeedbacks || 0;
  const totalUsers = data?.users?.pagination?.totalItems || 0;

  // Calculate active products percentage
  const activeProducts =
    data?.products?.productsByStatus?.find((s: any) => s.status === "active")
      ?.count || 0;
  const activeProductsPercentage =
    totalProducts > 0 ? ((activeProducts / totalProducts) * 100).toFixed(0) : 0;

  // Calculate promotion activity
  const promotionActivityPercentage =
    totalPromotions > 0
      ? ((activePromotions / totalPromotions) * 100).toFixed(0)
      : 0;

  return (
    <div className={styles.dashboardContainer}>
      {/* Header Section */}
      <div className={styles.dashboardHeader}>
        <div className={styles.headerContent}>
          <div>
            <h1 className={styles.pageTitle}>
              <FaChartLine className={styles.titleIcon} />
              Tổng quan Dashboard
            </h1>
            <p className={styles.pageSubtitle}>
              {isAuthenticated
                ? "Chào mừng bạn đến với hệ thống quản lý Soligant"
                : "Thống kê cơ bản - Đăng nhập để xem chi tiết"}
            </p>
          </div>
          {isAuthenticated && (
            <div className={styles.headerStats}>
              <div className={styles.miniStat}>
                <FaCheckCircle className={styles.miniStatIcon} />
                <span>Hệ thống hoạt động</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className={styles.statsGrid}>
        <div className={`${styles.statCard} ${styles.usersCard}`}>
          <div className={styles.statIcon}>
            <FaUsers />
          </div>
          <div className={styles.statContent}>
            <p className={styles.statLabel}>Người dùng</p>
            <h3 className={styles.statNumber}>
              {isAuthenticated ? totalUsers : "--"}
            </h3>
            <div className={styles.statTrend}>
              {isAuthenticated ? (
                <span className={`${styles.trendBadge} ${styles.positive}`}>
                  <FaArrowUp /> Tổng số
                </span>
              ) : (
                <span className={styles.trendBadge}>Cần đăng nhập</span>
              )}
            </div>
          </div>
          <div className={styles.statProgress}>
            <div
              className={styles.progressBar}
              style={{ width: isAuthenticated ? "75%" : "0%" }}
            ></div>
          </div>
        </div>

        <div className={`${styles.statCard} ${styles.productsCard}`}>
          <div className={styles.statIcon}>
            <FaBox />
          </div>
          <div className={styles.statContent}>
            <p className={styles.statLabel}>Sản phẩm</p>
            <h3 className={styles.statNumber}>{totalProducts}</h3>
            <div className={styles.statTrend}>
              <span className={`${styles.trendBadge} ${styles.info}`}>
                <FaCheckCircle /> {activeProductsPercentage}% hoạt động
              </span>
            </div>
          </div>
          <div className={styles.statProgress}>
            <div
              className={styles.progressBar}
              style={{ width: `${activeProductsPercentage}%` }}
            ></div>
          </div>
        </div>

        <div className={`${styles.statCard} ${styles.promotionsCard}`}>
          <div className={styles.statIcon}>
            <FaTags />
          </div>
          <div className={styles.statContent}>
            <p className={styles.statLabel}>Khuyến mãi</p>
            <h3 className={styles.statNumber}>
              {isAuthenticated ? activePromotions : totalPromotions}
            </h3>
            <div className={styles.statTrend}>
              {isAuthenticated ? (
                <span className={`${styles.trendBadge} ${styles.positive}`}>
                  <FaPercentage /> {promotionActivityPercentage}% đang chạy
                </span>
              ) : (
                <span className={styles.trendBadge}>Tổng số</span>
              )}
            </div>
          </div>
          <div className={styles.statProgress}>
            <div
              className={styles.progressBar}
              style={{
                width: isAuthenticated
                  ? `${promotionActivityPercentage}%`
                  : "50%",
              }}
            ></div>
          </div>
        </div>

        <div className={`${styles.statCard} ${styles.feedbacksCard}`}>
          <div className={styles.statIcon}>
            <FaStar />
          </div>
          <div className={styles.statContent}>
            <p className={styles.statLabel}>Đánh giá</p>
            <h3 className={styles.statNumber}>{totalFeedbacks}</h3>
            <div className={styles.statTrend}>
              <span className={`${styles.trendBadge} ${styles.warning}`}>
                <FaStar /> {averageRating.toFixed(1)}/5.0 sao
              </span>
            </div>
          </div>
          <div className={styles.statProgress}>
            <div
              className={styles.progressBar}
              style={{ width: `${(averageRating / 5) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className={styles.contentGrid}>
        {/* Statistics Section */}
        <div className={styles.chartSection}>
          <h2 className={styles.sectionTitle}>
            <FaChartLine /> Thống kê chi tiết
          </h2>

          {/* Quick Stats */}
          <div className={styles.quickStats}>
            <div className={styles.quickStatItem}>
              <div className={styles.quickStatIcon}>
                <FaBox />
              </div>
              <div className={styles.quickStatContent}>
                <span className={styles.quickStatLabel}>Tổng sản phẩm</span>
                <span className={styles.quickStatValue}>{totalProducts}</span>
              </div>
            </div>
            {isAuthenticated && (
              <>
                <div className={styles.quickStatItem}>
                  <div className={styles.quickStatIcon}>
                    <FaCheckCircle />
                  </div>
                  <div className={styles.quickStatContent}>
                    <span className={styles.quickStatLabel}>
                      Đang hoạt động
                    </span>
                    <span className={styles.quickStatValue}>
                      {activeProducts}
                    </span>
                  </div>
                </div>
                <div className={styles.quickStatItem}>
                  <div className={styles.quickStatIcon}>
                    <FaTimesCircle />
                  </div>
                  <div className={styles.quickStatContent}>
                    <span className={styles.quickStatLabel}>
                      Ngừng hoạt động
                    </span>
                    <span className={styles.quickStatValue}>
                      {totalProducts - activeProducts}
                    </span>
                  </div>
                </div>
                <div className={styles.quickStatItem}>
                  <div className={styles.quickStatIcon}>
                    <FaTags />
                  </div>
                  <div className={styles.quickStatContent}>
                    <span className={styles.quickStatLabel}>Biến thể</span>
                    <span className={styles.quickStatValue}>
                      {totalVariants}
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Detailed Statistics */}
          <div className={styles.statisticsGrid}>
            <div className={styles.statDetail}>
              <div className={styles.statDetailHeader}>
                <FaBox className={styles.statDetailIcon} />
                <h4>Sản phẩm</h4>
              </div>
              <div className={styles.statDetailContent}>
                <div className={styles.statDetailRow}>
                  <span>Tổng sản phẩm:</span>
                  <strong>{totalProducts}</strong>
                </div>
                {isAuthenticated && (
                  <>
                    <div className={styles.statDetailRow}>
                      <span>Biến thể:</span>
                      <strong>{totalVariants}</strong>
                    </div>
                    {data?.products?.productsByStatus?.map(
                      (status: { status: string; count: number }) => (
                        <div
                          key={status.status}
                          className={styles.statDetailRow}
                        >
                          <span>
                            {status.status === "active"
                              ? "Hoạt động"
                              : "Không hoạt động"}
                            :
                          </span>
                          <strong>{status.count}</strong>
                        </div>
                      )
                    )}
                  </>
                )}
              </div>
            </div>

            <div className={styles.statDetail}>
              <div className={styles.statDetailHeader}>
                <FaTags className={styles.statDetailIcon} />
                <h4>Khuyến mãi</h4>
              </div>
              <div className={styles.statDetailContent}>
                <div className={styles.statDetailRow}>
                  <span>Tổng số:</span>
                  <strong>{totalPromotions}</strong>
                </div>
                {isAuthenticated && (
                  <>
                    <div className={styles.statDetailRow}>
                      <span>Đang hoạt động:</span>
                      <strong>{activePromotions}</strong>
                    </div>
                    <div className={styles.statDetailRow}>
                      <span>Hết hạn:</span>
                      <strong>
                        {data?.promotions?.expiredPromotions || 0}
                      </strong>
                    </div>
                    <div className={styles.statDetailRow}>
                      <span>Giảm giá TB:</span>
                      <strong>
                        {data?.promotions?.averageDiscount?.toFixed(0) || 0}%
                      </strong>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className={styles.statDetail}>
              <div className={styles.statDetailHeader}>
                <FaStar className={styles.statDetailIcon} />
                <h4>Đánh giá</h4>
              </div>
              <div className={styles.statDetailContent}>
                <div className={styles.statDetailRow}>
                  <span>Tổng số:</span>
                  <strong>{totalFeedbacks}</strong>
                </div>
                <div className={styles.statDetailRow}>
                  <span>Đánh giá TB:</span>
                  <strong>{averageRating.toFixed(1)}/5</strong>
                </div>
                {isAuthenticated && (
                  <>
                    <div className={styles.ratingDistribution}>
                      {data?.feedbacks?.ratingDistribution
                        ?.sort((a: any, b: any) => b.rating - a.rating)
                        .map((rating: { rating: number; count: number }) => (
                          <div
                            key={rating.rating}
                            className={styles.ratingDistributionRow}
                          >
                            <span className={styles.ratingStars}>
                              {rating.rating} <FaStar />
                            </span>
                            <div className={styles.ratingBar}>
                              <div
                                className={styles.ratingBarFill}
                                style={{
                                  width: `${
                                    totalFeedbacks > 0
                                      ? (rating.count / totalFeedbacks) * 100
                                      : 0
                                  }%`,
                                }}
                              ></div>
                            </div>
                            <span className={styles.ratingCount}>
                              {rating.count}
                            </span>
                          </div>
                        ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className={styles.recentActivity}>
          <h2 className={styles.sectionTitle}>
            <FaClipboardList /> Hoạt động gần đây
          </h2>
          <div className={styles.activityList}>
            {activitiesLoading ? (
              <div className={styles.activityItem}>
                <div className={styles.activityIcon}>
                  <FaSpinner className={styles.spinner} />
                </div>
                <div className={styles.activityContent}>
                  <p className={styles.activityText}>Đang tải hoạt động...</p>
                </div>
              </div>
            ) : activities && activities.length > 0 ? (
              activities.map((activity) => (
                <div key={activity.id} className={styles.activityItem}>
                  <div className={styles.activityIcon}>
                    <FaComment />
                  </div>
                  <div className={styles.activityContent}>
                    <p className={styles.activityText}>{activity.title}</p>
                    <p className={styles.activityDescription}>
                      {activity.description}
                    </p>
                    <span className={styles.activityTime}>
                      {activity.timestamp}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className={styles.activityItem}>
                <div className={styles.activityIcon}>
                  <FaCheckCircle />
                </div>
                <div className={styles.activityContent}>
                  <p className={styles.activityText}>
                    Chưa có hoạt động gần đây
                  </p>
                  <span className={styles.activityTime}>
                    Hệ thống đang chờ dữ liệu
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Activity Summary */}
          {isAuthenticated && activities && activities.length > 0 && (
            <div className={styles.activitySummary}>
              <div className={styles.activitySummaryItem}>
                <FaComment />
                <span>{activities.length} hoạt động mới</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
