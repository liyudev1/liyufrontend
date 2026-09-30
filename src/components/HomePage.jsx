import React, {
  createContext,
  lazy,
  memo,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  AppBar,
  Badge,
  Box,
  Button,
  IconButton,
  Skeleton,
  Toolbar,
  Typography,
} from "@mui/material";
import {
  ArrowBack,
  DeliveryDining,
  LocalDining,
  LocalPizza,
  ShoppingCartOutlined,
  WaterDrop,
} from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api";
import { useCart } from "./CartFunc";
import CustomizedBreadcrumbs from "./CategoryNavigation";
import useListReducer from "./CategoryNavigationReducer";
import TopNav from "./TopNav";
import BottomNav from "./BottomNav";
import SearchComponent from "./SearchBar";
import { brand } from "./brand";

// Lazy load heavier UI pieces
const ProductItem = lazy(() => import("./ProductItem"));
const RestaurantItem = lazy(() => import("./RestaurantItem"));
const MyCart = lazy(() => import("./MyCart"));

const PAGE_SIZE = 24; // items rendered at first and per "Show more"
const PRODUCTS_CACHE_KEY = "liyu_products_cache_v1";
const CATEGORIES_CACHE_KEY = "liyu_categories_cache_v1";

const TAB_ICONS = {
  Food: <LocalDining fontSize="small" />,
  "Water jar": <WaterDrop fontSize="small" />,
  "Burger&pizza": <LocalPizza fontSize="small" />,
};

const GRID_SX = {
  display: "grid",
  gridTemplateColumns: {
    xs: "repeat(2, minmax(0, 1fr))",
    sm: "repeat(auto-fill, minmax(200px, 1fr))",
  },
  gap: { xs: 1.5, sm: 2.5 },
};

function readCache(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeCache(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage full or unavailable - ignore
  }
}

function capitalize(str = "") {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export const SubCategoryChangeContext = createContext(async () => {
  console.warn("SubCategoryChangeContext used without Provider");
  return false;
});

/* ---------------------------------- Logo --------------------------------- */

export function DeliveryLogo() {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Box
        sx={{
          width: 38,
          height: 38,
          borderRadius: "12px",
          backgroundColor: brand.primary,
          color: "#fff",
          display: "grid",
          placeItems: "center",
        }}
      >
        <DeliveryDining sx={{ fontSize: 26, transform: "scaleX(-1)" }} />
      </Box>
      <Typography
        sx={{
          display: { xs: "none", sm: "block" },
          fontWeight: 800,
          fontSize: "1.2rem",
          letterSpacing: "-0.3px",
          color: brand.ink,
        }}
      >
        Liyu Delivery
      </Typography>
    </Box>
  );
}

/* -------------------------------- Skeletons ------------------------------ */

function CardSkeletons({ count = 6 }) {
  return Array.from({ length: count }).map((_, i) => (
    <Box
      key={i}
      sx={{
        p: 1,
        borderRadius: `${brand.radius}px`,
        backgroundColor: brand.card,
        border: `1px solid ${brand.line}`,
      }}
    >
      <Skeleton variant="rounded" sx={{ width: "100%", aspectRatio: "4 / 3", height: "auto" }} />
      <Skeleton variant="text" sx={{ mt: 1, width: "85%", fontSize: 16 }} />
      <Skeleton variant="text" sx={{ width: "55%", fontSize: 14 }} />
    </Box>
  ));
}

function TabSkeleton() {
  return (
    <Box sx={{ display: "flex", gap: 1.5 }}>
      {[0, 1, 2, 3].map((i) => (
        <Skeleton key={i} variant="rounded" width={96} height={40} sx={{ borderRadius: 999 }} />
      ))}
    </Box>
  );
}

/* --------------------------------- Header -------------------------------- */

export function Header() {
  const [step, setStep] = useState(0);
  const [open, setOpen] = useState(false);
  const [cartLoaded, setCartLoaded] = useState(false); // load the cart chunk on first open only
  const { getCartItemsCount } = useCart();
  const cartItemsCount = getCartItemsCount();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleClose = useCallback(() => {
    setOpen(false);
    setStep(0);
  }, []);

  const handleOpenCart = useCallback(() => {
    setCartLoaded(true);
    setOpen(true);
  }, []);

  const handleGoBack = useCallback(() => {
    if (window.history.state && window.history.state.idx > 0) navigate(-1);
    else navigate("/");
  }, [navigate]);

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        backgroundColor: "rgba(255,255,255,0.88)",
        backdropFilter: "saturate(180%) blur(12px)",
        borderBottom: `1px solid ${brand.line}`,
        color: brand.ink,
      }}
    >
      <Toolbar sx={{ height: 64, gap: 1.5, maxWidth: 1200, width: "100%", mx: "auto" }}>
        {pathname !== "/" && (
          <IconButton onClick={handleGoBack} aria-label="Go back" edge="start">
            <ArrowBack sx={{ color: brand.ink }} />
          </IconButton>
        )}

        <DeliveryLogo />

        <Box sx={{ flex: 1, display: "flex", justifyContent: "center" }}>
          <TopNav />
        </Box>

        <IconButton onClick={handleOpenCart} aria-label="Open cart" edge="end">
          <Badge
            badgeContent={cartItemsCount}
            max={99}
            sx={{
              "& .MuiBadge-badge": { backgroundColor: brand.primary, color: "#fff", fontWeight: 700 },
            }}
          >
            <ShoppingCartOutlined sx={{ fontSize: 28, color: brand.ink }} />
          </Badge>
        </IconButton>

        {cartLoaded && (
          <Suspense fallback={null}>
            <MyCart product={null} step={step} setStep={setStep} open={open} handleClose={handleClose} />
          </Suspense>
        )}
      </Toolbar>
    </AppBar>
  );
}

/* ---------------------------------- Tabs --------------------------------- */

export const Tabs = memo(function Tabs({
  clearList,
  setIsSub,
  setCategory,
  category,
  loading,
  tabList,
  setSubItemList,
}) {
  const handleTabChange = useCallback(
    (categoryName) => {
      // keep the original letter-case strategy of the category state
      const next =
        category === category.toUpperCase() ? categoryName.toUpperCase() : categoryName.toLowerCase();
      setCategory(next);
      setIsSub(false);
      clearList();
      setSubItemList([]);
    },
    [category, clearList, setCategory, setIsSub, setSubItemList]
  );

  useEffect(() => {
    setIsSub(false);
  }, [category, setIsSub]);

  const activeName = capitalize(category);

  return (
    <Box
      role="tablist"
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        overflowX: "auto",
        py: 0.5,
        mb: 2,
        "&::-webkit-scrollbar": { display: "none" },
        scrollbarWidth: "none",
      }}
    >
      {loading ? (
        <TabSkeleton />
      ) : (
        tabList.map((item) => {
          if (item.is_sub_category) return null;
          const isActive = activeName === item.name;
          return (
            <Button
              key={item.id ?? item.name}
              role="tab"
              aria-selected={isActive}
              onClick={() => handleTabChange(item.name)}
              startIcon={TAB_ICONS[item.name] || null}
              disableElevation
              sx={{
                flexShrink: 0,
                px: 2.25,
                py: 0.9,
                borderRadius: 999,
                fontSize: 15,
                fontWeight: 600,
                textTransform: "capitalize",
                whiteSpace: "nowrap",
                border: `1px solid ${isActive ? brand.primary : brand.line}`,
                color: isActive ? "#fff" : brand.ink,
                backgroundColor: isActive ? brand.primary : brand.card,
                transition: "background-color 0.2s, border-color 0.2s",
                "&:hover": {
                  backgroundColor: isActive ? brand.primaryDark : brand.tint,
                  borderColor: brand.primary,
                },
              }}
            >
              {item.name}
            </Button>
          );
        })
      )}
    </Box>
  );
});

/* -------------------------------- HomePage ------------------------------- */

export default function HomePage() {
  const { addItem, removeItemsAfter, clearList, getAllItems } = useListReducer();

  const [isSub, setIsSub] = useState(false);
  const [category, setCategory] = useState("FOOD");
  const [tabList, setTabList] = useState([]);
  const [products, setProducts] = useState([]);
  const [subItemList, setSubItemList] = useState([]);
  const [loading, setLoading] = useState(true); // categories / tabs
  const [productsLoading, setProductsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [searchQuery, setSearchQuery] = useState("");

  const mountedRef = useRef(true);
  const subCacheRef = useRef({}); // ref, so caching never re-creates the handler below

  // Stable context handler. Resolves to true on success, false on failure.
  const handleSubCategory = useCallback(async (itemId) => {
    const cached = subCacheRef.current[itemId];
    if (cached) {
      setSubItemList(cached);
      setIsSub(true);
      return true;
    }
    try {
      const [resultProducts, resultCategories] = await Promise.all([
        api.get(`sub-products/?category_id=${itemId}`),
        api.get(`sub-categorys/?category_id=${itemId}`),
      ]);
      const subCategories = resultCategories.data.filter((i) => i.is_sub_category);
      const combined = [...resultProducts.data].reverse().concat(subCategories);
      subCacheRef.current[itemId] = combined;
      setSubItemList(combined);
      setIsSub(true);
      return true;
    } catch {
      return false;
    }
  }, []);

  // Categories and products load independently so tabs never wait for the big product list.
  const loadData = useCallback(() => {
    setLoadError(false);

    api
      .get("list-category/")
      .then((res) => {
        if (!mountedRef.current) return;
        setTabList(res.data);
        writeCache(CATEGORIES_CACHE_KEY, res.data);
      })
      .catch(() => {})
      .finally(() => mountedRef.current && setLoading(false));

    api
      .get("list-product/")
      .then((res) => {
        if (!mountedRef.current) return;
        const list = [...res.data].reverse();
        setProducts(list);
        writeCache(PRODUCTS_CACHE_KEY, list);
      })
      .catch(() => mountedRef.current && setLoadError(true))
      .finally(() => mountedRef.current && setProductsLoading(false));
  }, []);

  useEffect(() => {
    mountedRef.current = true;

    // Show cached data instantly, then refresh from the server.
    const cachedCategories = readCache(CATEGORIES_CACHE_KEY);
    if (cachedCategories) {
      setTabList(cachedCategories);
      setLoading(false);
    }
    const cachedProducts = readCache(PRODUCTS_CACHE_KEY);
    if (cachedProducts) {
      setProducts(cachedProducts);
      setProductsLoading(false);
    }

    loadData();
    return () => {
      mountedRef.current = false;
    };
  }, [loadData]);

  const handleRetry = useCallback(() => {
    setProductsLoading(true);
    loadData();
  }, [loadData]);

  const itemList = useMemo(
    () => [...products, ...tabList.filter((item) => item.is_sub_category)],
    [products, tabList]
  );

  const dataSource = isSub ? subItemList : itemList;

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [category, isSub, searchQuery]);

  const filteredItems = useMemo(() => {
    if (!dataSource.length) return [];

    const q = searchQuery.trim().toLowerCase();
    const cat = capitalize(category);

    return dataSource.filter((item) => {
      if (q && (!item.name || !item.name.toLowerCase().includes(q))) return false;

      // Sub-category view is already filtered at the source
      if (isSub) return true;

      if (item.category?.name) return item.category.name === cat;
      if (item.category) return item.category === cat;
      if (item.name) return item.name === cat;
      return false;
    });
  }, [dataSource, searchQuery, isSub, category]);

  const visibleItems = useMemo(
    () => filteredItems.slice(0, visibleCount),
    [filteredItems, visibleCount]
  );

  const showMore = useCallback(() => setVisibleCount((c) => c + PAGE_SIZE), []);

  const showSkeleton = productsLoading && !isSub && filteredItems.length === 0;
  const showLoadError = loadError && !isSub && products.length === 0;

  return (
    <Box
      sx={{
        height: "100dvh",
        width: "100%",
        backgroundColor: brand.bg,
        overflowY: "auto",
        overflowX: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Header />

      <Box
        component="main"
        sx={{
          flex: 1,
          width: "100%",
          maxWidth: 1200,
          mx: "auto",
          px: { xs: 2, sm: 3 },
          pt: { xs: 11, sm: 12 },
          pb: 12, // room for the bottom navigation
        }}
      >
        <Typography
          component="h1"
          sx={{
            mb: 2,
            fontSize: { xs: 26, sm: 32 },
            fontWeight: 800,
            letterSpacing: "-0.5px",
            color: brand.ink,
          }}
        >
          What can we deliver today?
        </Typography>

        <Box sx={{ mb: 3 }}>
          <SearchComponent onSearchChange={setSearchQuery} />
        </Box>

        <SubCategoryChangeContext.Provider value={handleSubCategory}>
          <Tabs
            clearList={clearList}
            setIsSub={setIsSub}
            setCategory={setCategory}
            category={category}
            loading={loading}
            tabList={tabList}
            setSubItemList={setSubItemList}
          />

          <CustomizedBreadcrumbs
            setCategory={setCategory}
            category={category}
            clearList={clearList}
            getAllItems={getAllItems}
            removeItemsAfter={removeItemsAfter}
          />

          {searchQuery && (
            <Typography sx={{ mb: 2, color: brand.muted }}>
              {filteredItems.length > 0
                ? `${filteredItems.length} result${filteredItems.length === 1 ? "" : "s"} for “${searchQuery}”`
                : `No results for “${searchQuery}”`}
            </Typography>
          )}

          {showSkeleton ? (
            <Box sx={GRID_SX}>
              <CardSkeletons />
            </Box>
          ) : showLoadError ? (
            <Box sx={{ py: 8, textAlign: "center" }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: brand.ink }}>
                Couldn’t load the menu
              </Typography>
              <Typography sx={{ mt: 0.5, mb: 2, color: brand.muted }}>
                Check your connection and try again.
              </Typography>
              <Button
                variant="contained"
                disableElevation
                onClick={handleRetry}
                sx={{
                  borderRadius: 999,
                  px: 3,
                  textTransform: "none",
                  fontWeight: 600,
                  backgroundColor: brand.primary,
                  "&:hover": { backgroundColor: brand.primaryDark },
                }}
              >
                Try again
              </Button>
            </Box>
          ) : filteredItems.length === 0 ? (
            <Box sx={{ py: 8, textAlign: "center" }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: brand.ink }}>
                {searchQuery ? "Nothing matches your search" : "Nothing here yet"}
              </Typography>
              <Typography sx={{ mt: 0.5, color: brand.muted }}>
                {searchQuery ? "Try a different word or clear the search." : "Try another category."}
              </Typography>
            </Box>
          ) : (
            <Box sx={GRID_SX}>
              <Suspense fallback={<CardSkeletons />}>
                {visibleItems.map((item) =>
                  item.is_sub_category ? (
                    <RestaurantItem key={`r-${item.id ?? item.name}`} addItem={addItem} item={item} />
                  ) : (
                    <ProductItem key={`p-${item.id ?? item.name}`} item={item} />
                  )
                )}
              </Suspense>

              {visibleCount < filteredItems.length && (
                <Box sx={{ gridColumn: "1 / -1", display: "flex", justifyContent: "center", pt: 1 }}>
                  <Button
                    variant="outlined"
                    onClick={showMore}
                    sx={{
                      borderRadius: 999,
                      px: 4,
                      textTransform: "none",
                      fontWeight: 600,
                      color: brand.ink,
                      borderColor: brand.line,
                      backgroundColor: brand.card,
                      "&:hover": { borderColor: brand.primary, backgroundColor: brand.tint },
                    }}
                  >
                    Show more
                  </Button>
                </Box>
              )}
            </Box>
          )}
        </SubCategoryChangeContext.Provider>
      </Box>

      <BottomNav />
    </Box>
  );
}
