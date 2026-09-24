import * as React from 'react';
import { Box, Button, Checkbox, CircularProgress, FormControlLabel, IconButton, Input, InputAdornment, Link, Stack, Typography } from '@mui/material';
import { AccountCircle, Lock, Visibility, VisibilityOff } from '@mui/icons-material';
import { Login as LoginIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import api from '../api';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants';

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

function Login() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = React.useState(false);
    const [loginField,setLoginField] = React.useState(false)
    const [loading, setLoading] = React.useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);
  
    const handleMouseDownPassword = (event) => {
      event.preventDefault();
    };
  
    const handleMouseUpPassword = (event) => {
      event.preventDefault();
    };

    const { control, handleSubmit, formState: { errors } } = useForm({
      defaultValues: {
        username: '',
        password: ''
      }
    });

    async function handleForm(data){
      setLoading(true)
      try{
          const resp = await api.post('api/token/',data);
          localStorage.setItem(ACCESS_TOKEN,resp.data.access)
          localStorage.setItem(REFRESH_TOKEN,resp.data.refresh)
          navigate("/")
      }catch(error){
          console.log(error)
      }finally{
        setLoginField(true)
        setLoading(false)
      }
  }

    return (
        <Box sx={{
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
        }}>
            <Box sx={{
                position: 'relative', 
                zIndex: 3, 
                display: 'flex',
                flexDirection: "column",
                gap: 1,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: "white",                     
                width: "100%",
                maxWidth: "450px",
                boxShadow: 4,
                borderRadius: 5,
                py: 4,
                px: 3,
                overflow: "hidden"
            }}>
              <Box 
                component="form" 
                onSubmit={handleSubmit(handleForm)} 
                gap={2} 
                display="flex" 
                flexDirection="column" 
                justifyContent="center"
                width="100%"
              >
                <img style={{alignSelf:"center"}} width={110} height={110} src='/takeaway-takeawayfood2.gif' alt="Delivery App" />
                <Typography 
                    sx={{
                        color: "primary.main",
                        // textAlign: 'center',
                        alignSelf:"center",
                        fontWeight: 'bold',
                        fontSize: 22
                    }}
                >
                    Liyu Delivery
                </Typography>

                <Stack width="100%" spacing={8} mt={3}>
                  <Box width="100%">
                    <Controller 
                      name="username" 
                      control={control}
                      rules={{ required: 'Username is required' }}
                      render={({ field }) => (
                        <Input
                          {...field}
                          sx={{ fontSize: 18, width: '100%' }}
                          id="username-input"
                          type="text"
                          placeholder='Username'
                          startAdornment={
                            <InputAdornment position="start">
                              <AccountCircle sx={{ color: 'primary.main' }} />
                            </InputAdornment>
                          }
                          error={!!errors.username}
                        />
                      )} 
                  />
                     {errors.username && (
                        <Typography color="error" variant="caption" sx={{ mt: 0.5, display: 'block' }}>
                            {errors.username.message}
                        </Typography>
                      )}
                        {loginField && (
                        <Typography color="error" variant="caption" sx={{ mt: 0.5, display: 'block' }}>
                            Invalid username or password. Please try again.
                        </Typography>
                      )}
                    </Box>
                  <Box width="100%">
                    <Controller 
                      name="password" 
                      control={control}
                      rules={{ required: 'Password is required' }}
                      render={({ field }) => (
                        <Input
                          {...field}
                          sx={{ fontSize: 18, width: '100%' }}
                          id="password-input"
                          type={showPassword ? 'text' : 'password'}
                          placeholder='Password'
                          startAdornment={
                            <InputAdornment position="start">
                              <Lock sx={{ color: 'primary.main' }} />
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
                          error={!!errors.password}
                        />
                      )} 
                    />
                     {errors.username && (
                        <Typography color="error" variant="caption" sx={{ mt: 0.5, display: 'block' }}>
                            {errors.username.message}
                        </Typography>
                      )}
                    </Box>
                </Stack>

                <Box display="flex" width="100%" mt={1}>
                  <FormControlLabel
                    control={<Checkbox />}
                    label="Remember me"
                    labelPlacement="end"
                  />
                </Box>

                <Box mt={4} gap={2} width="100%" display="flex" flexDirection="column"> 
                  <LoginButton loading={loading} />
                  <Typography alignSelf="center">
                    Don't have an account? <Link href="/register" >Register</Link>
                  </Typography>
                </Box>
              </Box>
            </Box>
        </Box>
    );
}

export default Login;