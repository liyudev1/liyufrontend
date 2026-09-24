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
    Container
} from "@mui/material";


import { useEffect,  useState } from "react";
import api from "../api";


const GlassAppBar = styled(AppBar)(({ theme }) => ({
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
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
                height: "100%",
                boxShadow: 1
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
  


function Order({ item,handleStatusChange,info }) {
    const [open,setOpen] = useState(false)
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
                borderRadius: 3, 
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                backgroundColor:"white",
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                    boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
                    transform: 'translateY(-2px)'
                },
                border: `1px solid ${theme.palette.divider}`,
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
                            backgroundColor: theme.palette.grey[600],
                            color: 'white',
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
                        onClick={()=>handleStatusChange(statusMap["Regect"],item)}
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
                        onClick={()=>handleStatusChange(statusMap[item.status === "confirmed" && info.is_admin?"Complete":item.status],item)}
                        variant={item.status === "confirmed" && info.is_admin?"filled":item.status === "confirmed"? "outlined":"filled"}
                        sx={{
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
                        onClick={()=>handleStatusChange(statusMap[item.status],item)}
                        variant={item.status === "Accepted"? "outlined":"filled"}
                        sx={{
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
    
    const tabColors = {
        activeBg: '#E31837', 
        activeText: '#FFFFFF',
        inactiveBg: 'transparent',
        inactiveText: '#666666',
        inactiveBorder: '#E0E0E0',
        hoverBg: '#FFF5F5',
        containerBg: '#F8F8F8',
    };

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
                mb: 4,
                p: 2,
                borderRadius: 3,
                mx: isMobile ? -2 : 0,
                position: 'relative',
                scrollBehavior: 'smooth',
                '&::-webkit-scrollbar': { 
                    height: 8,
                    display: 'block',
                    backgroundColor: 'transparent'
                },
                '&::-webkit-scrollbar-thumb': {
                    backgroundColor: theme.palette.divider,
                    borderRadius: 4,
                    '&:hover': {
                        backgroundColor: theme.palette.action.hover,
                    }
                },
                '&::-webkit-scrollbar-track': {
                    backgroundColor: 'transparent'
                },
                ...(isMobile && {
                    '&::-webkit-scrollbar': {
                        display: 'none'
                    },
                    WebkitOverflowScrolling: 'touch'
                })
            }}
        >
            <Button 
                variant="text"
                onClick={() => handleTabChange("All")}
                sx={{
                    borderRadius: '24px',
                    fontSize: isMobile ? '0.875rem' : '0.9375rem',
                    textTransform: "capitalize",
                    minWidth: 'auto',
                    px: 3,
                    py: 1,
                    fontWeight: category === "All" ? 700 : 600,
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    whiteSpace: 'nowrap',
                    border: category === "All" 
                        ? `2px solid ${tabColors.activeBg}` 
                        : `2px solid ${tabColors.inactiveBorder}`,
                    backgroundColor: category === "All" 
                        ? tabColors.activeBg 
                        : tabColors.inactiveBg,
                    color: category === "All" 
                        ? tabColors.activeText 
                        : tabColors.inactiveText,
                    boxShadow: category === "All" 
                        ? '0 4px 12px rgba(227, 24, 55, 0.2)' 
                        : 'none',
                    '&:hover': {
                        backgroundColor: category === "All" 
                            ? '#D10E2F' // Darker red on hover
                            : tabColors.hoverBg,
                        borderColor: category === "All" 
                            ? '#D10E2F' 
                            : theme.palette.primary.light,
                        color: category === "All" 
                            ? tabColors.activeText 
                            : theme.palette.primary.main,
                        transform: 'translateY(-2px)',
                        boxShadow: category === "All" 
                            ? '0 6px 16px rgba(227, 24, 55, 0.25)' 
                            : '0 4px 12px rgba(0, 0, 0, 0.08)'
                    },
                    '&:active': {
                        transform: 'translateY(0)',
                        transition: 'transform 0.1s'
                    }
                }}
            >
                All
            </Button>
            
            {tabList.map((tab, index) => {
                const isActive = category === tab;
                return (
                    <Button
                        onClick={() => handleTabChange(tab)}
                        key={index}
                        variant="text"
                        sx={{
                            borderRadius: '24px',
                            fontSize: isMobile ? '0.875rem' : '0.9375rem',
                            textTransform: "capitalize",
                            minWidth: 'auto',
                            px: 3,
                            py: 1,
                            fontWeight: isActive ? 700 : 600,
                            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                            whiteSpace: 'nowrap',
                            border: isActive 
                                ? `2px solid ${tabColors.activeBg}` 
                                : `2px solid ${tabColors.inactiveBorder}`,
                            backgroundColor: isActive 
                                ? tabColors.activeBg 
                                : tabColors.inactiveBg,
                            color: isActive 
                                ? tabColors.activeText 
                                : tabColors.inactiveText,
                            boxShadow: isActive 
                                ? '0 4px 12px rgba(227, 24, 55, 0.2)' 
                                : 'none',
                            '&:hover': {
                                backgroundColor: isActive 
                                    ? '#D10E2F'
                                    : tabColors.hoverBg,
                                borderColor: isActive 
                                    ? '#D10E2F' 
                                    : theme.palette.primary.light,
                                color: isActive 
                                    ? tabColors.activeText 
                                    : theme.palette.primary.main,
                                transform: 'translateY(-2px)',
                                boxShadow: isActive 
                                    ? '0 6px 16px rgba(227, 24, 55, 0.25)' 
                                    : '0 4px 12px rgba(0, 0, 0, 0.08)'
                            },
                            '&:active': {
                                transform: 'translateY(0)',
                                transition: 'transform 0.1s'
                            }
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
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    useEffect(() => {
        async function getMyOrders() {
            const resp = await api.get("get-delivery-info/");
            setInfo(resp.data);

            const url = "get-orders-monitor/";
            try {
                const result = await api.get(url);
                setMyOrder(result.data);
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
                order.id === orderId
                    ? { ...order, status: newStatus }
                    : order
            )
        );
    };
    
    const addNewOrder = (newOrder) => {
        setMyOrder(prev => {
            const exists = prev.some(o => o.id === newOrder.id);
            if (exists) return prev;
    
            return [...prev, newOrder];
        });
    };

    useEffect(() => {
        let url = import.meta.env.VITE_BACKEND_HOST;
        const djangoHost = url.replace(/^https?:\/\//, "");
        const wsUrl = `wss://${djangoHost}/ws/livestatus/order-status/`;
        
        let ws;
        
        try {
            ws = new WebSocket(wsUrl);
            setSocket(ws);
            
            ws.onopen = () => {
                console.log("WebSocket connection established");
            };
            
            ws.onmessage = (event) => {
                try {
                    const response = JSON.parse(event.data);
                    const wsData = response?.data;
            
                    console.log("WebSocket message:", wsData);
                    const status_type = response?.type

                    if (!wsData) return;
                    console.log(status_type)
                    if (status_type === "status_update") {
                        if (wsData.id && wsData.status) {
                            updateOrderStatus(wsData.id, wsData.status);
                            console.log(`Updated order ${wsData.id}`);
                        }
                        return;
                    }
            
                    if (status_type === "add_order") {
                        if (wsData) {
                            addNewOrder(wsData);
                            console.log("New order added:", wsData);
                        }
                        return;
                    }
            
                } catch (error) {
                    console.error("Error parsing WebSocket message:", error);
                }
            };
            
            ws.onerror = (error) => {
                console.error("WebSocket error:", error);
            };
            
            ws.onclose = (event) => {
                console.log("WebSocket connection closed:", event);
            };
        } catch (error) {
            console.error("WebSocket connection failed:", error);
        }
        
        // Cleanup function
        return () => {
            if (ws && ws.readyState === WebSocket.OPEN) {
                ws.close();
            }
        };
    }, []); 


    const statusMap = {
        Accept: "confirmed",
        Regect: "cancelled",
        Complete: "delivered",
        pending: "Accept",
        confirmed: "Accepted",
        cancelled: "cancelled",
        delivered: "delivered",
    };

    async function handleStatusChange(status, item) {
        if (!socket || socket.readyState !== WebSocket.OPEN) {
            console.error("WebSocket is not connected");
            return;
        }
        
        try {
            const data = {
                person: info?.person,
                status: statusMap[status],
                order_id: item.id,
            };
            socket.send(
                JSON.stringify({
                    data: data,
                    type: "status_update"
                })
            );
        } catch (error) {
            console.error("API call failed:", error);
            throw error;
        }
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
                                    borderRadius: 3,
                                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
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