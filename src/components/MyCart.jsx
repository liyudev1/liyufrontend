import { Box, Card, CardContent, IconButton, Stack, Typography, Button, Divider } from "@mui/material";
import AmountControl from "./AmountControl";
import { Clear, AddShoppingCart, ArrowBack } from "@mui/icons-material";
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import CloseIcon from '@mui/icons-material/Close';
import { useCart } from "./CartFunc";
import api from "../api";
import OrderAlert from "./Alert";
import OrderProgress, { OrderStatus } from "./FinalInput";
import AddressForm from "./AddressForm";
import { ACCESS_TOKEN } from "../constants";



function CartItem({item}){
  const {removeFromCart} = useCart()
    return (
        <Card 
            sx={{
                width: "100%", 
                borderRadius: 2, 
                boxShadow: 1,
                border: '1px solid #e0e0e0',
                transition: 'all 0.2s ease',
                '&:hover': {
                    boxShadow: 3,
                    borderColor: 'primary.light',
                },
            }}>
            <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 }, }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Box 
                        sx={{ 
                            width: 80, 
                            height: 80, 
                            borderRadius: 2,
                            overflow: 'hidden',
                            flexShrink: 0,
                            backgroundColor: '#f5f5f5',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <img 
                            style={{ 
                                width: '100%', 
                                height: '100%', 
                                objectFit: 'cover' 
                            }} 
                            src={
                              item.images[0]?.image 
                                ? (item.images[0].image.startsWith('http') 
                                    ? item.images[0].image 
                                    : `${import.meta.env.VITE_BACKEND_HOST}${item.images[0].image}`
                                  )
                                : '/default-image.jpg'
                            }                            alt="" 
                        />
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                            <Box sx={{ minWidth: 0, flex: 1 }}>
                                <Typography 
                                    sx={{ 
                                        fontWeight: 600, 
                                        fontSize: 16,
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
                                    }}
                                >
                                    {item.name}
                                </Typography>
                                <Typography 
                                    sx={{ 
                                        color: "text.secondary", 
                                        fontSize: 14,
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
                                    }}
                                >
                                    {item.location}
                                </Typography>
                            </Box>
                            <IconButton
                                onClick={()=>removeFromCart(item.id)}
                                size="small" 
                                sx={{ 
                                    color: 'text.secondary',
                                    '&:hover': { 
                                        color: 'error.main',
                                        backgroundColor: 'error.light',
                                    },
                                    ml: 1,
                                    flexShrink: 0
                                }}
                            >
                                <Clear fontSize="small" />
                            </IconButton>
                        </Box>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                            <AmountControl item={item} IconSize={"20px"} />
                            <Typography fontSize={16} variant="h6" color="primary" fontWeight={700}>
                                {item.price}
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    )
}

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

function MyCart({product,step,setStep,handleClose,open}) {
  const [phone,setPhone] = React.useState()
  const [orderLoad,setOrderLoad] = React.useState(false)
  const [newOrder, setNewOrder] = React.useState(false)
  const {getCartItemsCount,getCartTotal,items,clearCart,getCartDeliveryTotal} = useCart()
  const [shipping_address,setShippingAddress] = React.useState("")
  const [special_instraction,setSpecialInstraction] = React.useState("")
  const cartLength = getCartItemsCount()
  const subtotal =getCartTotal();
  const tax = 10;
  const DeliveryFee = getCartDeliveryTotal()
  const total = subtotal + DeliveryFee + tax;
  React.useEffect(() => {
    if (newOrder) {
        const timer = setTimeout(() => {
            setNewOrder(false)
        }, 10000)
        return () => clearTimeout(timer)
    }
}, [newOrder])

  function handleOrder(){
    let url = import.meta.env.VITE_BACKEND_HOST;
    const djangoHost = url.replace(/^https?:\/\//, "");
    const jwtToken = localStorage.getItem(ACCESS_TOKEN)
    const wsUrl = `wss://${djangoHost}/ws/livestatus/order-status/?token=${jwtToken}`;

    try {
        setOrderLoad(true)
        const socket = new WebSocket(wsUrl);

        socket.onopen = () => {
            console.log("WebSocket connection established");
            const data = {
              item_count:cartLength,
              total_price:total,
              address:shipping_address,
              items:items,
              special_instraction:special_instraction,
            };

            socket.send(
                JSON.stringify({
                    data: data,
                    type:"add_order"
                })
            );
        };

        socket.onerror = (error) => {
            console.error("WebSocket error:", error);
        };

        socket.onclose = (event) => {
            console.log("WebSocket connection closed:", event);
        };

        socket.onmessage = (event) => {
          setStep(1+step)
          clearCart()
          setOrderLoad(false)
        }

        return socket;
    } catch (error) {
        console.error("API call failed:", error);
        throw error;
    }
  }
  function handleDetailOrder() {
    try {
        const url = "create-order/"
        api.post(url, { 
            item_count: 1, 
            total_price: product.price, 
            address: shipping_address, 
            items: product 
        })
        setStep(step+1)
        

        window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch(error) {
        console.log("error while creating order", error)
    }
}
  return (
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        sx={{
        //   '& .MuiDialog-container': {
        //     alignItems: { xs: 'flex-end', sm: 'center' }
        //   },
          my:10,
        }}
      >
        {newOrder && <OrderAlert />}
        <DialogTitle sx={{ 
            m: 0, 
            p: 2, 
            fontSize: 20, 
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            borderBottom: '1px solid',
            borderColor: 'divider'
        }}>
          <AddShoppingCart color="primary" />
          My Cart ({cartLength})
        </DialogTitle>
        <OrderProgress step={step}/>
        
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={(theme) => ({
            position: 'absolute',
            right: 12,
            top: 12,
            color: theme.palette.grey[500],
            backgroundColor: 'rgba(0,0,0,0.02)',
            '&:hover': {
              backgroundColor: 'rgba(0,0,0,0.08)',
            }
          })}
        >
          <CloseIcon />
        </IconButton>
        {step === 0?<DialogContent sx={{ p: 0, display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Box sx={{ 
            flex: 1,
            p: 2,
            overflowX:"hidden",
            overflowY: 'auto',
            '&::-webkit-scrollbar': {
              width: 6,
            },
            '&::-webkit-scrollbar-track': {
              background: 'transparent',
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#ccc',
              borderRadius: 3,
              '&:hover': {
                background: '#aaa',
              },
            },
          }}>
            <Stack sx={{alignItems:"center"}} spacing={1}>
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </Stack>
          </Box>
          <Box sx={{ 
            p: 2, 
            borderTop: '1px solid',
            borderColor: 'divider',
            backgroundColor: 'white',
            flexShrink: 0
          }}>
            <Typography variant="h6" fontWeight={600} mb={2}>
              Order Summary
            </Typography>
            
            <Stack spacing={1} mb={2}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography color="text.secondary">Subtotal</Typography>
                <Typography fontWeight={500}>{subtotal.toFixed(2)} ETB</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography color="text.secondary">Delivery Fee</Typography>
                <Typography fontWeight={500}>{DeliveryFee.toFixed(2)} ETB</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography color="text.secondary">Service Fee</Typography>
                <Typography fontWeight={500}>{tax.toFixed(2)} ETB</Typography>
              </Box>
              <Divider />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6" fontWeight={700}>Total</Typography>
                <Typography variant="h6" fontWeight={700} color="primary">
                  {total.toFixed(2)} ETB
                </Typography>
              </Box>
            </Stack>

            <Button 
              variant="contained" 
              onClick={()=>setStep(step+1)}
              fullWidth 
              size="large"
              sx={{
                borderRadius: 2,
                py: 1.5,
                fontSize: 16,
                fontWeight: 600,
                textTransform: 'none',
                boxShadow: 2,
                '&:hover': {
                  boxShadow: 4,
                }
              }}
            >
              Next
            </Button>
            
            <Button 
              fullWidth 
              size="large"
              sx={{
                borderRadius: 2,
                py: 1.5,
                fontSize: 14,
                fontWeight: 500,
                textTransform: 'none',
                mt: 1,
                color: 'text.secondary'
              }}
              startIcon={<ArrowBack />}
              onClick={handleClose}
            >
              Continue Shopping
            </Button>

          </Box>
        </DialogContent>:step === 1?
        <DialogContent sx={{ p: 0, display: 'flex', flexDirection: 'column', height: '100%' }}>
          <AddressForm special_instraction={special_instraction} setSpecialInstraction={setSpecialInstraction} phone={phone} setPhone={setPhone} shipping_address={shipping_address} setShippingAddress={setShippingAddress} step={setStep} hanleOrder={handleOrder} loading={orderLoad}/>
        </DialogContent>:<OrderStatus/>
        }
      </BootstrapDialog>
  );
}

export default MyCart;
