import { Box, Typography, Paper, Button } from "@mui/material";
import styles from "./login.module.scss";
import { useLogin } from "../hooks/use-login.hooks";
import FormInput from "../../../components/form-input.components";
// LoadingButton functionality is now in Button
import colors from "../../../constants/colors";
import usePageMetadata from "../../../hooks/use-page-metadata.hooks";

export default function LoginPage() {
  const { control, onSubmit, rules, pending, formState } = useLogin();

  // Set page metadata
  usePageMetadata();
  return (
    <div className="site-inner">
      <Paper className={styles["login-root"]} elevation={2} component="section">
        <Box className={styles["login-inner"]}>
          <Typography
            variant="h4"
            component="h1"
            className={styles.title}
            gutterBottom
          >
            Đăng nhập
          </Typography>

          <form className={styles.form} onSubmit={onSubmit}>
            <FormInput
              name="email"
              control={control}
              label="Email"
              rule={rules.email}
              fullWidth
              required
              margin="normal"
            />

            <FormInput
              name="password"
              control={control}
              label="Mật khẩu"
              type="password"
              rule={rules.password}
              fullWidth
              required
              margin="normal"
            />

            <Box className={styles.actions}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={!formState.isValid || !formState.isDirty || pending}
                sx={{
                  backgroundColor: colors.brand.primary,
                  "&:hover": {
                    backgroundColor: colors.brand.secondary,
                  },
                }}
              >
                {pending ? "Đang đăng nhập..." : "Đăng nhập"}
              </Button>
            </Box>
          </form>
        </Box>
      </Paper>
    </div>
  );
}
