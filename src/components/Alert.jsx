import { Alert, Button } from "@mui/material";
import { Link } from "react-router-dom";

function OrderAlert(){
    return (
        <Alert
            sx={{
                zIndex: 2000,
                position: "fixed",
            }}
            severity="success"
            action={
                <Link to="/my-order" style={{ textDecoration: 'none' }}>
                    <Button color="inherit" size="small">
                        status
                    </Button>
                </Link>
            }
        >
            Your Order is Successfully Placed. Keep Track
        </Alert>
    )
}

export default OrderAlert;