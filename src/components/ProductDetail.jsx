import { lazy, Suspense, useCallback, useEffect, useState } from "react";
import { Box, Button, Divider, Paper, Skeleton, Stack, Typography } from "@mui/material";
import { ExpandLess, ExpandMore, LocationOn, ShoppingCartOutlined, Star } from "@mui/icons-material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import { useParams } from "react-router-dom";
import api from "../api";
import { Header } from "./HomePage";
import HoverRating from "./RatingButton";
import { useCart } from "./CartFunc";
import AmountControl from "./AmountControl";
import { brand } from "./brand";

// The cart drawer is only needed after the person opens it
const MyCart = lazy(() => import("./MyCart"));

const MAX_DESCRIPTION_CHARS = 300;
const SWIPER_AUTOPLAY_DELAY = 5000;
const SERVICE_FEE = 10; // flat fee, same value as before
const DEFAULT_IMAGE = "/default-image.jpg";
const BACKEND_HOST = import.meta.env.VITE_BACKEND_HOST || "";

const cardSx = {
  boxSizing: "border-box",
  backgroundColor: brand.card,
  border: `1px solid ${brand.line}`,
  borderRadius: `${brand.radius}px`,
};

const money = (value) => `${Number(value || 0).toFixed(2)} ETB`;

// Relative paths get the backend host; full URLs are used as they are
const imageUrl = (path) => {
  if (!path) return DEFAULT_IMAGE;
  return /^https?:\/\//i.test(path) ? path : `${BACKEND_HOST}${path}`;
};

const handleImageError = (e) => {
  e.currentTarget.onerror = null; // avoid an endless loop if the fallback is missing too
  e.currentTarget.src = DEFAULT_IMAGE;
};

/* ------------------------------ Small pieces ------------------------------ */

function ProductDescription({ text, maxChars = MAX_DESCRIPTION_CHARS }) {
  const [expanded, setExpanded] = useState(false);
  const canExpand = text?.length > maxChars;
  const shown = canExpand && !expanded ? `${text.substring(0, maxChars)}…` : text || "No description available";

  return (
    <Box>
      <Typography sx={{ fontSize: { xs: 14.5, md: 15.5 }, lineHeight: 1.65, color: brand.muted }}>
        {shown}
      </Typography>
      {canExpand && (
        <Button
          size="small"
          onClick={() => setExpanded((v) => !v)}
          startIcon={expanded ? <ExpandLess /> : <ExpandMore />}
          sx={{ mt: 0.5, px: 0, textTransform: "none", fontWeight: 600, color: brand.primaryDark }}
        >
          {expanded ? "Show less" : "Read more"}
        </Button>
      )}
    </Box>
  );
}

function Slide({ src, alt, eager }) {
  return (
    <img
      src={imageUrl(src)}
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      onError={handleImageError}
      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
    />
  );
}

function ProductGallery({ images, productName }) {
  const frameSx = {
    boxSizing: "border-box",
    width: "100%",
    aspectRatio: "4 / 3",
    borderRadius: `${brand.radius}px`,
    overflow: "hidden",
    backgroundColor: brand.bg,
  };

  if (!images?.length) {
    return (
      <Box sx={{ ...frameSx, display: "grid", placeItems: "center" }}>
        <Typography sx={{ color: brand.muted }}>No images available</Typography>
      </Box>
    );
  }

  if (images.length === 1) {
    return (
      <Box sx={frameSx}>
        <Slide src={images[0]?.image} alt={productName} eager />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        ...frameSx,
        "& .swiper": { width: "100%", height: "100%" },
        "& .swiper-pagination-bullet": { width: 8, height: 8, backgroundColor: "#fff", opacity: 0.7 },
        "& .swiper-pagination-bullet-active": { backgroundColor: brand.primary, opacity: 1 },
      }}
    >
      <Swiper
        modules={[Autoplay, Pagination]}
        pagination={{ clickable: true }}
        autoplay={{ delay: SWIPER_AUTOPLAY_DELAY, disableOnInteraction: false, pauseOnMouseEnter: true }}
        loop
        speed={500}
        grabCursor
      >
        {images.map((image, index) => (
          <SwiperSlide key={image.id ?? index}>
            <Slide
              src={image?.image}
              alt={image.alt || `${productName} – image ${index + 1}`}
              eager={index === 0}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
}

function RatingDisplay({ rating }) {
  const value = Number(rating) || 0;
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
      <Stack direction="row" spacing={0.1}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star key={star} sx={{ fontSize: 19, color: star <= Math.round(value) ? "#F5A623" : brand.line }} />
        ))}
      </Stack>
      <Typography sx={{ fontSize: 15, fontWeight: 700, color: brand.ink }}>{value.toFixed(1)}</Typography>
    </Box>
  );
}

function PriceRow({ label, value, strong }) {
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
      <Typography sx={{ color: strong ? brand.ink : brand.muted, fontWeight: strong ? 700 : 400 }}>{label}</Typography>
      <Typography sx={{ color: brand.ink, fontWeight: strong ? 800 : 500, fontSize: strong ? 20 : 16 }}>
        {value}
      </Typography>
    </Box>
  );
}

const pageSx = { minHeight: "100dvh", display: "flex", flexDirection: "column", backgroundColor: brand.bg };
const mainSx = {
  boxSizing: "border-box",
  flex: 1,
  width: "100%",
  maxWidth: 1000,
  mx: "auto",
  px: { xs: 2, sm: 3 },
  pt: { xs: 11, md: 12 },
  pb: 3,
};

function DetailSkeleton() {
  return (
    <Box sx={pageSx}>
      <Header />
      <Box
        component="main"
        sx={{ ...mainSx, display: "grid", gap: 3, gridTemplateColumns: { xs: "1fr", md: "1.1fr 1fr" }, alignContent: "start" }}
      >
        <Skeleton variant="rounded" sx={{ width: "100%", aspectRatio: "4 / 3", height: "auto" }} />
        <Box>
          <Skeleton variant="text" sx={{ width: "70%", fontSize: 32 }} />
          <Skeleton variant="text" sx={{ width: "45%", fontSize: 18 }} />
          <Skeleton variant="rounded" height={170} sx={{ mt: 3 }} />
        </Box>
      </Box>
    </Box>
  );
}

/* ------------------------------ Product page ------------------------------ */

function ProductDetail() {
  const { product_slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [openCart, setOpenCart] = useState(false);
  const [cartLoaded, setCartLoaded] = useState(false);
  const [cartStep, setCartStep] = useState(1);
  const { addToCart, isItemInCart } = useCart();

  useEffect(() => {
    let cancelled = false; // ignore late responses after leaving the page or changing product
    setLoading(true);
    setError(null);

    api
      .get(`product-detail/${product_slug}`)
      .then((res) => !cancelled && setProduct(res.data))
      .catch((err) => {
        console.error("Error fetching product:", err);
        if (!cancelled) setError("Couldn’t load this product. Check your connection and try again.");
      })
      .finally(() => !cancelled && setLoading(false));

    return () => {
      cancelled = true;
    };
  }, [product_slug, reloadKey]);

  const inCart = product ? isItemInCart(product.id) : false;

  const handleAddToCart = useCallback(() => addToCart(product), [addToCart, product]);

  const handleOrderNow = useCallback(() => {
    if (!inCart) addToCart(product); // don't add a second copy if it's already in the cart
    setCartLoaded(true);
    setOpenCart(true);
  }, [addToCart, inCart, product]);

  const handleCloseCart = useCallback(() => {
    setOpenCart(false);
    setCartStep(1);
  }, []);

  if (loading) return <DetailSkeleton />;

  if (error || !product) {
    return (
      <Box sx={{ ...pageSx, alignItems: "center", justifyContent: "center", p: 3 }}>
        <Header />
        <Paper elevation={0} sx={{ ...cardSx, p: 4, textAlign: "center", maxWidth: 400 }}>
          <Typography sx={{ fontSize: 18, fontWeight: 700, color: brand.ink }}>
            {error || "Product not found"}
          </Typography>
          <Stack direction="row" spacing={1.5} justifyContent="center" sx={{ mt: 3 }}>
            <Button variant="outlined" onClick={() => window.history.back()} sx={{ borderRadius: 999, textTransform: "none", color: brand.ink, borderColor: brand.line }}>
              Go back
            </Button>
            <Button
              variant="contained"
              disableElevation
              onClick={() => setReloadKey((k) => k + 1)}
              sx={{ borderRadius: 999, textTransform: "none", backgroundColor: brand.primary, "&:hover": { backgroundColor: brand.primaryDark } }}
            >
              Try again
            </Button>
          </Stack>
        </Paper>
      </Box>
    );
  }

  const { images = [], name = "Product", location, rate = 0, description = "" } = product;
  // API decimals can arrive as strings, so convert before doing math
  const price = Number(product.price) || 0;
  const deliveryFee = Number(product.delivery_fee) || 0;
  const total = price + deliveryFee + SERVICE_FEE;

  return (
    <Box sx={pageSx}>
      <Header />

      {cartLoaded && (
        <Suspense fallback={null}>
          <MyCart product={product} step={cartStep} setStep={setCartStep} open={openCart} handleClose={handleCloseCart} />
        </Suspense>
      )}

      <Box
        component="main"
        sx={{ ...mainSx, display: "grid", gap: { xs: 2.5, md: 4 }, gridTemplateColumns: { xs: "1fr", md: "1.1fr 1fr" }, alignContent: "start" }}
      >
        <Box sx={{ minWidth: 0, alignSelf: "start", position: { md: "sticky" }, top: { md: 88 } }}>
          <ProductGallery images={images} productName={name} />
        </Box>

        <Box sx={{ minWidth: 0 }}>
          <Typography component="h1" sx={{ fontSize: { xs: 26, sm: 30 }, fontWeight: 800, letterSpacing: "-0.4px", color: brand.ink }}>
            {name}
          </Typography>

          <Box sx={{ mt: 1, display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
            <RatingDisplay rating={rate} />
            {location && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: brand.muted }}>
                <LocationOn sx={{ fontSize: 19, color: brand.primary }} />
                <Typography sx={{ fontSize: 14 }}>{location}</Typography>
              </Box>
            )}
          </Box>

          <Paper elevation={0} sx={{ ...cardSx, mt: 3, p: 2.5 }}>
            <Typography sx={{ mb: 1.5, fontWeight: 700, color: brand.ink }}>Price details</Typography>
            <Stack spacing={1.25}>
              <PriceRow label="Subtotal" value={money(price)} />
              <PriceRow label="Delivery fee" value={money(deliveryFee)} />
              <PriceRow label="Service fee" value={money(SERVICE_FEE)} />
              <Divider />
              <PriceRow strong label="Total" value={money(total)} />
            </Stack>
          </Paper>

          <Box sx={{ mt: 3 }}>
            <Typography sx={{ mb: 1, fontWeight: 700, color: brand.ink }}>About this product</Typography>
            <ProductDescription text={description} />
          </Box>

          <Box sx={{ mt: 3 }}>
            <Typography sx={{ mb: 1, fontWeight: 700, color: brand.ink }}>Rate this product</Typography>
            <HoverRating />
          </Box>
        </Box>
      </Box>

      {/* Actions stay in reach while scrolling */}
      <Box
        sx={{
          boxSizing: "border-box",
          position: "sticky",
          bottom: 0,
          zIndex: 10,
          px: 2,
          pt: 1.5,
          pb: "calc(12px + env(safe-area-inset-bottom))",
          backgroundColor: "rgba(255,255,255,0.94)",
          backdropFilter: "saturate(180%) blur(12px)",
          borderTop: `1px solid ${brand.line}`,
        }}
      >
        <Box sx={{ maxWidth: 1000, mx: "auto", display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box sx={{ flex: 1, display: "flex", justifyContent: "center" }}>
            {inCart ? (
              <AmountControl item={product} />
            ) : (
              <Button
                fullWidth
                onClick={handleAddToCart}
                startIcon={<ShoppingCartOutlined />}
                sx={{
                  py: 1.25,
                  borderRadius: 999,
                  fontWeight: 700,
                  textTransform: "none",
                  color: brand.primaryDark,
                  border: `1.5px solid ${brand.primary}`,
                  "&:hover": { backgroundColor: brand.tint },
                }}
              >
                Add to cart
              </Button>
            )}
          </Box>

          <Button
            variant="contained"
            disableElevation
            onClick={handleOrderNow}
            sx={{
              flex: 1,
              py: 1.25,
              borderRadius: 999,
              fontWeight: 700,
              textTransform: "none",
              backgroundColor: brand.primary,
              "&:hover": { backgroundColor: brand.primaryDark },
            }}
          >
            Order now
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default ProductDetail;
