import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Avatar,
  Box,
  Typography,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  PersonAdd as AssignRoleIcon,
  Lock as LockIcon,
  LockOpen as UnlockIcon,
} from "@mui/icons-material";
import type { UserWithRelations } from "../types";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

interface UserTableProps {
  users: UserWithRelations[];
  onEdit: (user: UserWithRelations) => void;
  onDelete: (user: UserWithRelations) => void;
  onView: (user: UserWithRelations) => void;
  onAssignRoles: (user: UserWithRelations) => void;
  onToggleStatus: (user: UserWithRelations) => void;
  loading?: boolean;
}

interface RowActionsProps {
  user: UserWithRelations;
  onEdit: (user: UserWithRelations) => void;
  onDelete: (user: UserWithRelations) => void;
  onView: (user: UserWithRelations) => void;
  onAssignRoles: (user: UserWithRelations) => void;
  onToggleStatus: (user: UserWithRelations) => void;
}

/**
 * Row Actions Component - Following Single Responsibility Principle
 * Handles the dropdown menu actions for each user row
 */
const RowActions: React.FC<RowActionsProps> = ({
  user,
  onEdit,
  onDelete,
  onView,
  onAssignRoles,
  onToggleStatus,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  // Check if user is Super Admin or system account (cannot be deleted)
  const isSystemAccount = !user.isDeletable;

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAction = (action: () => void) => {
    action();
    handleClose();
  };

  return (
    <>
      <IconButton size="small" onClick={handleClick} aria-label="actions">
        <MoreVertIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            minWidth: 180,
          },
        }}
      >
        <MenuItem onClick={() => handleAction(() => onView(user))}>
          <ListItemIcon>
            <ViewIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Xem chi tiết</ListItemText>
        </MenuItem>

        <MenuItem onClick={() => handleAction(() => onEdit(user))}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Chỉnh sửa</ListItemText>
        </MenuItem>

        <Tooltip
          title={
            isSystemAccount
              ? "Không thể gán vai trò cho tài khoản hệ thống"
              : ""
          }
          placement="left"
        >
          <span>
            <MenuItem
              onClick={() => handleAction(() => onAssignRoles(user))}
              disabled={isSystemAccount}
            >
              <ListItemIcon>
                <AssignRoleIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Gán vai trò</ListItemText>
            </MenuItem>
          </span>
        </Tooltip>

        <Tooltip
          title={isSystemAccount ? "Không thể khóa tài khoản hệ thống" : ""}
          placement="left"
        >
          <span>
            <MenuItem
              onClick={() => handleAction(() => onToggleStatus(user))}
              disabled={isSystemAccount}
            >
              <ListItemIcon>
                {user.isActive ? (
                  <LockIcon fontSize="small" />
                ) : (
                  <UnlockIcon fontSize="small" />
                )}
              </ListItemIcon>
              <ListItemText>
                {user.isActive ? "Khóa tài khoản" : "Mở khóa"}
              </ListItemText>
            </MenuItem>
          </span>
        </Tooltip>

        <Tooltip
          title={isSystemAccount ? "Không thể xóa tài khoản hệ thống" : ""}
          placement="left"
        >
          <span>
            <MenuItem
              onClick={() => handleAction(() => onDelete(user))}
              disabled={isSystemAccount}
              sx={{ color: isSystemAccount ? "text.disabled" : "error.main" }}
            >
              <ListItemIcon>
                <DeleteIcon
                  fontSize="small"
                  color={isSystemAccount ? "disabled" : "error"}
                />
              </ListItemIcon>
              <ListItemText>Xóa người dùng</ListItemText>
            </MenuItem>
          </span>
        </Tooltip>
      </Menu>
    </>
  );
};

/**
 * User Avatar Component - Following Single Responsibility Principle
 */
const UserAvatar: React.FC<{ user: UserWithRelations }> = ({ user }) => {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Avatar
      sx={{
        width: 40,
        height: 40,
        bgcolor: user.isActive ? "primary.main" : "grey.500",
      }}
    >
      {getInitials(user.name)}
    </Avatar>
  );
};

/**
 * User Roles Display Component
 */
const UserRoles: React.FC<{ userRoles: any[] }> = ({ userRoles }) => {
  if (!userRoles || userRoles.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        Chưa có vai trò
      </Typography>
    );
  }

  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
      {userRoles.map((userRole: any) => (
        <Chip
          key={userRole.id}
          label={userRole.role.name}
          size="small"
          variant="outlined"
          sx={{ fontSize: "0.75rem" }}
        />
      ))}
    </Box>
  );
};

/**
 * Status Chip Component
 */
const StatusChip: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  return (
    <Chip
      label={isActive ? "Hoạt động" : "Tạm khóa"}
      color={isActive ? "success" : "error"}
      variant="outlined"
      size="small"
    />
  );
};

/**
 * Main User Table Component - Following Single Responsibility Principle
 * Displays users in a table format with actions
 */
export const UserTable: React.FC<UserTableProps> = ({
  users,
  onEdit,
  onDelete,
  onView,
  onAssignRoles,
  onToggleStatus,
  loading = false,
}) => {
  if (loading) {
    return (
      <Paper sx={{ p: 3, textAlign: "center" }}>
        <Typography>Đang tải dữ liệu...</Typography>
      </Paper>
    );
  }

  if (users.length === 0) {
    return (
      <Paper sx={{ p: 3, textAlign: "center" }}>
        <Typography color="text.secondary">
          Không có dữ liệu người dùng
        </Typography>
      </Paper>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
            <TableCell>Người dùng</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Số điện thoại</TableCell>
            <TableCell>Vai trò</TableCell>
            <TableCell>Trạng thái</TableCell>
            <TableCell>Ngày tạo</TableCell>
            <TableCell align="center">Thao tác</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow
              key={user.id}
              hover
              sx={{ cursor: "pointer" }}
              onClick={() => onView(user)}
            >
              {/* User Info */}
              <TableCell>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <UserAvatar user={user} />
                  <Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography variant="subtitle2" fontWeight="medium">
                        {user.name}
                      </Typography>
                      {!user.isDeletable && (
                        <Chip
                          label="Hệ thống"
                          size="small"
                          color="warning"
                          sx={{ height: 20, fontSize: "0.65rem" }}
                        />
                      )}
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      ID: {user.id.slice(0, 8)}...
                    </Typography>
                  </Box>
                </Box>
              </TableCell>

              {/* Email */}
              <TableCell>
                <Tooltip title={user.email} arrow>
                  <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                    {user.email}
                  </Typography>
                </Tooltip>
              </TableCell>

              {/* Phone */}
              <TableCell>
                <Typography variant="body2">{user.phone}</Typography>
              </TableCell>

              {/* Roles */}
              <TableCell sx={{ maxWidth: 200 }}>
                <UserRoles userRoles={user.userRoles} />
              </TableCell>

              {/* Status */}
              <TableCell>
                <StatusChip isActive={user.isActive} />
              </TableCell>

              {/* Created Date */}
              <TableCell>
                <Typography variant="body2">
                  {format(new Date(user.createdAt), "dd/MM/yyyy", {
                    locale: vi,
                  })}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {format(new Date(user.createdAt), "HH:mm", { locale: vi })}
                </Typography>
              </TableCell>

              {/* Actions */}
              <TableCell align="center" onClick={(e) => e.stopPropagation()}>
                <RowActions
                  user={user}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onView={onView}
                  onAssignRoles={onAssignRoles}
                  onToggleStatus={onToggleStatus}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default UserTable;
