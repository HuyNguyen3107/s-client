import { useSafeDashboardStatistics } from "../hooks/use-safe-dashboard-statistics.hooks";

// Test component để verify dashboard data
export const DashboardDataTest = () => {
  const { data, isLoading, isError, isAuthenticated } =
    useSafeDashboardStatistics();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading data</div>;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        right: 0,
        background: "rgba(0,0,0,0.9)",
        color: "white",
        padding: "10px",
        fontSize: "12px",
        maxWidth: "300px",
        zIndex: 9999,
      }}
    >
      <h4>Dashboard Data Test</h4>
      <div>
        <strong>Authenticated:</strong> {isAuthenticated ? "Yes" : "No"}
      </div>
      <div>
        <strong>Users:</strong> {data?.users?.pagination?.totalItems || "N/A"}
      </div>
      <div>
        <strong>Products:</strong> {data?.products?.totalProducts || 0}
      </div>
      <div>
        <strong>Promotions:</strong>
        {isAuthenticated
          ? ` Active: ${data?.promotions?.activePromotions || 0}`
          : ` Total: ${data?.promotions?.totalPromotions || 0}`}
      </div>
      <div>
        <strong>Feedbacks:</strong> {data?.feedbacks?.totalFeedbacks || 0}
      </div>
      <div>
        <strong>Avg Rating:</strong>{" "}
        {data?.feedbacks?.averageRating?.toFixed(1) || "N/A"}
      </div>
    </div>
  );
};

export default DashboardDataTest;
