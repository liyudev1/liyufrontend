import {  Schedule, ShoppingCartCheckout } from "@mui/icons-material";
import { 
    Box, 
    Chip, 
    Stack, 
    Typography, 
    Card,
    CardContent,
    Button,
    useTheme,
    useMediaQuery,
    CircularProgress,
    Container
} from "@mui/material";
import { Header } from "./HomePage";
import BottomNav from "./BottomNav";
import { useEffect, useState } from "react";
import api from "../api";

function Order({ item,socket }) {
    const [cancelLoad,setCancelLoad] = useState(false)
    const [isActionDisabled, setIsActionDisabled] = useState();

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    useEffect(()=>{
        setIsActionDisabled(item.status.toLowerCase() === "confirmed" || 
        item.status.toLowerCase() === "delivered" || 
        item.status.toLowerCase() === "cancelled")
    },[item.status])

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
            case 'pending': return 'default';
            case 'cancelled': return 'error';
            default: return 'primary';
        }
    };

    const getStatusVariant = (status) => {
        const statusLower = status.toLowerCase();
        return  statusLower === 'pending' ? 'outlined': 'filled' ;
    };

    async function handleCancel(e) {
        if (!item?.id) {
            console.error("No item ID provided");
            return;
        }
        
        if (!socket || socket.readyState !== WebSocket.OPEN) {
            console.error("WebSocket is not connected");
            return;
        }
        
        try {
            setCancelLoad(true)
            const data = {
                status: "cancelled",
                order_id: item.id,
            };
            socket.send(
                JSON.stringify({
                    data: data,
                    type: "cancel_order"
                })
            );
            setIsActionDisabled(true)
            socket.onmessage = (event) => {
                setCancelLoad(false)
            }
        } catch (error) {
            console.error("API call failed:", error);
            throw error;
        }

    }

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
            <Stack sx={{ 
                background: 'white', 
                p: { xs: 0.8, md: 1 },
                gap: 1.5,         
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
                            backgroundColor: theme.palette.primary.main,
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
                    <Chip 
                        size={isMobile ? "small" : "medium"}
                        label={item.status} 
                        color={getStatusColor(item.status)}
                        variant={getStatusVariant(item.status)}
                        sx={{
                            fontWeight: 600,
                            textTransform: 'capitalize',
                            minWidth: 90
                        }}
                    />
                </Box>

                <Box sx={{ 
                    display: "flex", 
                    alignItems: "center", 
                    gap: 2,
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
                    gap: 1,
                }}>
                    <Stack direction="row" spacing={1} width={isMobile ? '100%' : 'auto'}>
                        <Button 
                            variant="outlined"
                            color="error"
                            size={isMobile ? "small" : "medium"}
                            disabled={isActionDisabled || cancelLoad}
                            startIcon={
                                cancelLoad ? (
                                  <CircularProgress size={20} sx={{ color: 'inherit' }} />
                                ) : (
                                  null
                                )
                              }
                            onClick={handleCancel}
                            sx={{
                                borderRadius: 2,
                                fontWeight: 600,
                                textTransform: 'none',
                                minWidth: 80
                            }}
                        >
                            {cancelLoad ? 'Cancling Order...' : "Cancel"}
                        </Button>
                        <Button 
                            variant="contained"
                            color="primary"
                            size={isMobile ? "small" : "medium"}
                            disabled
                            sx={{
                                borderRadius: 2,
                                fontWeight: 600,
                                textTransform: 'none',
                                minWidth: 80
                            }}
                        >
                            Pay Now
                        </Button>
                    </Stack>
                    
                    <Box sx={{ 
                        display: "flex", 
                        alignItems: "center", 
                        gap: 1,
                        width: isMobile ? '100%' : 'auto',
                        justifyContent: 'flex-end'
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
                            ? '#D10E2F'
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
                        {tab}
                    </Button>
                );
            })}
        </Box>
    );
}

function MyOrder() {
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState("All");
    const [my_order, setMyOrder] = useState([]);
    const theme = useTheme();
    const [socket, setSocket] = useState(null);
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const updateOrderStatus = (orderId, newStatus) => {
        setMyOrder(prev =>
            prev.map(order =>
                order.id === orderId
                    ? { ...order, status: newStatus }
                    : order
            )
        );
    };

    useEffect(() => {
        async function getMyOrders() {
            const url = "get-orders/";
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
        let url = import.meta.env.VITE_BACKEND_HOST;
        const djangoHost = url.replace(/^https?:\/\//, "");
        const wsUrl = `wss://${djangoHost}/ws/livestatus/order-status/`
        const wsocket = new WebSocket(wsUrl)
        setSocket(wsocket)
        
        wsocket.onmessage = (event) => {
            try {
                const response = JSON.parse(event.data);
                const wsData = response?.data;

                console.log("WebSocket message:", wsData);

                if (wsData && wsData.id && wsData.status) {
                    updateOrderStatus(wsData.id, wsData.status);
                    console.log(
                        `Order ${wsData.id} updated to ${wsData.status}`
                    );
                }
            } catch (error) {
                console.error("Error parsing WebSocket message:", error);
            }
        };
        
        wsocket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
        
        wsocket.onclose = (event) => {
            console.log('WebSocket connection closed:', event);
        };
        
        return () => {
            if (wsocket.readyState === WebSocket.OPEN) {
                wsocket.close();
            }
        };
    }, []);


    const filteredOrders = my_order.filter(item => {
        if (category === "All") return true;
        return item.status.toLowerCase() === category.toLowerCase();
    });

    return (
        <Box sx={{
            height: '100dvh',
            width: '100%',
            backgroundColor:'#F9F9F9',
            overflowY: 'auto',
            position: "relative",
            display: "flex",
            flexDirection: "column",
            overflowX:"hidden"
            }}>
            <Header />
            <Box sx={{
                minHeight: '100dvh',
                width: '100%',
                overflowY: 'auto',
                position: "relative",
                display: "flex",
                flexDirection: "column",
                backgroundColor:'#F9F9F9',
                my:7,
                overflowX:"hidden"
            }}>
                <Container maxWidth="lg" sx={{
                    flex: 1,
                    py: 3,
                    px: isMobile ? 1 : 3
                }}>
                    <Box sx={{
                        mb: 4,
                        textAlign:'left'
                    }}>
                        <Typography sx={{
                            fontSize: isMobile ? 28 : 36,
                            fontWeight: 700,
                            mb: 1
                        }}>
                            My Orders
                        </Typography>
                        <Typography sx={{
                            fontSize: isMobile ? 14 : 16,
                            color: 'text.secondary',
                            fontWeight: 500
                        }}>
                            {filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''} found
                        </Typography>
                    </Box>

                    <Box sx={{
                        width: "100%",
                        flex: 1
                    }}>
                        <Tabs
                            category={category}
                            setCategory={setCategory}
                            tabList={["pending","confirmed", "delivered", "cancelled"]} />

                        {loading ? (
                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                height: 200
                            }}>
                                <CircularProgress size={40} />
                            </Box>
                        ) : filteredOrders.length === 0 ? (
                            <Box sx={{
                                textAlign: 'center',
                                py: 8,
                                backgroundColor: 'white',
                                borderRadius: 3,
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                            }}>
                                <Typography variant="h6" color="text.secondary">
                                    No orders found
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                    {category === "All"
                                        ? "You haven't placed any orders yet."
                                        : `No ${category} orders found.`}
                                </Typography>
                            </Box>
                        ) : (
                            <Stack spacing={3} width={"100%"} sx={{ pb: 2 }}>
                                {filteredOrders.reverse().map((item, index) => (
                                    <Order key={index} item={item} socket={socket} />
                                ))}
                            </Stack>
                        )}
                    </Box>
                </Container>

                <BottomNav />
            </Box>
        </Box>
    );
}

export default MyOrder;