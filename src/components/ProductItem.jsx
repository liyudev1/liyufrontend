import { ShoppingCartOutlined, Star } from "@mui/icons-material";
import { Box, Button, Typography, Card, CardContent, CardMedia } from "@mui/material";
import AmountControl from "./AmountControl";
import { useCart } from "./CartFunc";
import { useNavigate } from "react-router-dom";


function ProductItem({item}) {
  const { addToCart ,isItemInCart} = useCart();
  const itemExists = isItemInCart(item.id);
  const navigate = useNavigate();
  const url = `product-detail/${item.slug}`
  
  function hanleProductDetail(){
    navigate(url)
  }


  function handleAddToCart(e, item) {
    e.stopPropagation();
    addToCart(item);
  }

  return (
    <Card 
      onClick={hanleProductDetail}
      sx={{
        backgroundColor: "#fff",
        borderRadius: 3,
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        transition: "all 0.3s ease-in-out",
        overflow: "hidden",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        width: { xs: "160px", sm: "180px", md: "220px", lg: "240px" },
        flex: "1 1 auto",
        minWidth: "160px",
        maxWidth: "280px",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
          cursor:"pointer"
        },
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 12,
          right: 12,
          backgroundColor: "rgba(255,255,255,0.9)",
          borderRadius: 2,
          px: 1,
          py: 0.5,
          display: "flex",
          alignItems: "center",
          gap: 0.5,
          backdropFilter: "blur(10px)",
          zIndex: 1,
        }}
      >
        <Star sx={{ color: "gold", fontSize: 18 }} />
        <Typography sx={{ fontSize: 14, fontWeight: 600 }}>{item.rate}</Typography>
      </Box>

      <Box sx={{ p: 2, pb: 1, flexShrink: 0 }}>
        <CardMedia
          component="img"
          sx={{
            width: "100%",
            height: { xs: 100, sm: 120, md: 140 },
            objectFit: "contain",
          }}
          image={item.images?.[0]?.image || '/default-image.jpg'}
          alt="Product image"
        />
      </Box>

      <CardContent sx={{ 
        p: 1.5, 
        pt: 1, 
        flexGrow: 1, 
        display: "flex", 
        flexDirection: "column",
        "&:last-child": { pb: 2 }
      }}>

        <Typography 
          sx={{ 
            fontSize: { xs: 16, sm: 17, md: 18 }, 
            fontWeight: 700,
            lineHeight: 1.2,
            minHeight: { xs: "28px", sm: "32px" }
          }}
        >
          {item.name}
        </Typography>

        <Typography 
          sx={{ 
            fontSize: { xs: 13, sm: 14, md: 15 },
            color: "text.secondary",
            mb: 1
          }}
        >
          {item.location}
        </Typography>

        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: "center", 
            justifyContent: "space-between",
            mt: "auto",
            gap: 1
          }}
        >
          <Typography 
            sx={{ 
              fontSize: { xs: 16, sm: 17, md: 18 }, 
              fontWeight: 800,
              color: "primary.main",
              flexShrink: 0
            }}
          >
            {item.price} ETB
          </Typography>
          {itemExists ? (
            <div onClick={(e) => e.stopPropagation()}>
              <AmountControl item={item} IconSize={"18px"}/>
            </div>
          ) : (
            <Button 
              endIcon={<ShoppingCartOutlined sx={{ fontSize: 18 }} />} 
              variant="contained" 
              onClick={(e) => handleAddToCart(e, item)}
              sx={{
                textTransform: "capitalize",
                borderRadius: 2,
                px: { xs: 1.5, sm: 2 },
                fontWeight: 600,
                minWidth: "auto",
                fontSize: { xs: 12, sm: 13 }
              }}
            >
              Add
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}



export default ProductItem;