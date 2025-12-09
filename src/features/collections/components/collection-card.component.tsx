import React from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Skeleton,
} from "@mui/material";
import {
  MoreVert,
  Edit,
  Delete,
  Visibility,
  VisibilityOff,
  Star,
  PhotoLibrary,
} from "@mui/icons-material";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import type { Collection } from "../types/collection.types";

interface CollectionCardProps {
  collection: Collection;
  onEdit: (collection: Collection) => void;
  onDelete: (collection: Collection) => void;
  onToggleStatus: (collection: Collection) => void;
  onView: (collection: Collection) => void;
  isLoading?: boolean;
}

// Collection Card Component - Single Responsibility Principle (SRP)
const CollectionCard: React.FC<CollectionCardProps> = ({
  collection,
  onEdit,
  onDelete,
  onToggleStatus,
  onView,
  isLoading = false,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuAction = (action: () => void) => {
    action();
    handleMenuClose();
  };

  if (isLoading) {
    return (
      <Card sx={{ height: "100%", position: "relative" }}>
        <Skeleton variant="rectangular" height={150} />
        <CardContent sx={{ pb: 1.5 }}>
          <Skeleton variant="text" height={24} />
          <Skeleton variant="text" height={16} />
          <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
            <Skeleton variant="rounded" width={60} height={20} />
            <Skeleton variant="rounded" width={40} height={20} />
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      sx={{
        height: "100%",
        position: "relative",
        cursor: "pointer",
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 3,
        },
        opacity: collection.isActive ? 1 : 0.7,
      }}
      onClick={() => onView(collection)}
    >
      {/* Image */}
      <Box sx={{ position: "relative" }}>
        {collection.imageUrl ? (
          <CardMedia
            component="img"
            height="150"
            image={collection.imageUrl}
            alt={collection.name}
            sx={{ objectFit: "cover" }}
          />
        ) : (
          <Box
            sx={{
              height: 150,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "grey.100",
              color: "grey.400",
            }}
          >
            <PhotoLibrary sx={{ fontSize: 48 }} />
          </Box>
        )}

        {/* Status Indicators */}
        <Box
          sx={{
            position: "absolute",
            top: 8,
            left: 8,
            display: "flex",
            gap: 1,
          }}
        >
          {collection.isHot && (
            <Chip
              icon={<Star />}
              label="Hot"
              size="small"
              color="warning"
              sx={{ fontWeight: "bold" }}
            />
          )}
          <Chip
            label={collection.isActive ? "Hoạt động" : "Tạm dừng"}
            size="small"
            color={collection.isActive ? "success" : "default"}
          />
        </Box>

        {/* Actions Menu */}
        <Box sx={{ position: "absolute", top: 8, right: 8 }}>
          <IconButton
            size="small"
            onClick={handleMenuClick}
            sx={{
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              "&:hover": { backgroundColor: "rgba(255, 255, 255, 1)" },
            }}
          >
            <MoreVert />
          </IconButton>
        </Box>
      </Box>

      <CardContent sx={{ flexGrow: 1, pb: 1.5, pt: 1.5 }}>
        {/* Title */}
        <Typography
          variant="subtitle1"
          component="h3"
          gutterBottom
          sx={{
            fontWeight: "bold",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            mb: 1,
          }}
        >
          {collection.name}
        </Typography>

        {/* Description */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 1,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            minHeight: 20,
          }}
        >
          {collection.description}
        </Typography>

        {/* Metadata - Compact single line */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 0.5,
          }}
        >
          <Typography variant="caption" color="text.secondary">
            {collection.productCount || 0} SP • #{collection.sortOrder}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {format(new Date(collection.createdAt), "dd/MM/yy", { locale: vi })}
          </Typography>
        </Box>
      </CardContent>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        onClick={(e) => e.stopPropagation()}
      >
        <MenuItem onClick={() => handleMenuAction(() => onEdit(collection))}>
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          <ListItemText>Chỉnh sửa</ListItemText>
        </MenuItem>

        <MenuItem
          onClick={() => handleMenuAction(() => onToggleStatus(collection))}
        >
          <ListItemIcon>
            {collection.isActive ? (
              <VisibilityOff fontSize="small" />
            ) : (
              <Visibility fontSize="small" />
            )}
          </ListItemIcon>
          <ListItemText>
            {collection.isActive ? "Tạm dừng" : "Kích hoạt"}
          </ListItemText>
        </MenuItem>

        <MenuItem
          onClick={() => handleMenuAction(() => onDelete(collection))}
          sx={{ color: "error.main" }}
        >
          <ListItemIcon>
            <Delete fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Xóa</ListItemText>
        </MenuItem>
      </Menu>
    </Card>
  );
};

export { CollectionCard };
