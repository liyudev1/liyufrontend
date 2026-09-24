import * as React from 'react';
import { emphasize, styled } from '@mui/material/styles';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Chip from '@mui/material/Chip';
import { Restaurant } from '@mui/icons-material';
import { SubCategoryChangeContext } from './HomePage';
import useListReducer from './CategoryNavigationReducer';

const StyledBreadcrumb = styled(Chip)(({ theme }) => {
  return {
    backgroundColor: theme.palette.grey[100],
    height: theme.spacing(3),
    color: (theme.vars || theme).palette.text.primary,
    fontWeight: theme.typography.fontWeightRegular,
    '&:hover, &:focus': {
      backgroundColor: emphasize(theme.palette.grey[100], 0.06),
      ...theme.applyStyles('dark', {
        backgroundColor: emphasize(theme.palette.grey[800], 0.06),
      }),
    },
    '&:active': {
      boxShadow: theme.shadows[1],
      backgroundColor: emphasize(theme.palette.grey[100], 0.12),
      ...theme.applyStyles('dark', {
        backgroundColor: emphasize(theme.palette.grey[800], 0.12),
      }),
    },
    ...theme.applyStyles('dark', {
      backgroundColor: theme.palette.grey[800],
    }),
  };
}); 


export default function CustomizedBreadcrumbs({setCategory,category,clearList,removeItemsAfter,getAllItems}) {
  const handleSubCategory = React.useContext(SubCategoryChangeContext)
  function handleChange(item){
    removeItemsAfter(item.item_id)
    handleSubCategory(item.item_id)
  }
  function handleClickAll(category_name){
    let c_n = category.toLowerCase() === category?category_name.toUpperCase():category_name.toLowerCase()
    setCategory(c_n)
    clearList()
    setIsSub(false)
  }
  const items = getAllItems()
  console.log("items",items)
  return (
    <div style={{marginBottom:"30px"}} role="presentation">
      <Breadcrumbs aria-label="breadcrumb">
        <StyledBreadcrumb
          onClick={()=>handleClickAll(category)}
          label="Resaurants"
          icon={<Restaurant fontSize="small" />}
        />
        {items.map((item,index)=>{
                  return <StyledBreadcrumb key={index}
                  label={item.label} onClick={()=>handleChange(item)}
                />
        })}
        </Breadcrumbs>
    </div>
  );
}
