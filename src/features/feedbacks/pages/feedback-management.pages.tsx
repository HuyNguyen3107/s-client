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
import { Dashboard, Analytics, List } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import FeedbackStats from "../components/feedback-stats.component";
import FeedbackList from "../components/feedback-list.component";
import { ROUTE_PATH } from "../../../constants/route-path.constants";
import styles from "./feedback-management.module.scss";
import usePageMetadata from "../../../hooks/use-page-metadata.hooks";

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
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function FeedbackManagementPage() {
  const [tabValue, setTabValue] = useState(0);

  // Set page metadata
  usePageMetadata();

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <div className="site-inner">
      <Container maxWidth="xl" className={styles.container}>
        {/* Breadcrumbs */}
        <Breadcrumbs aria-label="breadcrumb" className={styles.breadcrumbs}>
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
            <Analytics fontSize="small" sx={{ mr: 0.5 }} />
            Quản lý Feedbacks
          </Typography>
        </Breadcrumbs>

        {/* Page Header */}
        <Box className={styles.header}>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{ fontSize: { xs: "24px", sm: "32px", md: "2.125rem" } }}
          >
            Quản lý Feedbacks
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
          >
            Theo dõi và quản lý phản hồi từ khách hàng
          </Typography>
        </Box>

        {/* Tabs */}
        <Paper className={styles.tabsContainer} sx={{ overflowX: "auto" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="feedback management tabs"
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
                label="Danh sách Feedbacks"
                icon={<List />}
                iconPosition="start"
                {...a11yProps(1)}
              />
            </Tabs>
          </Box>

          {/* Tab Panels */}
          <TabPanel value={tabValue} index={0}>
            <FeedbackStats />
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <FeedbackList />
          </TabPanel>
        </Paper>
      </Container>
    </div>
  );
}
