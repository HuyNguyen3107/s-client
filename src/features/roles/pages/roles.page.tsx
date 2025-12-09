import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Paper,
  Breadcrumbs,
  Link,
} from "@mui/material";
import { Dashboard, Security, List, Analytics } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { RoleList, RoleStats } from "../components";
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
      id={`roles-tabpanel-${index}`}
      aria-labelledby={`roles-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `roles-tab-${index}`,
    "aria-controls": `roles-tabpanel-${index}`,
  };
}

/**
 * Roles Management Page - following Single Responsibility Principle
 * Responsible only for managing the main roles interface and navigation
 */
const RolesPage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <div className="site-inner">
      <Container maxWidth="xl" sx={{ py: 3 }}>
        {/* Breadcrumbs */}
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
          <Link
            component={RouterLink}
            underline="hover"
            color="inherit"
            to={ROUTE_PATH.DASHBOARD}
          >
            <Dashboard fontSize="small" sx={{ mr: 0.5 }} />
            Dashboard
          </Link>
          <Typography color="text.primary">
            <Security fontSize="small" sx={{ mr: 0.5 }} />
            Quản lý Vai trò
          </Typography>
        </Breadcrumbs>

        {/* Page Header */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{ fontSize: { xs: "24px", sm: "32px", md: "2.125rem" } }}
          >
            Quản lý Vai trò & Quyền hạn
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
          >
            Quản lý vai trò và gán quyền hạn cho người dùng trong hệ thống
          </Typography>
        </Box>

        {/* Tabs */}
        <Paper sx={{ mb: 3, overflowX: "auto" }}>
          <Box
            sx={{
              borderBottom: 1,
              borderColor: "divider",
              px: { xs: 1.5, sm: 3 },
              pt: 3,
            }}
          >
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="roles management tabs"
              sx={{
                "& .MuiTab-root": {
                  minHeight: { xs: 48, sm: 64 },
                  fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" },
                  textTransform: "none",
                },
              }}
            >
              <Tab
                label="Thống kê"
                icon={<Analytics />}
                iconPosition="start"
                {...a11yProps(0)}
              />
              <Tab
                label="Danh sách Vai trò"
                icon={<List />}
                iconPosition="start"
                {...a11yProps(1)}
              />
            </Tabs>
          </Box>

          {/* Tab Panels */}
          <TabPanel value={tabValue} index={0}>
            <RoleStats />
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <RoleList />
          </TabPanel>
        </Paper>
      </Container>
    </div>
  );
};

export default RolesPage;
