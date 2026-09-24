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
  Typography,
  Alert,
  Paper,
  Fade
} from '@mui/material';
import {
  AccountCircle,
  Lock,
  Visibility,
  VisibilityOff,
  Login as LoginIcon,
  DeliveryDining
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import api from '../api';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants';

// Validation schema
const loginSchema = z.object({
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username must be less than 50 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  password: z.string()
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password is too long')
});

const LoginButton = ({
  loading = false,
  disabled = false,
  fullWidth = true,
  size = 'large',
  children = 'Login'
}) => {
  return (
    <Button
      variant="contained"
      fullWidth={fullWidth}
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
          <LoginIcon />
        )
      }
    >
      {loading ? 'Signing In...' : children}
    </Button>
  );
};

function DeliveryLogin() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [rememberMe, setRememberMe] = React.useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    setFocus
  } = useForm({
    defaultValues: {
      username: '',
      password: ''
    },
    resolver: zodResolver(loginSchema),
    mode: 'onChange'
  });

  // Auto-focus username field on mount
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setFocus('username');
    }, 100);
    return () => clearTimeout(timer);
  }, [setFocus]);

  // Check for saved credentials
  React.useEffect(() => {
    const savedUsername = localStorage.getItem('delivery_username');
    if (savedUsername) {
      // In a real app, you might want to use a more secure method
      // This is just for remembering the username
      // You could integrate with react-hook-form's setValue
      // setValue('username', savedUsername);
      // setRememberMe(true);
    }
  }, []);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleForm = async (data) => {
    setLoading(true);
    setError('');

    try {
      const resp = await api.post('api/token/', data);
      
      // Store tokens
      localStorage.setItem(ACCESS_TOKEN, resp.data.access);
      localStorage.setItem(REFRESH_TOKEN, resp.data.refresh);
      
      // Remember username if checked
      if (rememberMe) {
        localStorage.setItem('delivery_username', data.username);
      } else {
        localStorage.removeItem('delivery_username');
      }

      // Add a small delay for better UX
      setTimeout(() => {
        navigate("/delivery-home");
      }, 500);

    } catch (error) {
      console.error('Login error:', error);
      
      // Better error handling
      if (error.response) {
        switch (error.response.status) {
          case 401:
            setError('Invalid username or password. Please try again.');
            break;
          case 429:
            setError('Too many login attempts. Please wait and try again.');
            break;
          case 500:
            setError('Server error. Please try again later.');
            break;
          default:
            setError('Login failed. Please check your credentials.');
        }
      } else if (error.request) {
        setError('Network error. Please check your connection.');
      } else {
        setError('An unexpected error occurred.');
      }
      
      // Shake animation on error (optional)
      const form = document.querySelector('form');
      form.classList.add('shake-animation');
      setTimeout(() => form.classList.remove('shake-animation'), 500);
      
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && isValid) {
      handleSubmit(handleForm)();
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: '100dvh',
        width: '100vw',
        position: 'fixed',
        top: 0,
        left: 0,
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        overflow: 'hidden',
    }}
    >
      <Fade in={true} timeout={500}>
        <Paper
          elevation={24}
          sx={{
            position: 'relative',
            zIndex: 2,
            display: 'flex',
            flexDirection: "column",
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: "white",
            width: "100%",
            maxWidth: "450px",
            borderRadius: 4,
            py: { xs: 3, sm: 4 },
            px: { xs: 3, sm: 4 },
            overflow: "hidden",
            border: '1px solid rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            // animation: 'float 3s ease-in-out infinite',
            // '@keyframes float': {
            //   '0%, 100%': { transform: 'translateY(0)' },
            //   '50%': { transform: 'translateY(-10px)' }
            // }
          }}
        >
          <Box
            component="form"
            onSubmit={handleSubmit(handleForm)}
            onKeyPress={handleKeyPress}
            gap={2}
            display="flex"
            flexDirection="column"
            justifyContent="center"
            width="100%"
            sx={{
              '&.shake-animation': {
                animation: 'shake 0.5s',
                '@keyframes shake': {
                  '0%, 100%': { transform: 'translateX(0)' },
                  '25%': { transform: 'translateX(-5px)' },
                  '75%': { transform: 'translateX(5px)' }
                }
              }
            }}
          >

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


            {error && (
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 2,
                  borderRadius: 2,
                  '& .MuiAlert-icon': {
                    alignItems: 'center'
                  }
                }}
                onClose={() => setError('')}
              >
                {error}
              </Alert>
            )}

            <Stack width="100%" spacing={3} mt={2}>

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
                  PASSWORD
                </Typography>
                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      autoComplete="current-password"
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
                      id="password-input"
                      type={showPassword ? 'text' : 'password'}
                      placeholder='Enter your password'
                      startAdornment={
                        <InputAdornment position="start">
                          <Lock sx={{ color: 'primary.main' }} />
                        </InputAdornment>
                      }
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            disabled={loading}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      }
                      error={!!errors.password}
                      disabled={loading}
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


            <Box display="flex" justifyContent="space-between" alignItems="center" width="100%" mt={1}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    disabled={loading}
                    size="small"
                  />
                }
                label={
                  <Typography variant="body2" color="text.secondary">
                    Remember me
                  </Typography>
                }
                labelPlacement="end"
              />
              <Link
                href="#" 
                variant="body2"
                sx={{
                  color: 'primary.main',
                  textDecoration: 'none',
                  fontWeight: 500,
                  '&:hover': {
                    textDecoration: 'underline'
                  }
                }}
              >
                Forgot password?
              </Link>
            </Box>


            <Box mt={4} gap={2} width="100%" display="flex" flexDirection="column">
              <LoginButton 
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
                  href="/delivery-register"
                  sx={{
                    color: 'primary.main',
                    fontWeight: 600,
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline'
                    }
                  }}
                >
                  Register here
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Fade>
    </Box>
  );
}

export default DeliveryLogin;