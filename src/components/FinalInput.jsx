import { memo } from "react";
import { Box, Button, Link, Step, StepConnector, StepLabel, Stepper, Typography } from "@mui/material";
import { Check, CheckCircle, PhoneOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { brand } from "./brand";

const STEPS = ["Cart", "Delivery", "Done"];
const SUPPORT_PHONES = ["0956769920", "0777454599"];

function StepIcon({ active, completed }) {
  const filled = active || completed;
  return (
    <Box
      sx={{
        boxSizing: "border-box",
        width: 24,
        height: 24,
        zIndex: 1,
        display: "grid",
        placeItems: "center",
        borderRadius: "50%",
        color: "#fff",
        backgroundColor: filled ? brand.primary : brand.card,
        border: `2px solid ${filled ? brand.primary : brand.line}`,
      }}
    >
      {completed ? (
        <Check sx={{ fontSize: 15 }} />
      ) : active ? (
        <Box sx={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#fff" }} />
      ) : null}
    </Box>
  );
}

const connectorSx = {
  "& .MuiStepConnector-line": { borderColor: brand.line, borderTopWidth: 3, borderRadius: 1 },
  "&.Mui-active .MuiStepConnector-line, &.Mui-completed .MuiStepConnector-line": { borderColor: brand.primary },
};

const labelSx = {
  "& .MuiStepLabel-label": {
    mt: 0.75,
    fontSize: 13,
    fontWeight: 600,
    color: brand.muted,
    "&.Mui-active, &.Mui-completed": { color: brand.ink },
  },
};

function OrderProgress({ step }) {
  // Once the order is placed (last step) every step shows as completed
  const activeStep = step >= STEPS.length - 1 ? STEPS.length : step;

  return (
    <Stepper alternativeLabel activeStep={activeStep} connector={<StepConnector sx={connectorSx} />} sx={{ px: 2, py: 2 }}>
      {STEPS.map((label) => (
        <Step key={label}>
          <StepLabel StepIconComponent={StepIcon} sx={labelSx}>
            {label}
          </StepLabel>
        </Step>
      ))}
    </Stepper>
  );
}

export function OrderStatus() {
  const navigate = useNavigate();

  return (
    <Box sx={{ textAlign: "center", px: 3, py: 5 }}>
      <Box
        sx={{
          width: 76,
          height: 76,
          mx: "auto",
          mb: 2,
          display: "grid",
          placeItems: "center",
          borderRadius: "50%",
          backgroundColor: "#DDF5E5",
          color: "#13693A",
        }}
      >
        <CheckCircle sx={{ fontSize: 46 }} />
      </Box>

      <Typography component="h2" sx={{ fontSize: 24, fontWeight: 800, color: brand.ink }}>
        Order placed!
      </Typography>
      <Typography sx={{ mt: 0.75, color: brand.muted }}>
        Your order has been successfully placed. You can follow its status in My Orders.
      </Typography>

      <Button
        variant="contained"
        disableElevation
        onClick={() => navigate("/my-order")}
        sx={{ mt: 3, px: 4, py: 1.25, borderRadius: 999, fontWeight: 700, textTransform: "none", backgroundColor: brand.primary, "&:hover": { backgroundColor: brand.primaryDark } }}
      >
        View my orders
      </Button>

      <Typography sx={{ mt: 4, mb: 1, fontSize: 13.5, color: brand.muted }}>Need help? Call us</Typography>
      <Box sx={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 2.5 }}>
        {SUPPORT_PHONES.map((phone) => (
          <Link
            key={phone}
            href={`tel:${phone}`}
            underline="hover"
            sx={{ display: "inline-flex", alignItems: "center", gap: 0.75, fontSize: 17, fontWeight: 700, color: brand.ink }}
          >
            <PhoneOutlined sx={{ fontSize: 20, color: brand.primary }} />
            {phone}
          </Link>
        ))}
      </Box>
    </Box>
  );
}

export default memo(OrderProgress);
