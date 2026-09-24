import { Box, Link, styled, Typography } from "@mui/material"

const LinkStyled = styled(Link)(({theme})=>({
    position: "relative",
    color: "#000",
    textDecoration: "none",
    '&:hover':{
        color: "#000"
    },
    '&::before':{
        content: '""',
        position:"absolute",
        display: "block",
        width: "100%",
        height: "2px",
        bottom: "0",
        left: "0",
        backgroundColor: "#000",
        transform: "scaleX(0)",
        transition: "transform 0.3s ease",
    },
    '&:hover::before':{
        transform: 'scaleX(1)',
    }
}))


function TopNav(){
    return (
        <Box display={{xs:"none",md:"flex"}} gap={5}>
            <LinkStyled href="/" underline="none" color="black"><Typography fontSize={19}>Home</Typography></LinkStyled>
            <LinkStyled href="/my-order" underline="none" color="black"><Typography fontSize={19}>My Order</Typography></LinkStyled>
            <LinkStyled href="/contact" underline="none" color="black"><Typography fontSize={19}>Contact</Typography></LinkStyled>
            <LinkStyled href="/logout" underline="none" color="black"><Typography fontSize={19}>Logout</Typography></LinkStyled>
        </Box>
    )
}

export default TopNav