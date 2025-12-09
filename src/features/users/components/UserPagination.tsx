import React from "react";
import {
  Box,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from "@mui/material";

interface UserPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

/**
 * User Pagination Component - Following Single Responsibility Principle
 * Handles pagination controls for user list
 */
export const UserPagination: React.FC<UserPaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onPageSizeChange,
}) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    onPageChange(value);
  };

  const handlePageSizeChange = (event: any) => {
    onPageSizeChange(Number(event.target.value));
  };

  if (totalItems === 0) {
    return null;
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        py: 2,
        flexWrap: "wrap",
        gap: 2,
      }}
    >
      {/* Items info */}
      <Typography variant="body2" color="text.secondary">
        Hiển thị {startItem}-{endItem} trong tổng số {totalItems} người dùng
      </Typography>

      {/* Pagination controls */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        {/* Page size selector */}
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Số dòng</InputLabel>
          <Select
            value={itemsPerPage}
            label="Số dòng"
            onChange={handlePageSizeChange}
          >
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={25}>25</MenuItem>
            <MenuItem value={50}>50</MenuItem>
            <MenuItem value={100}>100</MenuItem>
          </Select>
        </FormControl>

        {/* Pagination */}
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
          shape="rounded"
          showFirstButton
          showLastButton
        />
      </Box>
    </Box>
  );
};

export default UserPagination;
