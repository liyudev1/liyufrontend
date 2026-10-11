import { AppBar ,Dialog,DialogContent,DialogTitle,Divider,IconButton,styled, Toolbar } from "@mui/material";
import { DeliveryLogo } from "./HomePage";
import { Close, Schedule, ShoppingCartCheckout } from "@mui/icons-material";
import { 
    Box, 
    Chip, 
    Stack, 
    Typography, 
    Card,
    Button,
    useTheme,
    useMediaQuery,
    CircularProgress,
    Container,
    Snackbar
} from "@mui/material";


import { useEffect,  useState } from "react";
import api from "../api";
import { ACCESS_TOKEN } from "../constants";


const GlassAppBar = styled(AppBar)(({ theme }) => ({
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    backdropFilter: 'blur(10px)',
    borderBottom: '1px solid #E5E7EB',
    boxShadow: 'none',
    height: "65px",
  }));

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
      padding: theme.spacing(0),
    },
    '& .MuiPaper-root': {
      width: '100%',
      maxWidth: 450,
      margin: theme.spacing(1),
      borderRadius: 12,
      maxHeight: '90vh',
      [theme.breakpoints.down('sm')]: {
        width: '100%',
      }
    },
  }));

function DeliveryHeader(){
    return (
        <GlassAppBar position="fixed">
            <Toolbar sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 2,
                height: "100%"
            }}>
                <DeliveryLogo/>
            </Toolbar>
        </GlassAppBar>
    )
}

function OrderDetail({ item, open, setOpen }) {
    console.log("item",item)
    const handleClose = () => setOpen(false);
    return (
      <BootstrapDialog
        onClose={handleClose}
        open={open}
        aria-labelledby="order-detail"
        sx={{ my: 10 }}
      >
        <DialogTitle
          sx={{
            m: 0,
            p: 2,
            fontSize: 20,
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            gap: 1,
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          Order Detail
        </DialogTitle>
  
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={(theme) => ({
            position: "absolute",
            right: 12,
            top: 12,
            color: theme.palette.grey[500],
            backgroundColor: "rgba(0,0,0,0.02)",
            "&:hover": { backgroundColor: "rgba(0,0,0,0.08)" },
          })}
        >
          <Close />
        </IconButton>
  
        <DialogContent sx={{ p: 0, display: "flex", flexDirection: "column", height: "100%" }}>
  

          <Box
            sx={{
              flex: 1,
              p: 2,
              overflowY: "auto",
              "&::-webkit-scrollbar": { width: 6 },
              "&::-webkit-scrollbar-thumb": {
                background: "#ccc",
                borderRadius: 3,
              },
            }}
          >

            <Stack spacing={1} mb={2}>
              <Typography fontWeight={600}>Order #{item.order_number}</Typography>
              <Typography variant="body2" color="text.secondary">
                Status: {item.status}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Phone: {item.phone}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Address: {item.shipping_address}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Created: {new Date(item.created_at).toLocaleString()}
              </Typography>
            </Stack>
  
            <Divider sx={{ my: 1 }} />
  
            {item.special_instraction && item.special_instraction !== "none" && (
            <Box
                sx={{
                mb: 2,
                p: 1.5,
                borderRadius: 2,
                backgroundColor: "rgba(0,0,0,0.03)",
                }}
            >
                <Typography fontWeight={600}>Special Instruction</Typography>
                <Typography variant="body2" color="text.secondary">
                {item.special_instraction}
                </Typography>
            </Box>
            )}

        <Stack spacing={2} mt={2}>
        {(() => {
            const items = item?.items;
            
            // Convert to array if needed
            const itemArray = Array.isArray(items) 
            ? items 
            : (typeof items === 'object' && items !== null)
                ? Object.values(items)
                : [];
            
            return itemArray.map((product) => (
                <Box
                key={product.id}
                sx={{
                    p: 1.5,
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: "divider",
                }}
                >
    
                <Typography fontSize={16} fontWeight={700} mb={1}>
                    {product.name}
                </Typography>
    
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                    <Typography color="text.secondary">Location</Typography>
                    <Typography fontWeight={500}>
                    {product.category?.name || "Unknown"}
                    </Typography>
                </Box>
    
    
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                    <Typography color="text.secondary">Price</Typography>
                    <Typography fontWeight={500}>{product.price} ETB</Typography>
                </Box>
    
    
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography color="text.secondary">Quantity</Typography>
                    <Typography fontWeight={500}>{product.quantity}</Typography>
                </Box>
                </Box>
            ));
        })()}
        </Stack>

          </Box>
  

          <Box
            sx={{
              p: 2,
              borderTop: "1px solid",
              borderColor: "divider",
              backgroundColor: "white",
              flexShrink: 0,
            }}
          >
            <Typography variant="h6" fontWeight={600} mb={2}>
              Order Summary
            </Typography>
  
            <Stack spacing={1} mb={2}>
              <SummaryRow label="Delivery Fee" value="30-40 ETB" />
              <SummaryRow label="Service Fee" value="10 ETB" />
              <Divider />
  
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="h6" fontWeight={700}>
                  Total
                </Typography>
                <Typography variant="h6" fontWeight={700} color="primary">
                  {item.total_price} ETB
                </Typography>
              </Box>
            </Stack>
  
            <Button
              fullWidth
              size="large"
              sx={{
                borderRadius: 2,
                py: 1.5,
                fontSize: 14,
                fontWeight: 500,
                textTransform: "none",
                mt: 1,
                color: "text.secondary",
              }}
              onClick={handleClose}
            >
              Close
            </Button>
          </Box>
        </DialogContent>
      </BootstrapDialog>
    );
  }
  

  function SummaryRow({ label, value }) {
    return (
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography color="text.secondary">{label}</Typography>
        <Typography fontWeight={500}>{value}</Typography>
      </Box>
    );
  }
  


// Browsers can't send an Authorization header on a WebSocket, so the JWT goes in the query string.
function getToken() {
    try {
        return localStorage.getItem(ACCESS_TOKEN) || "";
    } catch {
        return "";
    }
}

const normalizeOrder = (o) => ({ ...o, status: String(o?.status ?? "").toLowerCase() });

function Order({ item,handleStatusChange,info }) {
    const [open,setOpen] = useState(false)
    // Canonical statuses are sent straight to the server (no label round-trip).
    const nextStatus = { pending: "confirmed", confirmed: "delivered" };
    const handleAdminChipClick = () => {
        const next = nextStatus[item.status];
        if (next) handleStatusChange(next, item);
    };
    const accentChipSx = item.status === "pending"
        ? { backgroundColor: "#FF5722", color: "#fff", "&:hover": { backgroundColor: "#E64A19" } }
        : {};
    const handleAcceptClick = () => {
        if (item.status === "pending") handleStatusChange("confirmed", item);
    };
    const statusMap = {
        "Accept":"confirmed",
        "Regect":"cancelled",
        "Complete":"delivered",
        "pending":"Accept",
        'confirmed':"Accepted",
        'cancelled':'cancelled',
        "delivered":"delivered"
    }

    const theme = useTheme();

    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const formatSimpleDateTime = (isoString) => {
        const date = new Date(isoString);
        
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    const getStatusColor = (status) => {
        const statusLower = status.toLowerCase();
        switch(statusLower) {
            case 'delivered': return 'success';
            case 'confirmed': return 'warning';
            case 'pending': return 'success';
            case 'cancelled': return 'error';
            default: return 'primary';
        }
    };

    const getStatusVariant = (status) => {
        return status.toLowerCase() === 'delivered' || status.toLowerCase() === 'cancelled' ? 'filled' : 'outlined';
    };


    return (
        <Card 
            sx={{ 
                width: "100%", 
                borderRadius: 2, 
                boxShadow: 'none',
                backgroundColor:"white",
                transition: 'border-color 0.2s ease',
                '&:hover': {
                    borderColor: '#FFB199',
                },
                border: '1px solid #E5E7EB',
                overflow: 'hidden'
            }}
        >
            <OrderDetail item={item} open={open} setOpen={setOpen}/>
            <Stack sx={{ 
                background: 'white', 
                p:{xs:.8,md:1}  ,
                gap:1.5,         

            }}>
                <Box sx={{ 
                    display: "flex", 
                    alignItems: "flex-start", 
                    justifyContent: "space-between", 
                }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: 'wrap' }}>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            backgroundColor: '#F3F4F6',
                            color: 'text.primary',
                            px: 1.5,
                            py: 0.5,
                            borderRadius: 2
                        }}>
                            <ShoppingCartCheckout fontSize="small" />
                            <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
                                {item.item_count} {item.item_count === 1 ? 'Item' : 'Items'}
                            </Typography>
                        </Box>
                        
                        <Typography 
                            variant="caption" 
                            sx={{ 
                                color: 'text.secondary',
                                fontWeight: 500,
                                fontSize: 12
                            }}
                        >
                            #{item.order_number}
                        </Typography>
                    </Box>
                    {info.is_admin?
                    <Stack direction="row" spacing={3}>
                        {item.status !== "delivered" && item.status !== "cancelled"?
                        <Chip 
                        size={isMobile ? "small" : "medium"}
                        label="Reject" 
                        color={getStatusColor("cancelled")}
                        clickable
                        onClick={()=>handleStatusChange("cancelled",item)}
                        variant={"outlined"}
                        sx={{
                            fontWeight: 600,
                            textTransform: 'capitalize',
                            minWidth: 80
                        }}
                    />:null}
                        <Chip 
                        size={isMobile ? "small" : "medium"}
                        label={item.status === "confirmed" && info.is_admin?"Complete":statusMap[item.status]} 
                        color={getStatusColor(item.status === "confirmed" && info.is_admin?"confirmed":statusMap[item.status])}
                        clickable
                        onClick={handleAdminChipClick}
                        variant={item.status === "confirmed" && info.is_admin?"filled":item.status === "confirmed"? "outlined":"filled"}
                        sx={{
                            ...accentChipSx,
                            fontWeight: 600,
                            textTransform: 'capitalize',
                            minWidth: 80
                        }}
                    />
                    </Stack>
                    :
                     <Chip 
                        size={isMobile ? "small" : "medium"}
                        label={statusMap[item.status]} 
                        color={getStatusColor(item.status)}
                        clickable
                        onClick={handleAcceptClick}
                        variant={item.status === "confirmed"? "outlined":"filled"}
                        sx={{
                            ...accentChipSx,
                            fontWeight: 600,
                            textTransform: 'capitalize',
                            minWidth: 80
                        }}
                    />
                    }

                </Box>

                <Box sx={{ 
                    display: "flex", 
                    alignItems: "center", 
                    gap:2,
                    borderRadius: 2,
                }}>
                    <Typography variant="h6" fontSize={isMobile ? 16 : 18} fontWeight={700} color="text.primary">
                        Total Amount:
                    </Typography>
                    <Typography fontSize={isMobile ? 16 : 18} variant="h6" color="primary" fontWeight={800}>
                        {item.total_price.toFixed(2)} ETB
                    </Typography>
                </Box>

                <Box sx={{ 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "space-between",
                    gap:1,
                }}>
                    <Stack direction="row" spacing={1} width={isMobile ? '100%' : 'auto'}>
                        <Button 
                            variant="outlined"
                            color="primary"
                            size={isMobile ? "small" : "medium"}
                            onClick={()=>setOpen(true)}
                            sx={{
                                borderRadius: 2,
                                fontWeight: 600,
                                textTransform: 'none',
                                minWidth:80
                            }}
                        >
                            View Details
                        </Button>
                    </Stack>
                    
                    <Box sx={{ 
                        display: "flex", 
                        alignItems: "center", 
                        gap: 1,
                        width: isMobile ? '100%' : 'auto',
                        justifyContent:'flex-end'
                    }}>
                        <Schedule fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary" fontWeight={500}>
                            {formatSimpleDateTime(item.created_at)}
                        </Typography>
                    </Box>
                </Box>
            </Stack>
        </Card>
    );
}

function Tabs({ category, setCategory, tabList }) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const tabMap = {
        "All":"All",
        "pending":"New",
        "confirmed":"Accepted",
        "delivered":"Delivered"
    }
    
    const accent = '#FF5722';
    const accentDark = '#E64A19';
    const tabs = ["All", ...tabList];

    function handleTabChange(category_name) {
        setCategory(category_name);
    }

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                overflowX: "auto",
                mb: 3,
                py: 0.5,
                scrollbarWidth: "none",
                "&::-webkit-scrollbar": { display: "none" },
                WebkitOverflowScrolling: "touch",
            }}
        >
            {tabs.map((tab) => {
                const isActive = category === tab;
                return (
                    <Button
                        key={tab}
                        variant="text"
                        disableElevation
                        onClick={() => handleTabChange(tab)}
                        sx={{
                            borderRadius: 2,
                            fontSize: isMobile ? "0.875rem" : "0.9375rem",
                            textTransform: "none",
                            minWidth: "auto",
                            px: 2.5,
                            py: 0.75,
                            fontWeight: isActive ? 700 : 500,
                            whiteSpace: "nowrap",
                            boxShadow: "none",
                            border: `1px solid ${isActive ? accent : "#E5E7EB"}`,
                            backgroundColor: isActive ? accent : "white",
                            color: isActive ? "#fff" : "#4B5563",
                            "&:hover": {
                                boxShadow: "none",
                                borderColor: accent,
                                backgroundColor: isActive ? accentDark : "#FFF3EE",
                            },
                        }}
                    >
                        {tabMap[tab]}
                    </Button>
                );
            })}
        </Box>
    );
}

function DeliveryHomePage() {
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState("All");
    const [my_order, setMyOrder] = useState([]);
    const [info, setInfo] = useState();
    const [socket, setSocket] = useState(null);
    const [toast, setToast] = useState("");
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    useEffect(() => {
        async function getMyOrders() {
            const resp = await api.get("get-delivery-info/");
            setInfo(resp.data);

            const url = "get-orders-monitor/";
            try {
                const result = await api.get(url);
                setMyOrder(result.data.map(normalizeOrder));
            } catch (error) {
                console.log("error while getting my-orders", error);
            } finally {
                setLoading(false);
            }
        }
        getMyOrders();
    }, []);
    const updateOrderStatus = (orderId, newStatus) => {
        setMyOrder(prev =>
            prev.map(order =>
                String(order.id) === String(orderId)
                    ? { ...order, status: String(newStatus).toLowerCase() }
                    : order
            )
        );
    };
    
    const addNewOrder = (newOrder) => {
        setMyOrder(prev => {
            const exists = prev.some(o => String(o.id) === String(newOrder.id));
            if (exists) return prev;
    
            return [...prev, normalizeOrder(newOrder)];
        });
    };

    useEffect(() => {
        const host = import.meta.env.VITE_BACKEND_HOST.replace(/^https?:\/\//, "");
        const baseUrl = `wss://${host}/ws/livestatus/order-status/`;

        let ws = null;
        let retryTimer = null;
        let retries = 0;
        let closedByUs = false;

        const connect = () => {
            // Read the token on every (re)connect so a refreshed JWT is picked up.
            const token = getToken();
            ws = new WebSocket(token ? `${baseUrl}?token=${encodeURIComponent(token)}` : baseUrl);

            ws.onopen = () => {
                console.log("WebSocket connection established");
                retries = 0;
                setSocket(ws);
            };

            ws.onmessage = (event) => {
                try {
                    const response = JSON.parse(event.data);
                    const wsData = response?.data;
                    console.log("WebSocket message:", response);
                    if (!wsData) return;

                    if (response.type === "status_update") {
                        const id = wsData.id ?? wsData.order_id;
                        if (id !== undefined && wsData.status) {
                            updateOrderStatus(id, wsData.status);
                        }
                        return;
                    }

                    if (response.type === "add_order") {
                        addNewOrder(wsData);
                    }
                } catch (error) {
                    console.error("Error parsing WebSocket message:", error);
                }
            };

            ws.onerror = (error) => {
                console.error("WebSocket error:", error);
            };

            ws.onclose = (event) => {
                if (closedByUs) return;
                console.log("WebSocket connection closed, retrying:", event);
                setSocket(null);
                const delay = Math.min(1000 * 2 ** retries, 15000);
                retries += 1;
                retryTimer = setTimeout(connect, delay);
            };
        };

        connect();

        return () => {
            closedByUs = true;
            clearTimeout(retryTimer);
            if (ws) ws.close();
        };
    }, []);

    // `status` must be a canonical value: "confirmed" | "cancelled" | "delivered"
    function handleStatusChange(status, item) {
        if (!socket || socket.readyState !== WebSocket.OPEN) {
            console.error("WebSocket is not connected");
            setToast("Not connected to the server yet. Please try again in a moment.");
            return;
        }
        if (!info?.person) {
            console.warn("info.person is missing; the server may reject this update");
        }

        socket.send(
            JSON.stringify({
                type: "status_update",
                data: {
                    person: info?.person,
                    status,
                    order_id: item.id,
                },
            })
        );
    }

    const filteredOrders = my_order.filter(
        (item) =>
            category === "All" ||
            item.status.toLowerCase() === category.toLowerCase()
    );
    let pendingCount = 0;
    for (const i of filteredOrders) {
    if (i.status && i.status.toLowerCase() === "pending") {
        pendingCount++;
    }
    }

    return (
        <Box
            sx={{
                height: "100dvh",
                width: "100%",
                backgroundColor: "#F9F9F9",
                overflowY: "auto",
                position: "relative",
                display: "flex",
                flexDirection: "column",
                overflowX: "hidden",
            }}
        >
            <DeliveryHeader />
            <Snackbar open={!!toast} autoHideDuration={3000} onClose={() => setToast("")} message={toast} />
            <Box
                sx={{
                    minHeight: "100dvh",
                    width: "100%",
                    overflowY: "auto",
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                    backgroundColor: "#F9F9F9",
                    my: 7,
                    overflowX: "hidden",
                }}
            >
                <Container
                    maxWidth="lg"
                    sx={{
                        flex: 1,
                        py: 3,
                        px: isMobile ? 1 : 3,
                    }}
                >
                    <Box sx={{ mb: 4, textAlign: "left" }}>
                        <Typography
                            sx={{
                                fontSize: isMobile ? 28 : 36,
                                fontWeight: 700,
                                mb: 1,
                            }}
                        >
                            Orders
                        </Typography>
                        <Typography
                            sx={{
                                fontSize: isMobile ? 14 : 16,
                                color: "text.secondary",
                                fontWeight: 500,
                            }}
                        >
                            {pendingCount} new order
                            {pendingCount !== 1 ? "s" : ""} found
                        </Typography>
                    </Box>

                    <Box sx={{ width: "100%", flex: 1 }}>
                        <Tabs
                            category={category}
                            setCategory={setCategory}
                            tabList={["pending", "confirmed", "delivered"]}
                        />

                        {loading ? (
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    height: 200,
                                }}
                            >
                                <CircularProgress size={40} />
                            </Box>
                        ) : filteredOrders.length === 0 ? (
                            <Box
                                sx={{
                                    textAlign: "center",
                                    py: 8,
                                    backgroundColor: "white",
                                    borderRadius: 2,
                                    border: "1px solid #E5E7EB",
                                }}
                            >
                                <Typography variant="h6" color="text.secondary">
                                    No orders found
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ mt: 1 }}
                                >
                                    {category === "All"
                                        ? "You haven't placed any orders yet."
                                        : `No ${category} orders found.`}
                                </Typography>
                            </Box>
                        ) : (
                            <Stack spacing={3} width="100%" sx={{ pb: 2 }}>
                                {[...filteredOrders].reverse().map((item) => (
                                    <Order
                                        key={item.id}
                                        item={item}
                                        info={info}
                                        handleStatusChange={handleStatusChange}
                                    />
                                ))}
                            </Stack>
                        )}
                    </Box>
                </Container>
            </Box>
        </Box>
    );
}




export default DeliveryHomePage
