import React, { useCallback } from "react";
import {
  Box,
  Container,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Button,
  Divider,
  Stack,
} from "@mui/material";
import GppGoodOutlinedIcon from "@mui/icons-material/GppGoodOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import CancelScheduleSendOutlinedIcon from "@mui/icons-material/CancelScheduleSendOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import PolicyHero from "../components/policy-hero.component";
import PolicySection from "../components/policy-section.component";
import ScrollReveal from "../../home/components/scroll-reveal.component";
import colors from "../../../constants/colors";
import usePageMetadata from "../../../hooks/use-page-metadata.hooks";

const PolicyPage: React.FC = () => {
  // Set page metadata
  usePageMetadata();

  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <Box>
      {/* Hero */}
      <PolicyHero onJump={(id) => scrollTo(id)} />

      <Container maxWidth="lg" sx={{ mt: { xs: 5, md: 7 } }}>
        <ScrollReveal animation="fade-in-up">
          <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
            Soligant luôn nỗ lực mang đến trải nghiệm tốt nhất và xử lý linh
            hoạt trong mọi tình huống. Mọi chính sách dưới đây nhằm đảm bảo
            quyền lợi khách hàng và chất lượng sản phẩm.
          </Typography>
        </ScrollReveal>

        <ScrollReveal animation="fade-in-up" delay={100}>
          <PolicySection
            id="warranty"
            title="1. Bảo hành sản phẩm"
            icon={<GppGoodOutlinedIcon color="primary" />}
          >
            <div>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                🔹 Trường hợp 1: Sản phẩm lỗi nghiêm trọng – sai hoàn
                toàn/hỏng/mất mảnh/không sử dụng được
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleOutlineIcon color="success" />
                  </ListItemIcon>
                  <ListItemText primary="Shop sẽ gửi lại sản phẩm mới 100%." />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <LocalShippingOutlinedIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="Soligant chi trả phí vận chuyển lần 2; phí ship đơn ban đầu do khách thanh toán như bình thường." />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Inventory2OutlinedIcon color="action" />
                  </ListItemIcon>
                  <ListItemText primary="Hàng lỗi sẽ được thu hồi khi gửi đơn mới, khách không cần gửi về trước." />
                </ListItem>
              </List>

              <Typography
                variant="subtitle1"
                fontWeight={600}
                gutterBottom
                sx={{ mt: 2 }}
              >
                🔹 Trường hợp 2: Lỗi nhỏ khi nhận – lỏng/rơi LEGO, sai nhẹ nội
                dung nền
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleOutlineIcon color="success" />
                  </ListItemIcon>
                  <ListItemText primary="Soligant hướng dẫn xử lý tại nhà (dán LEGO, chỉnh sửa nhỏ…)." />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <ErrorOutlineOutlinedIcon color="warning" />
                  </ListItemIcon>
                  <ListItemText primary="Nếu không thể khắc phục, shop xử lý linh động (gửi chi tiết bổ sung, ưu đãi đơn sau…)." />
                </ListItem>
              </List>

              <Typography
                variant="subtitle1"
                fontWeight={600}
                gutterBottom
                sx={{ mt: 2 }}
              >
                🔹 Trường hợp khác
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Các tình huống ngoài hai mục trên sẽ được xem xét và hỗ trợ linh
                hoạt, đảm bảo quyền lợi khách hàng.
              </Typography>
            </div>
          </PolicySection>
        </ScrollReveal>

        <ScrollReveal animation="fade-in-up" delay={100}>
          <PolicySection
            id="confirmation"
            title="2. Xác nhận đơn hàng & Demo thiết kế"
            icon={<Inventory2OutlinedIcon color="primary" />}
          >
            <List dense>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleOutlineIcon color="success" />
                </ListItemIcon>
                <ListItemText primary="Sau khi gửi demo LEGO, vui lòng phản hồi trong 12 giờ để xác nhận." />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <ErrorOutlineOutlinedIcon color="warning" />
                </ListItemIcon>
                <ListItemText primary="Quá 12 giờ không phản hồi, đơn sẽ tự động hủy để tránh ảnh hưởng tiến độ." />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleOutlineIcon color="success" />
                </ListItemIcon>
                <ListItemText primary="Nếu vẫn có nhu cầu, bạn có thể đặt lại đơn mới; chúng mình luôn sẵn sàng hỗ trợ." />
              </ListItem>
            </List>
          </PolicySection>
        </ScrollReveal>

        <ScrollReveal animation="fade-in-up" delay={100}>
          <PolicySection
            id="cancellation"
            title="3. Chính sách hủy đơn"
            icon={<CancelScheduleSendOutlinedIcon color="primary" />}
          >
            <Typography
              variant="subtitle1"
              fontWeight={600}
              gutterBottom
              sx={{ mt: 2 }}
            >
              🔸 Sau 12 giờ kể từ thanh toán
            </Typography>
            <List dense>
              <ListItem>
                <ListItemIcon>
                  <ErrorOutlineOutlinedIcon color="warning" />
                </ListItemIcon>
                <ListItemText primary="Hủy đơn sẽ thu 30% giá trị để bù chi phí phát sinh (thiết kế, nhân công, nguyên liệu…)." />
              </ListItem>
            </List>

            <Typography
              variant="subtitle1"
              fontWeight={600}
              gutterBottom
              sx={{ mt: 2 }}
            >
              🔸 Sau khi lên mẫu & tiến hành sản xuất
            </Typography>
            <List dense>
              <ListItem>
                <ListItemIcon>
                  <ErrorOutlineOutlinedIcon color="error" />
                </ListItemIcon>
                <ListItemText primary="Không hỗ trợ hủy đơn dưới bất kỳ hình thức nào (sản phẩm cá nhân hóa, không thể tái sử dụng/bán lại)." />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <ErrorOutlineOutlinedIcon color="error" />
                </ListItemIcon>
                <ListItemText primary="Trường hợp không nhận hàng/cố tình né tránh sẽ bị ghi nhận và từ chối hỗ trợ ở các đơn tiếp theo." />
              </ListItem>
            </List>
          </PolicySection>
        </ScrollReveal>

        <ScrollReveal animation="scale-in">
          <PolicySection
            id="commitment"
            title="Soligant cam kết"
            icon={<CheckCircleOutlineIcon color="primary" />}
          >
            <List dense sx={{ mt: 1 }}>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleOutlineIcon color="success" />
                </ListItemIcon>
                <ListItemText primary="Làm hết sức để từng món quà đến tay bạn đúng – đủ – đẹp." />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleOutlineIcon color="success" />
                </ListItemIcon>
                <ListItemText primary="Sẵn sàng lắng nghe và xử lý linh hoạt, công bằng cho mỗi tình huống." />
              </ListItem>
            </List>

            <Divider sx={{ my: 2 }} />
            <Stack
              direction={{ xs: "column", sm: "row" }}
              gap={1.5}
              justifyContent="space-between"
              alignItems={{ xs: "stretch", sm: "center" }}
            >
              <Typography variant="body2" color="text.secondary">
                Cần hỗ trợ thêm? Liên hệ Soligant để được tư vấn nhanh chóng.
              </Typography>
              <Stack direction="row" gap={1}>
                <Button
                  variant="contained"
                  href="/contact"
                  sx={{
                    backgroundColor: colors.brand.primary,
                    color: colors.brand.contrast,
                    "&:hover": { backgroundColor: colors.brand.secondary },
                  }}
                >
                  Liên hệ
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => scrollTo("warranty")}
                  sx={{
                    color: colors.brand.primary,
                    borderColor: colors.brand.primary,
                    "&:hover": {
                      backgroundColor: colors.brand.primary,
                      color: colors.brand.contrast,
                    },
                  }}
                >
                  Xem bảo hành
                </Button>
              </Stack>
            </Stack>
          </PolicySection>
        </ScrollReveal>
      </Container>
    </Box>
  );
};

export default PolicyPage;
