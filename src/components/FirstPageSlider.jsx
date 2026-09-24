import React from 'react';
import { Box, useTheme } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

// Sample images - replace with your actual images
const images = [
  {
    id: 1,
    src: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
    alt: 'Mountain Landscape'
  },
  {
    id: 2,
    src: 'https://images.unsplash.com/photo-1519681393784-d120267933ba',
    alt: 'Night Sky'
  },
  {
    id: 3,
    src: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470',
    alt: 'Lake View'
  }
];

const FullPageSlider = () => {
  const theme = useTheme();

  const sliderStyles = {
    height: '100dvh',
    width: '100vw',
    position: 'fixed', // This prevents scrolling
    top: 0,
    left: 0,
    overflow: 'hidden',
    '& .swiper': {
      width: '100%',
      height: '100%',
    },
    '& .swiper-slide': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      height: '100%',
    },
    '& .swiper-pagination': {
      bottom: '30px !important', // Increased bottom spacing
      zIndex: 10,
    },
    '& .swiper-pagination-bullet': {
      width: '10px',
      height: '10px',
      backgroundColor: 'white',
      opacity: 0.5,
      margin: '0 6px !important',
      '&:hover': {
        opacity: 0.8,
      },
    },
    '& .swiper-pagination-bullet-active': {
      backgroundColor: theme.palette.primary.main,
      opacity: 1,
    },
  };

  const imageStyles = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  };

  return (
    <Box sx={sliderStyles}>
      <Swiper
        modules={[Autoplay, Pagination]}
        pagination={{
          clickable: true,
          dynamicBullets: false,
        }}
        autoplay={{
          delay: 1000,
          disableOnInteraction: false,
        }}
        loop={true}
        speed={800}
        touchRatio={1}
        resistance={true}
        resistanceRatio={0.85}
        preventInteractionOnTransition={true}
        shortSwipes={true}
        longSwipes={true}
        followFinger={true}
      >
        {images.map((image) => (
          <SwiperSlide key={image.id}>
            <img
              src={image.src}
              alt={image.alt}
              style={imageStyles}
              loading="lazy"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
};

export default FullPageSlider;