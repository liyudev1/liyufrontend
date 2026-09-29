import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  lazy,
  Suspense,
  useRef
} from "react";
import { Badge, Box, Button, IconButton, AppBar, Toolbar, Typography, Stack, Skeleton } from "@mui/material";
import { ArrowBack, DeliveryDining, LocalDining, LocalPizza, ShoppingCartOutlined, WaterDrop } from "@mui/icons-material";
import SearchIcon from '@mui/icons-material/Search';
import { styled, alpha } from '@mui/material/styles';
import api from '../api';
import { useCart } from "./CartFunc";
import { useLocation, useNavigate } from "react-router-dom";
import CustomizedBreadcrumbs from "./CategoryNavigation";
import useListReducer from "./CategoryNavigationReducer";
import TopNav from "./TopNav";
import BottomNav from "./BottomNav";

// Lazy load heavier UI pieces
const ProductItem = lazy(() => import("./ProductItem"));
const RestaurantItem = lazy(() => import("./RestaurantItem"));
const MyCart = lazy(() => import("./MyCart"));

const PAGE_SIZE = 24; // how many items to render at first / per "Show more"
const PRODUCTS_CACHE_KEY = "liyu_products_cache_v1";
const CATEGORIES_CACHE_KEY = "liyu_categories_cache_v1";

function readCache(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

function writeCache(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    // storage full or unavailable - ignore
  }
}


const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: '25px',
  backgroundColor: "#F0F4FA",
  '&:hover': { backgroundColor: alpha(theme.palette.common.white, 0.75) },
  marginLeft: 0,
  width: '100%',
  maxWidth: 600,
  overflowX: "auto",
  '&::-webkit-scrollbar': { display: 'none' },
  scrollbarWidth: 'none',
  [theme.breakpoints.up('sm')]: { marginLeft: theme.spacing(1), width: 'auto' },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 2,
}));

const StyledInputBase = styled('input')(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  position: 'relative',
  backgroundColor: 'transparent',
  border: 'none',
  outline: 'none',
  padding: '16px',
  paddingLeft: '60px',
  fontSize: '20px',
  zIndex: 1,
}));

const PlaceholderWrapper = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '60px',
  transform: 'translateY(-50%)',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  zIndex: 0,
  overflowX: "auto",
}));

const GlassAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(10px)',
  borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
  boxShadow: 'none',
  height: "65px",
}));


function capitalize(str = "") {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}


export const SubCategoryChangeContext = createContext(() => {
  console.warn('SubCategoryChangeContext used without Provider');
});

export function DeliveryLogo(){
  return (
<Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
  <Box sx={{
    position: "relative",
    animation: "pulse 2s infinite",
    '&::after': {
      content: '""',
      position: "absolute",
      top: "50%",
      right: "-4px",
      width: "15px",
      height: "2px",
      background: "#ff9800",
      transform: "translateY(-50%)"
    }
  }}>
    <DeliveryDining 
      color="warning" 
      sx={{
        width: 55,
        height: 55,
        transform: 'scaleX(-1)'
      }}
    />
  </Box>
  
  <Typography 
    sx={{
      color: "#000",
      fontWeight: 700,
      fontSize: "1.4rem",
      background: "linear-gradient(90deg, #000 0%, #ff9800 100%)",
      backgroundClip: "text",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      letterSpacing: "-0.3px"
    }}
  >
    Liyu Delivery
  </Typography>
</Box>
  )
}

function CategorySkeleton() {
  return (
    <Stack
      spacing={2}
      alignItems="self-start"
      sx={{ width: "100%", minWidth: 280, maxWidth: 400 }}
    >
      <Skeleton
        variant="rounded"
        animation="wave"
        sx={{ width: "100%", height: 200 }}
      />

      <Skeleton
        variant="text"
        animation="wave"
        sx={{ width: "90%", height: 30 }}
      />

      <Skeleton
        variant="text"
        animation="wave"
        sx={{ width: "60%", height: 28 }}
      />
    </Stack>
  );
}

function TabSkeleton(){
  return(
    <Stack direction={"row"} spacing={3}>
       <Skeleton animation="wave" variant="rounded" width={100} height={35}/>
       <Skeleton animation="wave" variant="rounded" width={100} height={35}/>
       <Skeleton animation="wave" variant="rounded" width={100} height={35}/>
       <Skeleton animation="wave" variant="rounded" width={100} height={35}/>
    </Stack>
  )
}


export function Header() {
  const [step, setStep] = useState(0);
  const [open, setOpen] = useState(false);
  const { getCartItemsCount } = useCart();
  const cartItemsCount = getCartItemsCount();
  const navigate = useNavigate();

  const handleClose = useCallback(() => {
    setOpen(false);
    setStep(0);
  }, []);
  
  const goBack = () => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  const handleOpenCart = useCallback(() => setOpen(true), []);
  const handleGoBack = useCallback(() => goBack(), [navigate]);

  return (
    <GlassAppBar position="fixed">
      <Toolbar sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 2,
        height: "100%",
        boxShadow: 1
      }}>
        <IconButton onClick={handleGoBack}>
          <ArrowBack sx={{ color: "#000", fontSize: 32 }} />
        </IconButton>

        <TopNav />
        <DeliveryLogo/>
        <IconButton onClick={handleOpenCart}>
          <Badge color="primary" badgeContent={cartItemsCount} max={99}>
            <ShoppingCartOutlined sx={{ fontSize: 32, color: "#000" }} />
          </Badge>
        </IconButton>

        <Suspense fallback={null}>
          <MyCart product={null} step={step} setStep={setStep} open={open} handleClose={handleClose} />
        </Suspense>
      </Toolbar>
    </GlassAppBar>
  );
}


function SearchComponent({ searchValue, onSearchChange }) {
  return (
    <Search sx={{ width: '100%', maxWidth: 600, backgroundColor: "#F0F4FA" }}>
      <SearchIconWrapper>
        <SearchIcon sx={{ fontSize: 44 }} />
      </SearchIconWrapper>

      <StyledInputBase
        value={searchValue}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder=" "
        inputProps={{ 'aria-label': 'search' }}
      />

      {!searchValue && (
        <PlaceholderWrapper>
          <Typography component="span" sx={{ fontSize: '20px', color: 'black', fontWeight: 550 }}>
            Search
          </Typography>
          <Typography component="span" sx={{ fontSize: '20px', color: 'gray' }}>
            Anything…
          </Typography>
        </PlaceholderWrapper>
      )}
    </Search>
  );
}


export function Tabs({ clearList, setIsSub, setCategory, category, loading, tabList,setSubItemList }) {
  // stable icon lookup (memoized by JS engine if defined outside render)
  const icons = {
    Food: <LocalDining />,
    "Water jar": <WaterDrop />,
    "Burger&pizza": <LocalPizza />
  };

  const handleTabChange = useCallback((category_name) => {
    // preserve lettercase strategy from original but keep it deterministic
    const c_n = category === category.toUpperCase() ? category_name.toUpperCase() : category_name.toLowerCase();
    setCategory(c_n);
    setIsSub(false);
    clearList();
    setSubItemList([])
  }, [category, clearList, setCategory, setIsSub]);

  useEffect(() => {
    setIsSub(false);
  }, [category, setIsSub]);

  return (
    <Box sx={{
      display: "flex",
      alignItems: "center",
      gap: 1,
      overflowX: "auto",
      mb: 3,
      p: 1,
      '&::-webkit-scrollbar': { display: 'none' },
      scrollbarWidth: 'none',
      color: "#fff"
    }}>
      {loading ? <TabSkeleton/> : tabList.map((item) => {
        if (item.is_sub_category) return null;
        const isActive = capitalize(category) === item.name;
        return (
          <Button
            key={item.id ?? item.name}
            onClick={() => handleTabChange(item.name)}
            startIcon={icons[item.name] || null}
            variant={isActive ? "contained" : "outlined"}
            sx={{
              borderRadius: '14px',
              fontSize: '1.1rem',
              textTransform: "capitalize",
              minWidth: 'auto',
              borderColor: 'grey.300',
              transition: 'all 0.3s ease',
              whiteSpace: 'nowrap',
              color: isActive ? '#fff' : '#000'
            }}
          >
            {item.name}
          </Button>
        );
      })}
    </Box>
  );
}


export default function HomePage() {
  const {
    addItem,
    removeItemsAfter,
    clearList,
    getAllItems
  } = useListReducer();

  const [isSub, setIsSub] = useState(false);
  const [category, setCategory] = useState("FOOD");
  const [tabList, setTabList] = useState([]);
  const [products, setProducts] = useState([]);
  const [subItemList, setSubItemList] = useState([])
  const [subCache, setSubCache] = useState({})
  const [loading, setLoading] = useState(true); // categories / tabs
  const [productsLoading, setProductsLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [searchQuery, setSearchQuery] = useState("");
  const [adminToken, setAdminToken] = useState();
  const searchTimeoutRef = useRef(null);

  // Stable context handler
  const handleSubCategory = useCallback(async (item_id) => {
    if (subCache[item_id]) {
      setSubItemList(subCache[item_id])
      setIsSub(true)
      return
    }
    try {
      const [result_p, result_c] = await Promise.all([
        api.get(`sub-products/?category_id=${item_id}`),
        api.get(`sub-categorys/?category_id=${item_id}`)
      ]);
      const sub_category = result_c.data.filter(i => i.is_sub_category);
      const combinedList = [...result_p.data.reverse(), ...sub_category];
      setSubCache(prev => ({ ...prev, [item_id]: combinedList }))
      setSubItemList(combinedList);
      setIsSub(true);
    } catch (error) {
      // fail silently, consider user-visible error in production
    }
  }, [subCache]);



  // Categories and products load independently so the tabs never wait for the big product list.
  // Cached data (if any) is shown instantly, then refreshed from the server.
  useEffect(() => {
    let mounted = true;

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

    api.get("list-category/")
      .then((res) => {
        if (!mounted) return;
        setTabList(res.data);
        writeCache(CATEGORIES_CACHE_KEY, res.data);
      })
      .catch(() => {})
      .finally(() => { if (mounted) setLoading(false); });

    api.get("list-product/")
      .then((res) => {
        if (!mounted) return;
        const list = [...res.data].reverse();
        setProducts(list);
        writeCache(PRODUCTS_CACHE_KEY, list);
      })
      .catch(() => {})
      .finally(() => { if (mounted) setProductsLoading(false); });

    return () => { mounted = false; };
  }, []); // run once

  const itemList = useMemo(
    () => [...products, ...tabList.filter((item) => item.is_sub_category)],
    [products, tabList]
  );

  // Debounced search handler (simple, no external lib)
  const onSearchChange = useCallback((next) => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    // debounce 250ms
    searchTimeoutRef.current = setTimeout(() => {
      setSearchQuery(next);
    }, 250);
  }, []);

  const dataSource = isSub ? subItemList : itemList;

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [category, isSub, searchQuery]);

  const filteredItems = useMemo(() => {
    if (!dataSource || dataSource.length === 0) return [];
  
    const q = searchQuery?.trim().toLowerCase();
  
    return dataSource.filter(item => {
      // Search filter
      if (q && (!item.name || !item.name.toLowerCase().includes(q))) {
        return false;
      }
  
      // Sub-category view already filtered at source
      if (isSub) return true;
  
      const cat = capitalize(category);
  
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

  // stable context value
  const subCategoryContextValue = useCallback((id) => handleSubCategory(id), [handleSubCategory]);

  return (
    <Box sx={{
      height: '100dvh',
      width: '100%',
      backgroundColor:'#F9F9F9',
      overflowY: 'auto',
      position: "relative",
      display: "flex",
      flexDirection: "column",
      overflowX: "hidden"
    }}>
      <Header />
      <Box sx={{ p: 2, mt: 15, display: 'flex', justifyContent: 'center' }}>
        <SearchComponent searchValue={searchQuery} onSearchChange={onSearchChange} />
      </Box>

      <SubCategoryChangeContext.Provider value={subCategoryContextValue}>
        <Box sx={{ flex: 1, p: 2, mb: 10 }}>
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
            <Box sx={{ mb: 2, px: 1 }}>
              <Typography variant="body1" color="text.secondary">
                {filteredItems.length > 0
                  ? `Found ${filteredItems.length} product(s) for "${searchQuery}"`
                  : `No products found for "${searchQuery}"`
                }
              </Typography>
            </Box>
          )}

          <Box sx={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: { xs: 2, sm: 3, md: 4, lg: 5 }
          }}>
            {productsLoading && !isSub ? (
              <Box sx={{ width: "100%", display: "flex", alignItems: "flex-start", flexDirection: "column", gap: 2 }}>
                <CategorySkeleton />
                <CategorySkeleton />
              </Box>
            ) : filteredItems.length === 0 ? (
              <Box sx={{ width: '100%', textAlign: 'center', py: 4, color: 'text.secondary' }}>
                <Typography variant="h6">
                  {searchQuery ? 'No products found' : 'No products available'}
                </Typography>
              </Box>
            ) : (
              <>
                {visibleItems.map((item) => (
                  <Suspense key={item.id ?? item.name} fallback={<CategorySkeleton />}>
                    {item.is_sub_category
                      ? <RestaurantItem addItem={addItem} item={item} />
                      : <ProductItem item={item} />
                    }
                  </Suspense>
                ))}
                {visibleCount < filteredItems.length && (
                  <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', py: 2 }}>
                    <Button variant="outlined" onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}>
                      Show more
                    </Button>
                  </Box>
                )}
              </>
            )}
          </Box>
        </Box>
      </SubCategoryChangeContext.Provider>

      <BottomNav />
    </Box>
  );
}
