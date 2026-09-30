import { memo, useCallback } from "react";
import { HomeRounded, Logout, PersonOutlined, Restore } from "@mui/icons-material";
import { BottomNavigation, BottomNavigationAction, Box, Paper } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { brand } from "./brand";

const ITEMS = [
  { value: "home", label: "Home", to: "/", Icon: HomeRounded },
  { value: "my-order", label: "My Order", to: "/my-order", Icon: Restore },
  { value: "contact", label: "Contact", to: "/contact", Icon: PersonOutlined },
  { value: "logout", label: "Logout", to: "/logout", Icon: Logout },
];

// The active tab is derived from the URL, so no extra state or effect is needed.
function getValueFromPath(pathname) {
  if (pathname.startsWith("/my-order")) return "my-order";
  if (pathname.startsWith("/contact")) return "contact";
  return "home"; // same default as before
}

function BottomNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const value = getValueFromPath(pathname);

  const handleChange = useCallback(
    (_event, newValue) => {
      const target = ITEMS.find((item) => item.value === newValue);
      if (target) navigate(target.to);
    },
    [navigate]
  );

  return (
    <Paper
      component="nav"
      aria-label="Main"
      elevation={0}
      sx={{
        display: { xs: "block", md: "none" },
        boxSizing: "border-box",
        position: "fixed",
        left: 16,
        right: 16,
        bottom: "calc(12px + env(safe-area-inset-bottom))",
        maxWidth: 440,
        mx: "auto", // centers the bar on wider phones and tablets
        zIndex: (theme) => theme.zIndex.appBar,
        overflow: "hidden",
        borderRadius: 999,
        border: `1px solid ${brand.line}`,
        backgroundColor: "rgba(255,255,255,0.92)",
        backdropFilter: "saturate(180%) blur(12px)",
        boxShadow: "0 8px 24px rgba(22,26,35,0.12)",
      }}
    >
      <BottomNavigation
        showLabels
        value={value}
        onChange={handleChange}
        sx={{ height: 64, backgroundColor: "transparent" }}
      >
        {ITEMS.map(({ value: itemValue, label, Icon }) => {
          const active = value === itemValue;
          return (
            <BottomNavigationAction
              key={itemValue}
              value={itemValue}
              label={label}
              icon={
                <Box
                  sx={{
                    display: "flex",
                    px: 2,
                    py: 0.4,
                    borderRadius: 999,
                    backgroundColor: active ? brand.tint : "transparent",
                    transition: "background-color 0.2s",
                  }}
                >
                  <Icon sx={{ fontSize: 24 }} />
                </Box>
              }
              sx={{
                minWidth: 0,
                px: 0.5,
                color: brand.muted,
                "&.Mui-selected": { color: brand.primaryDark },
                "& .MuiBottomNavigationAction-label": {
                  fontSize: 12,
                  fontWeight: 600,
                  // MUI enlarges the selected label by default; keep it steady
                  "&.Mui-selected": { fontSize: 12 },
                },
              }}
            />
          );
        })}
      </BottomNavigation>
    </Paper>
  );
}

export default memo(BottomNav);
