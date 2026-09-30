import { memo, useCallback } from "react";
import { Add, Star } from "@mui/icons-material";
import { Box, Card, CardMedia, IconButton, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import AmountControl from "./AmountControl";
import { useCart } from "./CartFunc";
import { brand } from "./brand";

const ProductItem = memo(function ProductItem({ item }) {
  const { addToCart, isItemInCart } = useCart();
  const inCart = isItemInCart(item.id);
  const navigate = useNavigate();

  const openDetail = useCallback(
    () => navigate(`/product-detail/${item.slug}`),
    [navigate, item.slug]
  );

  const handleAdd = (e) => {
    e.stopPropagation();
    addToCart(item);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && e.target === e.currentTarget) openDetail();
  };

  return (
    <Card
      role="link"
      tabIndex={0}
      onClick={openDetail}
      onKeyDown={handleKeyDown}
      elevation={0}
      sx={{
        boxSizing: "border-box",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        width: "100%",
        minWidth: 0,
        cursor: "pointer",
        backgroundColor: brand.card,
        border: `1px solid ${brand.line}`,
        borderRadius: `${brand.radius}px`,
        transition: "border-color 0.2s, box-shadow 0.2s",
        "&:hover": {
          borderColor: brand.primary,
          boxShadow: "0 6px 20px rgba(22,26,35,0.08)",
        },
        "&:focus-visible": {
          outline: `3px solid ${brand.tint}`,
          borderColor: brand.primary,
        },
      }}
    >
      {item.rate != null && item.rate !== "" && (
        <Box
          sx={{
            position: "absolute",
            top: 16,
            left: 16,
            zIndex: 1,
            display: "flex",
            alignItems: "center",
            gap: 0.25,
            px: 0.9,
            py: 0.25,
            borderRadius: 999,
            backgroundColor: "rgba(255,255,255,0.92)",
          }}
        >
          <Star sx={{ color: "#F5A623", fontSize: 15 }} />
          <Typography sx={{ fontSize: 12.5, fontWeight: 700, color: brand.ink }}>
            {item.rate}
          </Typography>
        </Box>
      )}

      <Box
        sx={{
          m: 1,
          p: 1,
          aspectRatio: "4 / 3",
          borderRadius: `${brand.radius - 4}px`,
          backgroundColor: brand.bg,
        }}
      >
        <CardMedia
          component="img"
          loading="lazy"
          decoding="async"
          image={item.images?.[0]?.image || "/default-image.jpg"}
          alt={item.name || "Product image"}
          sx={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1, px: 1.5, pt: 0.5, pb: 1.5 }}>
        <Typography
          sx={{
            fontSize: { xs: 15, sm: 16 },
            fontWeight: 700,
            lineHeight: 1.3,
            color: brand.ink,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            minHeight: "2.6em",
          }}
        >
          {item.name}
        </Typography>

        {item.location && (
          <Typography noWrap sx={{ fontSize: 13, color: brand.muted, mt: 0.25 }}>
            {item.location}
          </Typography>
        )}

        <Box
          sx={{
            mt: "auto",
            pt: 1.25,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1,
          }}
        >
          <Typography sx={{ fontSize: { xs: 16, sm: 17 }, fontWeight: 800, color: brand.ink, flexShrink: 0 }}>
            {item.price}
            <Box component="span" sx={{ ml: 0.5, fontSize: 12, fontWeight: 600, color: brand.muted }}>
              ETB
            </Box>
          </Typography>

          {inCart ? (
            <div onClick={(e) => e.stopPropagation()}>
              <AmountControl item={item} IconSize="18px" />
            </div>
          ) : (
            <IconButton
              aria-label={`Add ${item.name} to cart`}
              onClick={handleAdd}
              sx={{
                width: 36,
                height: 36,
                color: "#fff",
                backgroundColor: brand.primary,
                "&:hover": { backgroundColor: brand.primaryDark },
              }}
            >
              <Add fontSize="small" />
            </IconButton>
          )}
        </Box>
      </Box>
    </Card>
  );
});

export default ProductItem;
