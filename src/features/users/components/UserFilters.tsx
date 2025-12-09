import React from "react";
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Paper,
  Typography,
  InputAdornment,
} from "@mui/material";
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
} from "@mui/icons-material";
import type { UserFilters } from "../types";
import { useRoles } from "../../roles/queries";

interface UserFiltersProps {
  filters: UserFilters;
  onSearchChange: (search: string) => void;
  onStatusChange: (status: boolean | null) => void;
  onRoleChange: (roleId: string | null) => void;
  onClearFilters: () => void;
}

/**
 * User Filters Component - Following Single Responsibility Principle
 * Handles filtering and searching of users
 */
export const UserFiltersComponent: React.FC<UserFiltersProps> = ({
  filters,
  onSearchChange,
  onStatusChange,
  onRoleChange,
  onClearFilters,
}) => {
  const { data: rolesData } = useRoles();
  const roles = rolesData?.data || [];

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(event.target.value);
  };

  const handleStatusChange = (value: string) => {
    if (value === "all") {
      onStatusChange(null);
    } else {
      onStatusChange(value === "active");
    }
  };

  const handleRoleChange = (value: string) => {
    if (value === "all") {
      onRoleChange(null);
    } else {
      onRoleChange(value);
    }
  };

  const hasActiveFilters =
    filters.search || filters.isActive !== null || filters.roleId !== null;

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <FilterIcon sx={{ mr: 1, color: "text.secondary" }} />
        <Typography variant="h6" component="h2">
          Bộ lọc tìm kiếm
        </Typography>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "2fr 1fr 1fr auto",
          },
          gap: 2,
          alignItems: "end",
        }}
      >
        {/* Search Field */}
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Tìm kiếm theo tên, email, số điện thoại..."
          value={filters.search}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        {/* Status Filter */}
        <FormControl fullWidth>
          <InputLabel>Trạng thái</InputLabel>
          <Select
            value={
              filters.isActive === null
                ? "all"
                : filters.isActive
                ? "active"
                : "inactive"
            }
            label="Trạng thái"
            onChange={(e) => handleStatusChange(e.target.value)}
          >
            <MenuItem value="all">Tất cả</MenuItem>
            <MenuItem value="active">Hoạt động</MenuItem>
            <MenuItem value="inactive">Tạm khóa</MenuItem>
          </Select>
        </FormControl>

        {/* Role Filter */}
        <FormControl fullWidth>
          <InputLabel>Vai trò</InputLabel>
          <Select
            value={filters.roleId || "all"}
            label="Vai trò"
            onChange={(e) => handleRoleChange(e.target.value)}
          >
            <MenuItem value="all">Tất cả vai trò</MenuItem>
            {roles.map((role) => (
              <MenuItem key={role.id} value={role.id}>
                {role.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Clear Filters Button */}
        <Button
          variant="outlined"
          color="secondary"
          startIcon={<ClearIcon />}
          onClick={onClearFilters}
          disabled={!hasActiveFilters}
          sx={{ minWidth: 120 }}
        >
          Xóa bộ lọc
        </Button>
      </Box>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: "divider" }}>
          <Typography variant="body2" color="text.secondary">
            Đang lọc:{" "}
            {filters.search && (
              <Typography
                component="span"
                sx={{
                  backgroundColor: "primary.light",
                  color: "primary.contrastText",
                  px: 1,
                  py: 0.5,
                  borderRadius: 1,
                  mr: 1,
                  fontSize: "0.75rem",
                }}
              >
                "{filters.search}"
              </Typography>
            )}
            {filters.isActive !== null && (
              <Typography
                component="span"
                sx={{
                  backgroundColor: "secondary.light",
                  color: "secondary.contrastText",
                  px: 1,
                  py: 0.5,
                  borderRadius: 1,
                  mr: 1,
                  fontSize: "0.75rem",
                }}
              >
                {filters.isActive ? "Hoạt động" : "Tạm khóa"}
              </Typography>
            )}
            {filters.roleId && (
              <Typography
                component="span"
                sx={{
                  backgroundColor: "info.light",
                  color: "info.contrastText",
                  px: 1,
                  py: 0.5,
                  borderRadius: 1,
                  mr: 1,
                  fontSize: "0.75rem",
                }}
              >
                Vai trò: {roles.find((r) => r.id === filters.roleId)?.name}
              </Typography>
            )}
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default UserFiltersComponent;
