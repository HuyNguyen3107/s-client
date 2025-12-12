import {
  Box,
  Typography,
  Paper,
  Button,
  Alert,
  TextField,
  InputAdornment,
  IconButton,
  CircularProgress,
  Container,
} from "@mui/material";
import { Visibility, VisibilityOff, Email as EmailIcon } from "@mui/icons-material";
import { useState } from "react";
import { Controller } from "react-hook-form";
import styles from "./login.module.scss";
import { useLogin } from "../hooks/use-login.hooks";
import colors from "../../../constants/colors";
import usePageMetadata from "../../../hooks/use-page-metadata.hooks";

export default function LoginPage() {
  const {
    control,
    onSubmit,
    rules,
    pending,
    formState: { errors, touchedFields },
  } = useLogin();

  const [showPassword, setShowPassword] = useState(false);

  // Set page metadata
  usePageMetadata();

  // Kiểm tra có lỗi validation không
  const hasValidationErrors = Object.keys(errors).length > 0;
  const isFormTouched = Object.keys(touchedFields).length > 0;

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  return (
    <Box
      className={styles["login-container"]}
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f5f5f5",
        overflow: "hidden",
        py: { xs: 1, sm: 2 },
        px: { xs: 1, sm: 2 },
      }}
    >
      <Container
        maxWidth="sm"
        sx={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          py: { xs: 1, sm: 2 },
        }}
      >
        <Paper
          elevation={24}
          sx={{
            borderRadius: 4,
            overflow: "hidden",
            background: "rgba(255, 255, 255, 0.98)",
            backdropFilter: "blur(10px)",
            width: "100%",
            maxHeight: { xs: "95vh", sm: "90vh" },
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              background: `linear-gradient(135deg, ${colors.brand.primary} 0%, ${colors.brand.secondary} 100%)`,
              py: { xs: 2.5, sm: 3 },
              px: { xs: 2, sm: 3 },
              textAlign: "center",
              flexShrink: 0,
            }}
          >
            <Box
              sx={{
                width: { xs: 60, sm: 70 },
                height: { xs: 60, sm: 70 },
                borderRadius: "50%",
                background: "rgba(255, 255, 255, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto",
                mb: { xs: 1, sm: 1.5 },
                backdropFilter: "blur(10px)",
              }}
            >
              <EmailIcon sx={{ fontSize: { xs: 30, sm: 35 }, color: "white" }} />
            </Box>
            <Typography
              variant="h4"
              component="h1"
              sx={{
                color: "white",
                fontWeight: 700,
                fontSize: { xs: "1.5rem", sm: "1.75rem" },
                textShadow: "0 2px 10px rgba(0,0,0,0.2)",
                mb: 0.5,
              }}
            >
              Đăng nhập
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "rgba(255, 255, 255, 0.9)",
                fontSize: { xs: "0.8125rem", sm: "0.875rem" },
              }}
            >
              Chào mừng bạn trở lại!
            </Typography>
          </Box>

          <Box
            sx={{
              p: { xs: 2.5, sm: 3 },
              flex: 1,
              display: "flex",
              flexDirection: "column",
              overflowY: "auto",
              "&::-webkit-scrollbar": {
                width: "4px",
              },
              "&::-webkit-scrollbar-track": {
                background: "transparent",
              },
              "&::-webkit-scrollbar-thumb": {
                background: colors.brand.primary,
                borderRadius: "2px",
              },
            }}
          >
            <form onSubmit={onSubmit} noValidate style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <Box sx={{ mb: { xs: 2, sm: 2.5 } }}>
                <Controller
                  name="email"
                  control={control}
                  rules={rules.email}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Email"
                      type="email"
                      autoComplete="email"
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message || ""}
                      autoFocus
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          transition: "all 0.3s ease",
                          "&:hover": {
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderColor: colors.brand.primary,
                              borderWidth: 2,
                            },
                          },
                          "&.Mui-focused": {
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderColor: colors.brand.primary,
                              borderWidth: 2,
                            },
                          },
                        },
                        "& .MuiInputLabel-root.Mui-focused": {
                          color: colors.brand.primary,
                        },
                      }}
                    />
                  )}
                />
              </Box>

              <Box sx={{ mb: { xs: 2, sm: 2.5 } }}>
                <Controller
                  name="password"
                  control={control}
                  rules={rules.password}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Mật khẩu"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message || ""}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickShowPassword}
                              onMouseDown={handleMouseDownPassword}
                              edge="end"
                              sx={{
                                color: fieldState.error
                                  ? "error.main"
                                  : colors.brand.primary,
                                "&:hover": {
                                  backgroundColor: "rgba(115, 22, 24, 0.08)",
                                },
                              }}
                            >
                              {showPassword ? (
                                <VisibilityOff fontSize="small" />
                              ) : (
                                <Visibility fontSize="small" />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          transition: "all 0.3s ease",
                          "&:hover": {
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderColor: colors.brand.primary,
                              borderWidth: 2,
                            },
                          },
                          "&.Mui-focused": {
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderColor: colors.brand.primary,
                              borderWidth: 2,
                            },
                          },
                        },
                        "& .MuiInputLabel-root.Mui-focused": {
                          color: colors.brand.primary,
                        },
                      }}
                    />
                  )}
                />
              </Box>

              {/* Hiển thị thông báo lỗi tổng hợp nếu có */}
              {hasValidationErrors && isFormTouched && (
                <Alert
                  severity="error"
                  sx={{
                    mb: { xs: 1.5, sm: 2 },
                    borderRadius: 2,
                    fontSize: { xs: "0.8125rem", sm: "0.875rem" },
                    "& .MuiAlert-icon": {
                      alignItems: "center",
                    },
                  }}
                >
                  Vui lòng kiểm tra lại thông tin đăng nhập. Email và mật khẩu
                  phải hợp lệ.
                </Alert>
              )}

              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={pending}
                sx={{
                  backgroundColor: colors.brand.primary,
                  backgroundImage: `linear-gradient(135deg, ${colors.brand.primary} 0%, ${colors.brand.secondary} 100%)`,
                  color: "white",
                  py: { xs: 1.25, sm: 1.5 },
                  borderRadius: 2,
                  fontSize: { xs: "0.9375rem", sm: "1rem" },
                  fontWeight: 600,
                  textTransform: "none",
                  boxShadow: "0 4px 15px rgba(115, 22, 24, 0.4)",
                  transition: "all 0.3s ease",
                  mt: "auto",
                  "&:hover": {
                    backgroundImage: `linear-gradient(135deg, ${colors.brand.secondary} 0%, ${colors.brand.primary} 100%)`,
                    boxShadow: "0 6px 20px rgba(115, 22, 24, 0.6)",
                    transform: "translateY(-2px)",
                  },
                  "&:active": {
                    transform: "translateY(0)",
                  },
                  "&:disabled": {
                    backgroundImage: `linear-gradient(135deg, ${colors.brand.primary} 0%, ${colors.brand.secondary} 100%)`,
                    opacity: 0.7,
                    cursor: "not-allowed",
                  },
                }}
              >
                {pending ? (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CircularProgress size={20} sx={{ color: "white" }} />
                    <span>Đang đăng nhập...</span>
                  </Box>
                ) : (
                  "Đăng nhập"
                )}
              </Button>
            </form>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
