import { memo, useContext } from "react";
import { Box, Chip } from "@mui/material";
import { ChevronRight, Restaurant } from "@mui/icons-material";
import { SubCategoryChangeContext } from "./HomePage";
import { brand } from "./brand";

const chipSx = (current) => ({
  flexShrink: 0,
  height: 32,
  borderRadius: 999,
  fontSize: 14,
  fontWeight: 600,
  color: current ? brand.primaryDark : brand.ink,
  backgroundColor: current ? brand.tint : brand.card,
  border: `1px solid ${current ? brand.primary : brand.line}`,
  "&:hover": { backgroundColor: current ? brand.tint : brand.bg },
});

// `setIsSub` is now passed in from HomePage. The old code used it without
// receiving it, so clicking the first breadcrumb threw a ReferenceError.
function CustomizedBreadcrumbs({ clearList, removeItemsAfter, getAllItems, setIsSub }) {
  const handleSubCategory = useContext(SubCategoryChangeContext);
  const items = getAllItems();

  // Nothing to navigate back through while the person is on the main list
  if (!items.length) return null;

  function handleRoot() {
    clearList();
    setIsSub?.(false);
  }

  function handleChange(item) {
    removeItemsAfter(item.item_id);
    handleSubCategory(item.item_id);
  }

  return (
    <Box
      component="nav"
      aria-label="breadcrumb"
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 0.5,
        mb: 2.5,
        overflowX: "auto",
        "&::-webkit-scrollbar": { display: "none" },
        scrollbarWidth: "none",
      }}
    >
      <Chip clickable onClick={handleRoot} icon={<Restaurant fontSize="small" />} label="Restaurants" sx={chipSx(false)} />

      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <Box key={item.item_id ?? index} sx={{ display: "flex", alignItems: "center", gap: 0.5, flexShrink: 0 }}>
            <ChevronRight sx={{ fontSize: 20, color: brand.muted }} />
            <Chip
              label={item.label}
              aria-current={isLast ? "page" : undefined}
              clickable={!isLast}
              onClick={isLast ? undefined : () => handleChange(item)}
              sx={chipSx(isLast)}
            />
          </Box>
        );
      })}
    </Box>
  );
}

export default memo(CustomizedBreadcrumbs);
