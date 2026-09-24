import React, { useEffect} from 'react';
import { Box, Button, CircularProgress, TextField } from '@mui/material';
import api from '../api';

const OrderButton = ({
  loading = false,
  hanleOrder,
  disabled = false,
  fullWidth = true,
  size = 'large',
  children = 'Order'
}) => {
  return (
    <Button
      variant="contained"
      fullWidth={fullWidth}
      onClick={hanleOrder}
      size={size}
      disabled={disabled || loading}
      type="submit"
      sx={{
        py: 1.5,
        fontSize: '1rem',
        fontWeight: 600,
        textTransform: 'none',
        borderRadius: 2,
        boxShadow: '0 4px 12px 0 rgba(0, 118, 255, 0.3)',
        background: 'linear-gradient(45deg, #1976d2, #2196f3)',
        '&:hover': {
          background: 'linear-gradient(45deg, #1565c0, #1976d2)',
          boxShadow: '0 6px 16px 0 rgba(0, 118, 255, 0.4)',
          transform: 'translateY(-1px)',
        },
        '&:active': {
          transform: 'translateY(0)',
        },
        '&:disabled': {
          background: '#e0e0e0',
          color: '#9e9e9e',
          boxShadow: 'none',
        },
        transition: 'all 0.2s ease-in-out',
      }}
      startIcon={
        loading ? (
          <CircularProgress size={20} sx={{ color: 'inherit' }} />
        ) : (
          null
        )
      }
    >
      {loading ? 'Placing Order...' : children}
    </Button>
  );
};


const AddressForm = ({special_instraction,setSpecialInstraction,phone,setPhone,shipping_address,setShippingAddress,hanleOrder,loading}) => {
    useEffect(()=>{
        async function getPhone(){
            const url = "get-profile/"
            const resp = await api.get(url)
            setPhone(resp.data.phone)
        }
        getPhone()
    },[])

  const handlePhoneChange = (event) => {
    setPhone(event.target.value)
  };

  const handleAddressChange = (event) => {
    setShippingAddress(event.target.value)
  };
  const handleInstractionChange = (event)=>{
    setSpecialInstraction(event.target.value)
  };

  return (
    <Box
      sx={{
        p: 3,
        maxWidth: 500,
        margin: '20px auto',
        border: '1px solid',
        borderColor: 'grey.300',
        borderRadius: 2,
        backgroundColor: 'white',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}
    >
      <TextField
        label="Phone Number"
        type="tel"
        value={phone}
        onChange={handlePhoneChange}
        placeholder="0912345678"
        fullWidth
        focused
        margin="normal"
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 1,
            '&:hover fieldset': {
              borderColor: 'primary.main',
            },
          }
        }}
      />
      
      <TextField
        label="Shipping Address"
        multiline
        rows={3}
        value={shipping_address}
        onChange={handleAddressChange}
        placeholder="Male Dorm B-368 R-28"
        fullWidth
        margin="normal"
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 1,
            '&:hover fieldset': {
              borderColor: 'primary.main',
            },
          }
        }}
      />
      <TextField
        label="Special Instraction (Optional)"
        multiline
        rows={3}
        value={special_instraction}
        onChange={handleInstractionChange}
        placeholder="Your Special Instraction"
        fullWidth
        margin="normal"
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 1,
            '&:hover fieldset': {
              borderColor: 'primary.main',
            },
          }
        }}
      />
      <OrderButton loading={loading} hanleOrder={hanleOrder}/>
    </Box>
  );
};

export default AddressForm;