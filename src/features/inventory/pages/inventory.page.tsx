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
import {
  Dashboard,
  Inventory as InventoryIcon,
  List,
  BarChart,
} from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { InventoryList, InventoryStats } from "../components";
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
      id={`inventory-tabpanel-${index}`}
      aria-labelledby={`inventory-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `inventory-tab-${index}`,
    "aria-controls": `inventory-tabpanel-${index}`,
  };
}

const InventoryPage: React.FC = () => {
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
            <InventoryIcon fontSize="small" sx={{ mr: 0.5 }} />
            Quản lý Kho
          </Typography>
        </Breadcrumbs>

        {/* Page Header */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Quản lý Kho (Inventory)
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Theo dõi và quản lý tồn kho sản phẩm trong hệ thống
          </Typography>
        </Box>

        {/* Tabs */}
        <Paper sx={{ mb: 3 }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="inventory management tabs"
            >
              <Tab
                label="Thống kê Kho"
                icon={<BarChart />}
                iconPosition="start"
                {...a11yProps(0)}
              />
              <Tab
                label="Danh sách Inventory"
                icon={<List />}
                iconPosition="start"
                {...a11yProps(1)}
              />
            </Tabs>
          </Box>

          {/* Tab Panels */}
          <TabPanel value={tabValue} index={0}>
            <InventoryStats />
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <InventoryList />
          </TabPanel>
        </Paper>
      </Container>
    </div>
  );
};

export default InventoryPage;
