import { Typography, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { alpha, styled } from '@mui/material/styles';
import React from 'react';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: '25px',
  backgroundColor: "#DEDEDE",
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  maxWidth: 600,
  overflowX:"auto",
  '&::-webkit-scrollbar': { display: 'none' }, 
  scrollbarWidth: 'none', // Firefox,
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 2,
}));

const StyledInputBase = styled('input')(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  position: 'relative',
  backgroundColor: 'transparent',
  border: 'none',
  outline: 'none',
  padding: '16px',
  paddingLeft: '60px',
  fontSize: '20px',
  zIndex: 1,
}));

const PlaceholderWrapper = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '60px',
  transform: 'translateY(-50%)',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  zIndex: 0,
  overflowX:"auto"
}));


function SearchComponent() {
  const [searchValue, setSearchValue] = React.useState('');

  return (
    <Search sx={{ width: '100%', maxWidth: 600, backgroundColor: "#DEDEDE" }}>
      <SearchIconWrapper>
        <SearchIcon sx={{ fontSize: 44 }} />
      </SearchIconWrapper>
      
      <StyledInputBase
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        placeholder=" " 
        inputProps={{ 'aria-label': 'search' }}
      />
      
      {!searchValue && (
        <PlaceholderWrapper>
          <Typography 
            component="span" 
            sx={{ 
              fontSize: '20px', 
              color: 'black',
              fontWeight: 550,
            }}
          >
            Search
          </Typography>
          <Typography 
            component="span" 
            sx={{ 
              fontSize: '20px', 
              color: 'gray',
              textWrap:"nowrap"
            }}
          >
            Anything…
          </Typography>
        </PlaceholderWrapper>
      )}
    </Search>
  );
}

export default SearchComponent