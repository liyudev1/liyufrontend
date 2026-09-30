import { memo } from "react";
import { Box, Link } from "@mui/material";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { brand } from "./brand";

const LINKS = [
  { label: "Home", to: "/" },
  { label: "My Order", to: "/my-order" },
  { label: "Contact", to: "/contact" },
];

const linkSx = (active) => ({
  px: 2,
  py: 0.75,
  borderRadius: 999,
  fontSize: 16,
  fontWeight: active ? 700 : 500,
  color: active ? brand.primaryDark : brand.ink,
  backgroundColor: active ? brand.tint : "transparent",
  textDecoration: "none",
  transition: "background-color 0.2s, color 0.2s",
  "&:hover": {
    backgroundColor: active ? brand.tint : brand.bg,
    color: active ? brand.primaryDark : brand.ink,
  },
});

function TopNav() {
  const { pathname } = useLocation();

  return (
    <Box component="nav" aria-label="Main" display={{ xs: "none", md: "flex" }} gap={0.5}>
      {LINKS.map(({ label, to }) => (
        <Link
          key={to}
          component={RouterLink}
          to={to}
          underline="none"
          aria-current={pathname === to ? "page" : undefined}
          sx={linkSx(pathname === to)}
        >
          {label}
        </Link>
      ))}

      {/* Plain href on purpose: a full reload makes sure logout clears all app state */}
      <Link href="/logout" underline="none" sx={linkSx(false)}>
        Logout
      </Link>
    </Box>
  );
}

export default memo(TopNav);
