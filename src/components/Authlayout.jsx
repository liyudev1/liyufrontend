import { useState } from "react";
import { Box, Button, CircularProgress, IconButton, InputAdornment, TextField, Typography } from "@mui/material";
import { DeliveryDining, Visibility, VisibilityOff } from "@mui/icons-material";
import { Controller } from "react-hook-form";
import { brand } from "./brand";

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "12px",
    backgroundColor: brand.card,
    "&.Mui-focused fieldset": { borderColor: brand.primary },
  },
  "& label.Mui-focused": { color: brand.primaryDark },
};

/** Page background, logo and white card shared by the login and register pages. */
export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <Box
      sx={{
        boxSizing: "border-box",
        minHeight: "100dvh",
        width: "100%",
        p: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: `linear-gradient(180deg, ${brand.tint} 0%, ${brand.bg} 45%)`,
      }}
    >
      <Box
        sx={{
          boxSizing: "border-box",
          width: "100%",
          maxWidth: 440,
          p: { xs: 3, sm: 4 },
          backgroundColor: brand.card,
          border: `1px solid ${brand.line}`,
          borderRadius: `${brand.radius + 8}px`,
          boxShadow: "0 12px 40px rgba(22,26,35,0.08)",
        }}
      >
        <Box sx={{ mb: 3, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
          <Box
            sx={{
              width: 56,
              height: 56,
              mb: 1.5,
              display: "grid",
              placeItems: "center",
              borderRadius: "18px",
              color: "#fff",
              backgroundColor: brand.primary,
            }}
          >
            <DeliveryDining sx={{ fontSize: 36, transform: "scaleX(-1)" }} />
          </Box>
          <Typography sx={{ fontSize: 15, fontWeight: 700, color: brand.muted }}>Liyu Delivery</Typography>
          <Typography component="h1" sx={{ mt: 1.5, fontSize: 26, fontWeight: 800, letterSpacing: "-0.4px", color: brand.ink }}>
            {title}
          </Typography>
          {subtitle && <Typography sx={{ mt: 0.5, color: brand.muted }}>{subtitle}</Typography>}
        </Box>

        {children}

        {footer && <Box sx={{ mt: 3, textAlign: "center", color: brand.muted }}>{footer}</Box>}
      </Box>
    </Box>
  );
}

/** react-hook-form field with an icon, error text and (for passwords) a show/hide toggle. */
export function AuthField({ control, name, label, icon, type = "text", rules, hint, onValueChange, ...textFieldProps }) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field: { ref, onChange, ...field }, fieldState }) => (
        <TextField
          {...field}
          inputRef={ref}
          onChange={(e) => onChange(onValueChange ? onValueChange(e.target.value) : e)}
          label={label}
          type={isPassword && show ? "text" : type}
          fullWidth
          error={!!fieldState.error}
          helperText={fieldState.error?.message || hint || " "}
          sx={fieldSx}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start" sx={{ color: fieldState.error ? "error.main" : brand.muted }}>
                {icon}
              </InputAdornment>
            ),
            endAdornment: isPassword ? (
              <InputAdornment position="end">
                <IconButton
                  edge="end"
                  aria-label={show ? "Hide password" : "Show password"}
                  onClick={() => setShow((v) => !v)}
                  onMouseDown={(e) => e.preventDefault()}
                >
                  {show ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ) : null,
          }}
          {...textFieldProps}
        />
      )}
    />
  );
}

export function AuthSubmitButton({ loading = false, loadingText, disabled = false, children }) {
  return (
    <Button
      type="submit"
      fullWidth
      variant="contained"
      disableElevation
      disabled={disabled || loading}
      startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
      sx={{
        py: 1.4,
        borderRadius: 999,
        fontSize: 16,
        fontWeight: 700,
        textTransform: "none",
        backgroundColor: brand.primary,
        "&:hover": { backgroundColor: brand.primaryDark },
        "&.Mui-disabled": { backgroundColor: brand.line, color: brand.muted },
      }}
    >
      {loading ? loadingText : children}
    </Button>
  );
}
