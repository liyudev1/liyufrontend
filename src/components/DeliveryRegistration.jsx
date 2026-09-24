import * as React from 'react';
import { 
    Box, 
    Button, 
    Checkbox, 
    CircularProgress, 
    FormControlLabel, 
    IconButton, 
    Input, 
    InputAdornment, 
    Link, 
    Stack, 
    Typography 
} from '@mui/material';
import { AccountCircle, DeliveryDining, Lock, Phone, Telegram, Visibility, VisibilityOff } from '@mui/icons-material';
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import z from "zod"
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants';
import api from '../api';
import { useNavigate } from 'react-router-dom';

const usernameRegex = /^[a-zA-Z0-9_@.+\\-]+$/;

const SignUpSchema = z.object({
    username: z.string().regex(usernameRegex, {
        message: "Username may only contain alphanumeric characters, _, @, +, ., and -",
    }),
    phone: z.string()
        .min(10, "Phone must be exactly 10 characters")
        .max(10, "Phone must be exactly 10 characters")
        .regex(/^\d+$/, "Phone must contain only numbers"),
    password: z.string().min(8, "Password must be more than 8 characters!"),
    chat_id: z.string()
})

const RegisterButton = ({
  loading = false,
  disabled = false,
  fullWidth = true,
  size = 'large',
  children = 'Register'
}) => {
  return (
    <Button
      variant="contained"
      fullWidth={fullWidth}
      size={size}
      disabled={disabled || loading}
      type='submit'
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
        ) : null
      }
    >
      {loading ? 'Creating Account...' : children}
    </Button>
  );
};

function DeliveryRegister() {
    const [userExist,setUserExist] = React.useState(false)
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    console.log("API:", import.meta.env.VITE_BACKEND_HOST);

    React.useEffect(() => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (token) {
            navigate('/');
        }
    }, [navigate]);
    const handleClickShowPassword = () => setShowPassword((show) => !show);
  
    const handleMouseDownPassword = (event) => {
      event.preventDefault();
    };
  
    const handleMouseUpPassword = (event) => {
      event.preventDefault();
    };

    async function handleForm(data) {
      console.log("Form submitted", data);
      setLoading(true);
      localStorage.clear();
      
      try {
          await api.post('create-user/', {is_delivery:true,...data});
          const resp = await api.post('api/token/', data);
          localStorage.setItem(ACCESS_TOKEN, resp.data.access);
          localStorage.setItem(REFRESH_TOKEN, resp.data.refresh);
          console.log("Registration successful");
          navigate("/delivery-home");
      } catch(error) {
          console.log("Registration failed:", error);
          // Add user-friendly error message display here
          setUserExist(true)
      } finally {
          setLoading(false);
      }
    }

    const { control, handleSubmit, formState: { errors, isValid } } = useForm({
      defaultValues: {
        username: '',
        phone: '',
        password: ''
      },
      resolver: zodResolver(SignUpSchema),
      mode: "onChange"
    });

    return (
        <Box sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: '100vh',
          width: '100vw',
          background: '#F0F0F0',
          position: 'relative',
          overflow: 'hidden',
        }}>
            <Box component="form" onSubmit={handleSubmit(handleForm)} sx={{
                position: 'relative', 
                zIndex: 3, 
                display: 'flex',
                flexDirection:"column",
                gap: 1,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor:"white",                     
                width: "100%",
                maxWidth:"450px",
                boxShadow: 4,
                borderRadius: 5,
                py: 4,
                px: 3,
                overflow:"hidden"
            }}>
              <Box gap={2} display="flex" flexDirection="column" justifyContent="center" alignItems="center">
                {/* <img width={110} height={110} src='/takeaway-takeawayfood2.gif' alt="Delivery App" /> */}
                <Box display="flex" justifyContent="center" alignItems="center" gap={2} flexDirection="column" mb={2}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)'
                }}
              >
                <DeliveryDining sx={{ fontSize: 48, color: 'white' }} />
              </Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  textAlign: 'center',
                  lineHeight: 1.2
                }}
              >
                Delivery Partner
                <Typography
                  component="span"
                  display="block"
                  variant="subtitle1"
                  sx={{
                    fontWeight: 400,
                    color: 'text.secondary',
                    mt: 0.5
                  }}
                >
                  Sign in to your account
                </Typography>
              </Typography>
            </Box>

              </Box>
              
                <Stack width="100%" spacing={5} mt={3}>
                  <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, fontWeight: 600 }}>
                    USERNAME
                  </Typography>
                  <Controller
                    name="username"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        autoComplete="username"
                        sx={{
                          fontSize: 16,
                          width: '100%',
                          '&::before': {
                            borderBottom: '2px solid #e0e0e0'
                          },
                          '&:hover:not(.Mui-disabled):before': {
                            borderBottom: '2px solid #667eea'
                          }
                        }}
                        id="username-input"
                        type="text"
                        placeholder='Enter your username'
                        startAdornment={
                          <InputAdornment position="start">
                            <AccountCircle sx={{ color: 'primary.main' }} />
                          </InputAdornment>
                        }
                        error={!!errors.username}
                        disabled={loading}
                      />
                    )}
                  />
                  {errors.username && (
                    <Typography color="error" variant="caption" sx={{ mt: 0.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      {errors.username.message}
                    </Typography>
                  )}
                </Box>
                <Box>
                <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, fontWeight: 600 }}>
                  CHAT ID
                </Typography>
                <Controller
                  name="chat_id"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      autoComplete="chat_id"
                      sx={{
                        fontSize: 16,
                        width: '100%',
                        '&::before': {
                          borderBottom: '2px solid #e0e0e0'
                        },
                        '&:hover:not(.Mui-disabled):before': {
                          borderBottom: '2px solid #667eea'
                        }
                      }}
                      id="chat_id-input"
                      type="text"
                      placeholder='Enter your chat_id'
                      startAdornment={
                        <InputAdornment position="start">
                          <Telegram sx={{ color: 'primary.main' }} />
                        </InputAdornment>
                      }
                      error={!!errors.chat_id}
                      disabled={loading}
                    />
                  )}
                />
                {errors.chat_id && (
                  <Typography color="error" variant="caption" sx={{ mt: 0.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    {errors.chat_id.message}
                  </Typography>
                )}
                </Box>
                  <Box>
                <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, fontWeight: 600 }}>
                  PHONE
                </Typography>
                <Controller
                  name="phone"
                  control={control}
                  render={({ field }) => (
                    <Input
                    {...field}
                    sx={{fontSize:18, width: '100%'}}
                    id="standard-adornment-phone"
                    type="tel"
                    placeholder='Phone'
                    error={!!errors.phone}
                    onChange={(e) => {
                        // Remove non-numeric characters
                        const value = e.target.value.replace(/\D/g, '');
                        field.onChange(value);
                    }}
                    startAdornment={
                        <InputAdornment position="start">
                          <Phone sx={{color: errors.phone ? 'error.main' : 'primary.main'}}/>
                        </InputAdornment>
                    }
                />
                  )}
                />
                {errors.phone && (
                  <Typography color="error" variant="caption" sx={{ mt: 0.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    {errors.phone.message}
                  </Typography>
                )}
                </Box>
                <Box>
                <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, fontWeight: 600 }}>
                  PASSWORD
                </Typography>
                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <Input 
                    {...field}
                    sx={{fontSize:18, width: '100%'}}
                    id="standard-adornment-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder='Password'
                    error={!!errors.password}
                    startAdornment={
                        <InputAdornment position="start">
                          <Lock sx={{color: errors.password ? 'error.main' : 'primary.main'}} />
                        </InputAdornment>
                    }
                    endAdornment={
                    <InputAdornment position="end">
                        <IconButton
                        aria-label={
                            showPassword ? 'hide the password' : 'display the password'
                        }
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        onMouseUp={handleMouseUpPassword}
                        >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    </InputAdornment>
                    }
                />
                  )}
                />
                {errors.password && (
                  <Typography color="error" variant="caption" sx={{ mt: 0.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    {errors.password.message}
                  </Typography>
                )}
                </Box>
                </Stack>

                <Box display="flex" width="100%" mt={1}>
                    <FormControlLabel
                        value="end"
                        control={<Checkbox />}
                        label="Remember me"
                        labelPlacement="end"
                    />
                </Box>

               <Box mt={4} gap={2} width="100%" display="flex" flexDirection="column"> 
                <RegisterButton 
                  loading={loading}
                  disabled={!isValid || loading}
                />
              <Box sx={{ display: 'flex', alignItems: 'center', my: 2 }}>
                <Box sx={{ flex: 1, height: '1px', backgroundColor: 'divider' }} />
                <Typography variant="body2" sx={{ px: 2, color: 'text.secondary' }}>
                  OR
                </Typography>
                <Box sx={{ flex: 1, height: '1px', backgroundColor: 'divider' }} />
              </Box>
              
              <Typography variant="body2" textAlign="center" color="text.secondary">
                Don't have an account?{' '}
                <Link
                  href="/delivery-login"
                  sx={{
                    color: 'primary.main',
                    fontWeight: 600,
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline'
                    }
                  }}
                >
                  Login here
                </Link>
              </Typography>
               </Box>
            </Box>
        </Box>
    );
}

export default DeliveryRegister;
