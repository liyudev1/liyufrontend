import { memo, useCallback, useContext, useState } from "react";
import { Fastfood, LocationOn } from "@mui/icons-material";
import { Box, Button, Card, CircularProgress, Typography } from "@mui/material";
import { SubCategoryChangeContext } from "./HomePage";
import { brand } from "./brand";

const RestaurantItem = memo(function RestaurantItem({ item, addItem }) {
  const handleSubCategory = useContext(SubCategoryChangeContext);
  const [loading, setLoading] = useState(false);

  const handleClick = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    try {
      // handleSubCategory returns false when loading the menu failed
      const ok = await handleSubCategory(item.id);
      if (ok) await addItem(item.id, item.name);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [loading, handleSubCategory, addItem, item.id, item.name]);

  return (
    <Card
      elevation={0}
      sx={{
        // full width on phones, two grid columns on larger screens
        gridColumn: { xs: "1 / -1", sm: "span 2" },
        minWidth: 0,
        backgroundColor: brand.card,
        border: `1px solid ${brand.line}`,
        borderRadius: `${brand.radius}px`,
        transition: "border-color 0.2s, box-shadow 0.2s",
        "&:hover": {
          borderColor: brand.primary,
          boxShadow: "0 6px 20px rgba(22,26,35,0.08)",
        },
      }}
    >
      <Box
        sx={{
          m: 1,
          aspectRatio: { xs: "16 / 9", sm: "2 / 1" },
          borderRadius: `${brand.radius - 4}px`,
          overflow: "hidden",
          backgroundColor: brand.bg,
        }}
      >
        {item.image && (
          <img
            src={item.image.replace("http://", "https://")}
            alt={item.name}
            loading="lazy"
            decoding="async"
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        )}
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2, px: 2, pt: 0.5, pb: 2 }}>
        <Box sx={{ minWidth: 0, display: "flex", flexDirection: "column", gap: 0.5 }}>
          <Typography noWrap sx={{ fontSize: 20, fontWeight: 700, color: brand.ink }}>
            {item.name}
          </Typography>

          {item.note && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: brand.muted }}>
              <LocationOn sx={{ fontSize: 16 }} />
              <Typography noWrap sx={{ fontSize: 14 }}>{item.note}</Typography>
            </Box>
          )}

          {item.type && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: brand.muted }}>
              <Fastfood sx={{ fontSize: 16, color: brand.primary }} />
              <Typography noWrap sx={{ fontSize: 14 }}>{item.type}</Typography>
            </Box>
          )}
        </Box>

        <Button
          variant="contained"
          disableElevation
          onClick={handleClick}
          disabled={loading}
          sx={{
            flexShrink: 0,
            minWidth: 116,
            px: 2.5,
            py: 1,
            borderRadius: 999,
            fontSize: 15,
            fontWeight: 600,
            textTransform: "none",
            backgroundColor: brand.primary,
            "&:hover": { backgroundColor: brand.primaryDark },
            "&.Mui-disabled": { backgroundColor: brand.line, color: brand.muted },
          }}
        >
          {loading ? <CircularProgress size={20} color="inherit" /> : "View menu"}
        </Button>
      </Box>
    </Card>
  );
});

export default RestaurantItem;
