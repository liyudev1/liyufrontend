import { memo } from "react";
import { Add, RemoveRounded } from "@mui/icons-material";
import { Box, IconButton, Typography } from "@mui/material";
import { useCart } from "./CartFunc";
import { brand } from "./brand";

// IconSize is a pixel size such as "18px" or "20px". The old code passed it to
// `fontSize`, which only accepts "small" / "medium" / "large", so it was ignored.
function AmountControl({ item, IconSize }) {
  const { decreaseItem, getItemQuantity, addToCart } = useCart();
  const quantity = getItemQuantity(item.id);

  const iconPx = parseInt(IconSize, 10) || 22;
  const buttonPx = iconPx + 8;

  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 0.25,
        p: 0.25,
        borderRadius: 999,
        backgroundColor: brand.card,
        border: `1px solid ${brand.line}`,
      }}
    >
      <IconButton
        aria-label="Decrease quantity"
        onClick={() => decreaseItem(item.id)}
        sx={{ width: buttonPx, height: buttonPx, color: brand.ink, "&:hover": { backgroundColor: brand.bg } }}
      >
        <RemoveRounded sx={{ fontSize: iconPx }} />
      </IconButton>

      <Typography
        aria-live="polite"
        sx={{ minWidth: 20, textAlign: "center", fontSize: 15, fontWeight: 700, color: brand.ink }}
      >
        {quantity}
      </Typography>

      <IconButton
        aria-label="Increase quantity"
        onClick={() => addToCart(item)}
        sx={{
          width: buttonPx,
          height: buttonPx,
          color: "#fff",
          backgroundColor: brand.primary,
          "&:hover": { backgroundColor: brand.primaryDark },
        }}
      >
        <Add sx={{ fontSize: iconPx }} />
      </IconButton>
    </Box>
  );
}

export default memo(AmountControl);
