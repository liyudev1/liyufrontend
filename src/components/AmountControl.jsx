import { Add, RemoveRounded } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";

import { useCart } from "./CartFunc";

function AmountControl({item,IconSize}){
    const {decreaseItem,getItemQuantity,addToCart} = useCart()
    const itemsQuantity = getItemQuantity(item.id)
    return (
        <Box sx={{
            display:"flex",
            alignItems:"center",
            gap:{xs:0.2,md:1}
        }}>
            <Button onClick={()=>decreaseItem(item.id)} size="small" sx={{backgroundColor:"red",minWidth: "auto",borderRadius: 2,}} variant="contained">
                <RemoveRounded fontSize={IconSize} />
            </Button>
            <Typography sx={{fontSize:{xs:18,md:22},fontWeight:600}}>{itemsQuantity}</Typography>
            <Button onClick={()=>addToCart(item)} size="small" variant="contained" sx={{backgroundColor:"red",minWidth: "auto",borderRadius: 2,}}>
                <Add fontSize={IconSize}/>
            </Button>
        </Box>
    )
}
export default AmountControl