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
import { AccountCircle, Lock, Phone, Visibility, VisibilityOff } from '@mui/icons-material';
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

function Register() {
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
          await api.post('create-user/', {is_delivery:false,...data});
          const resp = await api.post('api/token/', data);
          localStorage.setItem(ACCESS_TOKEN, resp.data.access);
          localStorage.setItem(REFRESH_TOKEN, resp.data.refresh);
          console.log("Registration successful");
          navigate("/");
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
            height: '100dvh',
            width: '100vw',
            position: 'fixed',
            top: 0,
            left: 0,
            backgroundColor:"#DEDEDE",
            overflow: 'hidden',
            '@media (max-width: 768px)': {
                '&::before': {
                    backgroundSize: "cover",
                    backgroundPosition: "center center",
                    backgroundAttachment: "scroll",
                }
            }
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
                <img width={110} height={110} src='/takeaway-takeawayfood2.gif' alt="Delivery App" />
                <Typography 
                      sx={{
                          color: "primary.main",
                          textAlign: 'center',
                          fontWeight: 'bold',
                          fontSize: 22
                      }}
                  >
                     Liyu Delivery
                  </Typography>
              </Box>
              
                <Stack width="100%" spacing={6} mt={3}>
                  <Box width="100%">
                    <Controller 
                      name="username" 
                      control={control} 
                      render={({field}) => (
                        <Input {...field}
                            sx={{fontSize:18, width: '100%'}}
                            id="standard-adornment-username"
                            type="text"
                            placeholder='Username'
                            error={!!errors.username}
                            startAdornment={
                                <InputAdornment position="start">
                                  <AccountCircle sx={{color: errors.username ? 'error.main' : 'primary.main'}}/>
                                </InputAdornment>
                            }
                        />
                      )} 
                    />
                    {errors.username && (
                      <Typography color="error" variant="caption" sx={{ mt: 0.5, display: 'block' }}>
                          {errors.username.message}
                      </Typography>
                    )}
                    {userExist && (
                      <Typography color="error" variant="caption" sx={{ mt: 0.5, display: 'block' }}>
                         Username already exists
                      </Typography>
                    )}
                  </Box>

                  <Box width="100%">
                    <Controller 
                      name="phone" 
                      control={control} 
                      render={({field}) => (
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
                      <Typography color="error" variant="caption" sx={{ mt: 0.5, display: 'block' }}>
                          {errors.phone.message}
                      </Typography>
                    )}
                  </Box>


                  <Box width="100%">
                    <Controller 
                      name="password" 
                      control={control} 
                      render={({field}) => (
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
                      <Typography color="error" variant="caption" sx={{ mt: 0.5, display: 'block' }}>
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
                <Typography alignSelf="center">
                  Already have an account? <Link href="#" underline="hover">Login</Link>
                </Typography>
               </Box>
            </Box>
        </Box>
    );
}

export default Register;
