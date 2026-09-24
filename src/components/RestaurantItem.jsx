import { Fastfood, LocationOn } from "@mui/icons-material";
import { Box, Button, Card, CardContent, Typography, CircularProgress } from "@mui/material";
import { useContext, useState } from "react";
import { SubCategoryChangeContext } from "./HomePage";


function RestaurantItem({ item, addItem }) {
  const handleSubCategory = useContext(SubCategoryChangeContext);
  const [loading, setLoading] = useState(false);
  console.log(item.image)
  const handleClick = async (item_id, label) => {
    if (loading) return; 
    setLoading(true);

    try {
      await handleSubCategory(item_id); 
      await addItem(item_id, label);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card sx={{ maxWidth: 400, width: "100%", borderRadius: 2, boxShadow: 1, border: '1px solid #e0e0e0', position: "relative", "&:hover": { boxShadow: 3, borderColor: "primary.light" } }}>
      <CardContent sx={{ p: 1.5 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Box sx={{ width: { xs: "95%", md: "90%" }, height: { xs: 180, sm: 200 }, borderRadius: 2, overflow: "hidden", alignSelf: "center", backgroundColor: "#f5f5f5", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <img style={{ width: "100%", height: "100%", objectFit: "cover" }} src={item.image?.replace("http://", "https://")} alt={item.name} />
          </Box>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
              <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 0.5 }}>
                <Typography sx={{ fontWeight: 600, fontSize: 25, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.name}</Typography>
                {item.note && <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}><LocationOn sx={{ fontSize: 16, color: "GrayText" }} /><Typography sx={{ fontSize: 15, color: "GrayText" }}>{item.note}</Typography></Box>}
                {item.type && <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}><Fastfood sx={{ fontSize: 16, color: "#FF6600" }} /><Typography sx={{ fontSize: 15, color: "GrayText" }}>{item.type}</Typography></Box>}
              </Box>

              <Button
                size="medium"
                variant="contained"
                onClick={() => handleClick(item.id, item.name)}
                disabled={loading}
                sx={{
                  "&:disabled": { background: "#e0e0e0", color: "#9e9e9e", boxShadow: "none" },
                  textTransform: "capitalize",
                  borderRadius: 10,
                  fontWeight: 550,
                  px: 2,
                  py: 1,
                  fontSize: 16,
                  position: "absolute",
                  bottom: 12,
                  right: 12,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1
                }}
              >
                {loading && <CircularProgress size={20} color="inherit" />}
                {!loading && "View Menu"}
              </Button>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default RestaurantItem;
