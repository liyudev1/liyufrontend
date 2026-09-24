import { HomeRounded, Logout, PersonOutlined, Restore } from "@mui/icons-material";
import { BottomNavigation, BottomNavigationAction, Paper } from "@mui/material";
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Sync value with current route
  const getValueFromPath = () => {
    switch (location.pathname) {
      case "/":
        return "home";
      case "/my-order":
        return "my-order";
      case "/contact":
        return "contact";
      default:
        return "home"; // default value
    }
  };

  const [value, setValue] = React.useState(getValueFromPath());

  React.useEffect(() => {
    setValue(getValueFromPath());
  }, [location.pathname]);

  function handleChange(event, newValue) {
    setValue(newValue);
    switch (newValue) {
      case "home":
        navigate("/");
        break;
      case "my-order":
        navigate("/my-order");
        break;
      case "contact":
        navigate("/contact");
        break;
      case "logout":
          navigate("/logout");
          break;
      default:
        break;
    }
  }

  return (
<Paper sx={{ display: { md: "none" }, py: 0.5, position: 'fixed', bottom: 15, left: 30, right: 30, borderRadius: 20 }} elevation={3}>
  <BottomNavigation
    showLabels
    value={value}
    onChange={handleChange}
    sx={{ 
      borderRadius: 20,
      '& .MuiBottomNavigationAction-label': {
        fontWeight: 600, 
      }
    }}
  >
    <BottomNavigationAction value="home" label="Home" icon={<HomeRounded sx={{ fontSize: 32 }} />} />
    <BottomNavigationAction value="my-order" label="My Order" icon={<Restore sx={{ fontSize: 32 }} />} />
    <BottomNavigationAction value="contact" label="Contact" icon={<PersonOutlined sx={{ fontSize: 32 }} />} />
    <BottomNavigationAction value="logout" label="Logout" icon={<Logout sx={{ fontSize: 32 }} />} />
  </BottomNavigation>
</Paper>
  );
}

export default BottomNav;