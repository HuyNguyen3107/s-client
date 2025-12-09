import React from "react";
import { Paper, Stack, Typography } from "@mui/material";
import styles from "../page/policy.page.module.scss";

type SectionProps = {
  id: string;
  title: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
};

export default function PolicySection({
  id,
  title,
  icon,
  children,
}: SectionProps) {
  return (
    <Paper id={id} elevation={0} className={styles.sectionPaper}>
      <Stack direction="row" alignItems="center" gap={1.5}>
        {icon}
        <Typography variant="h5" component="h2" fontWeight={700}>
          {title}
        </Typography>
      </Stack>

      <div className={styles.sectionContent}>{children}</div>
    </Paper>
  );
}
