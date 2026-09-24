import { 
    Box, 
    Button, 
    Divider, 
    Stack, 
    Typography, 
    useTheme,
    CircularProgress,
    Chip,
    Paper
  } from "@mui/material"
  import { 
    ExpandLess, 
    ExpandMore, 
    LocationOn, 
    ShoppingCartOutlined, 
    Star,
    StarHalf,
    StarBorder 
  } from "@mui/icons-material"
  import { Header } from "./HomePage"
  import HoverRating from "./RatingButton"
  import { Swiper, SwiperSlide } from 'swiper/react'
  import { Autoplay, Pagination, Navigation } from 'swiper/modules'
  import 'swiper/css'
  import 'swiper/css/pagination'
  import 'swiper/css/navigation'
  import 'swiper/css/autoplay'
  import { useEffect, useState } from "react"
  import { useParams } from "react-router-dom"
  import api from "../api"
  import { useCart } from "./CartFunc"
  import AmountControl from "./AmountControl"
  import MyCart from "./MyCart"
  

  const MAX_DESCRIPTION_CHARS = 300
  const SWIPER_AUTOPLAY_DELAY = 5000
  const NOTIFICATION_DURATION = 10000
  

  function ProductDescription({ text, maxChars = MAX_DESCRIPTION_CHARS }) {
    const [isExpanded, setIsExpanded] = useState(false)
    const canExpand = text?.length > maxChars
    const displayText = canExpand && !isExpanded 
      ? `${text.substring(0, maxChars)}...`
      : text || 'No description available'
  
    return (
      <Box>
        <Typography 
          sx={{ 
            fontSize: { xs: 14, md: 16 }, 
            color: "text.secondary",
            lineHeight: 1.6
          }}
        >
          {displayText}
        </Typography>
        {canExpand && (
          <Button
            size="small"
            onClick={() => setIsExpanded(!isExpanded)}
            startIcon={isExpanded ? <ExpandLess /> : <ExpandMore />}
            sx={{ 
              mt: 1, 
              textTransform: "capitalize",
              color: "primary.main"
            }}
          >
            {isExpanded ? 'Read Less' : 'Read More'}
          </Button>
        )}
      </Box>
    )
  }
  
  function ProductImageGallery({ images, productName }) {
    const theme = useTheme()
    
    if (!images?.length) {
      return (
        <Box
          sx={{
            width: '100%',
            height: 300,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'grey.100',
            borderRadius: 2
          }}
        >
          <Typography color="text.secondary">
            No images available
          </Typography>
        </Box>
      )
    }
  
    if (images.length === 1) {
      return (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            p: 2
          }}
        >
          <img
            src={`${import.meta.env.VITE_BACKEND_HOST}${images[0]?.image}`}
            alt={productName}
            style={{
              width: '100%',
              maxWidth: 400,
              height: 'auto',
              maxHeight: 400,
              objectFit: 'contain',
              borderRadius: 12
            }}
            onError={(e) => {
              e.target.src = '/default-image.jpg'
            }}
          />
        </Box>
      )
    }
  
    return (
      <Box sx={{ 
        position: 'relative',
        '& .swiper': {
          width: '100%',
          borderRadius: 12,
          overflow: 'hidden'
        },
        '& .swiper-slide': {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        },
        '& .swiper-pagination-bullet': {
          width: 8,
          height: 8,
          backgroundColor: 'white',
          opacity: 0.5,
          '&:hover': { opacity: 0.8 },
        },
        '& .swiper-pagination-bullet-active': {
          backgroundColor: theme.palette.primary.main,
          opacity: 1,
          transform: 'scale(1.2)'
        }
      }}>
        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          pagination={{ clickable: true }}
          autoplay={{
            delay: SWIPER_AUTOPLAY_DELAY,
            disableOnInteraction: false,
            pauseOnMouseEnter: true
          }}
          loop={images.length > 1}
          speed={600}
          grabCursor={true}
          className="product-swiper"
        >
          {images.map((image, index) => (
            <SwiperSlide key={image.id || index}>
              <img
                src={`${import.meta.env.VITE_BACKEND_HOST}${image?.image}`}
                alt={image.alt || `${productName} - Image ${index + 1}`}
                style={{
                  width: '100%',
                  height: 300,
                  objectFit: 'cover'
                }}
                loading="lazy"
                onError={(e) => {
                  e.target.src = '/default-image.jpg'
                }}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>
    )
  }
  
  function RatingDisplay({ rating = 0 }) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Stack direction="row" spacing={0.2}>
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              sx={{
                fontSize: 20,
                color: star <= Math.floor(rating) ? 'warning.main' : 'grey.300'
              }}
            />
          ))}
        </Stack>
        <Typography sx={{ fontSize: 16, fontWeight: 500, ml: 0.5 }}>
          {rating}
        </Typography>
        <Typography sx={{ fontSize: 14, color: 'text.secondary' }}>
          Rating
        </Typography>
      </Box>
    )
  }
  
  function LoadingState() {
    return (
      <Box sx={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'grey.50'
      }}>
        <CircularProgress size={60} thickness={4} />
        <Typography sx={{ mt: 3, fontSize: 18, color: 'text.secondary' }}>
          Loading product details...
        </Typography>
      </Box>
    )
  }
  
  function ProductDetail() {
    const theme = useTheme()
    const { product_slug } = useParams()
    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [openCart, setOpenCart] = useState(false)
    const [cartStep, setCartStep] = useState(1)
    const { addToCart, isItemInCart } = useCart()
  
    const productId = product?.id
  
    useEffect(() => {
      const fetchProduct = async () => {
        try {
          setLoading(true)
          setError(null)
          const response = await api.get(`product-detail/${product_slug}`)
          setProduct(response.data)
        } catch (err) {
          console.error("Error fetching product:", err)
          setError("Failed to load product details. Please try again.")
        } finally {
          setLoading(false)
        }
      }
  
      fetchProduct()
    }, [product_slug])
  
    const handleAddToCart = () => {
      addToCart(product)
    }
  
    const handleOpenCart = () => {
      addToCart(product)
      setOpenCart(true)
    }
  
    const handleCloseCart = () => {
      setOpenCart(false)
      setCartStep(1)
    }
  
    if (loading) {
      return <LoadingState />
    }
  
    if (error || !product) {
      return (
        <Box sx={{
          minHeight: '100dvh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'grey.50',
          p: 3,
        }}>
          <Header />
          <Paper elevation={0} sx={{ p: 4, textAlign: 'center', maxWidth: 400}}>
            <Typography color="error" sx={{ fontSize: 18, mb: 2 }}>
              {error || 'Product not found'}
            </Typography>
            <Button 
              variant="contained" 
              onClick={() => window.history.back()}
            >
              Go Back
            </Button>
          </Paper>
        </Box>
      )
    }
  
   
    const {
      images = [],
      name: productName = 'Product',
      location: productLocation = 'Location not specified',
      rate: productRate = 0,
      price: productPrice = 0,
      description: productDescription = '',
      delivery_fee: productDeliveryFee = 0
    } = product
  
    const serviceFee = 10
    const totalPrice = productPrice + serviceFee + productDeliveryFee
  
    return (
      <Box sx={{
        minHeight: '100dvh',
        bgcolor: 'grey.50',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <Header />
  
        <MyCart 
          product={product} 
          step={cartStep} 
          setStep={setCartStep}
          open={openCart} 
          handleClose={handleCloseCart}
        />
  
        <Box sx={{
          flex: 1,
          maxWidth: 800,
          width: '100%',
          mx:"auto",
          py: { xs: 2, md: 4 },
          px: {  md: 4 },
          mt:6
        }}>
          <Paper 
            elevation={0}
            sx={{
              p: { xs: 2, sm: 3 },
              borderRadius: 3,
              bgcolor: 'white',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
            }}
          >
            <ProductImageGallery 
              images={images} 
              productName={productName} 
            />
  
            <Box sx={{ mt: 3, mb: 2 }}>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 700,
                  fontSize: { xs: 24, sm: 28 },
                  color: 'text.primary'
                }}
              >
                {productName}
              </Typography>
              
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                mt: 1
              }}>
                <RatingDisplay rating={productRate} />
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <LocationOn color="primary" sx={{ fontSize: 20 }} />
                  <Typography sx={{ fontSize: 14, color: 'text.secondary' }}>
                    {productLocation}
                  </Typography>
                </Box>
              </Box>
            </Box>
  
            <Divider sx={{ my: 2 }} />
  
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Price Details
              </Typography>
              <Stack spacing={1.5}>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <Typography color="text.secondary">Subtotal:</Typography>
                  <Typography>{productPrice.toFixed(2)} ETB</Typography>
                </Box>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <Typography color="text.secondary">Delivery Fee:</Typography>
                  <Typography>{productDeliveryFee.toFixed(2)} ETB</Typography>
                </Box>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <Typography color="text.secondary">Service Fee (8%):</Typography>
                  <Typography>{serviceFee.toFixed(2)} ETB</Typography>
                </Box>
                <Divider />
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Total:
                  </Typography>
                  <Typography 
                    variant="h5" 
                    color="primary" 
                    sx={{ fontWeight: 700 }}
                  >
                    {totalPrice.toFixed(2)} ETB
                  </Typography>
                </Box>
              </Stack>
            </Box>
  
            <Divider sx={{ my: 2 }} />
  
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Description
              </Typography>
              <ProductDescription 
                text={productDescription} 
                maxChars={MAX_DESCRIPTION_CHARS}
              />
            </Box>
  

            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Rate this Product
              </Typography>
              <HoverRating />
            </Box>
  
            <Box sx={{
              display: 'flex',
              gap: 2,
              justifyContent: 'space-between',
              alignItems: 'center',
              pt: 2,
              borderTop: `1px solid ${theme.palette.divider}`
            }}>
              {isItemInCart(productId) ? (
                <AmountControl item={product} />
              ) : (
                <Button
                  onClick={handleAddToCart}
                  startIcon={<ShoppingCartOutlined />}
                  variant="contained"
                  size="large"
                  sx={{
                    minWidth: {xs:140,md:200},
                    borderRadius: 2,
                    py: {xs:1,md:1.5},
                    fontWeight: 600,
                    fontSize: {xs:14,md:16},
                    bgcolor: 'success.main',
                    '&:hover': {
                      bgcolor: 'success.dark'
                    }
                  }}
                >
                  Add to Cart
                </Button>
              )}
              
              <Button
                variant="contained"
                size="large"
                onClick={handleOpenCart}
                sx={{
                  minWidth:{xs:140,md:200},
                  borderRadius: 2,
                  py: {xs:1,md:1.5},
                  fontWeight: 600,
                  fontSize: {xs:14,md:16},
                  bgcolor: '#FF8C00',
                  '&:hover': {
                    bgcolor: '#FFC107'
                  }
                }}
              >
                Order Now
              </Button>
            </Box>
          </Paper>
        </Box>
      </Box>
    )
  }
  
  export default ProductDetail

  
