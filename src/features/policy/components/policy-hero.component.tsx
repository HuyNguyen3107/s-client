import {
  Container,
  Breadcrumbs,
  Link,
  Typography,
  Stack,
  Chip,
} from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import GppGoodOutlinedIcon from "@mui/icons-material/GppGoodOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import CancelScheduleSendOutlinedIcon from "@mui/icons-material/CancelScheduleSendOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import styles from "../page/policy.page.module.scss";
import colors from "../../../constants/colors";

type HeroProps = {
  onJump?: (id: string) => void;
};

const sections = [
  {
    id: "warranty",
    label: "Bảo hành",
    icon: <GppGoodOutlinedIcon fontSize="small" />,
  },
  {
    id: "confirmation",
    label: "Xác nhận & Demo",
    icon: <Inventory2OutlinedIcon fontSize="small" />,
  },
  {
    id: "cancellation",
    label: "Hủy đơn",
    icon: <CancelScheduleSendOutlinedIcon fontSize="small" />,
  },
  {
    id: "commitment",
    label: "Cam kết",
    icon: <CheckCircleOutlineIcon fontSize="small" />,
  },
];

export default function PolicyHero({ onJump }: HeroProps) {
  return (
    <div
      className={styles.heroRoot}
      style={{ backgroundColor: colors.brand.primary }}
    >
      <Container maxWidth="lg">
        <Breadcrumbs
          aria-label="breadcrumb"
          className={`${styles.breadcrumbs} animate-fade-in`}
        >
          <Link underline="hover" color="inherit" href="/">
            <Stack direction="row" gap={0.5} alignItems="center">
              <HomeOutlinedIcon fontSize="small" />
              <span
                style={{
                  color: "#fff",
                }}
              >
                Trang chủ
              </span>
            </Stack>
          </Link>
          <Typography color="#fff">Chính sách</Typography>
        </Breadcrumbs>

        <Typography
          variant="h3"
          component="h1"
          className={`${styles.title} animate-fade-in-up delay-100`}
          style={{ opacity: 0 }}
        >
          Chính sách bảo hành & hủy đơn
        </Typography>
        <Typography
          variant="subtitle1"
          className={`${styles.subtitle} animate-fade-in-up delay-200`}
          style={{ opacity: 0 }}
        >
          Áp dụng cho khung tranh “Dear You” và các sản phẩm thiết kế theo yêu
          cầu
        </Typography>

        <Stack
          direction="row"
          flexWrap="wrap"
          gap={1.5}
          mt={3}
          className="animate-fade-in-up delay-300"
          style={{ opacity: 0 }}
        >
          {sections.map((s) => (
            <Chip
              key={s.id}
              icon={s.icon}
              label={<span className={styles.chipLabel}>{s.label}</span>}
              onClick={() => onJump?.(s.id)}
              className={styles.chip}
              clickable
              sx={{
                color: "#fff",
                "& .MuiChip-icon": { color: "#fff" },
                "& .MuiChip-label": { color: "#fff" },
              }}
            />
          ))}
        </Stack>
      </Container>
    </div>
  );
}
