import { useEffect, useState } from "react";
import { Box, Button, CircularProgress, TextField } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import api from "../api";
import { brand } from "./brand";

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "12px",
    backgroundColor: brand.card,
    "&.Mui-focused fieldset": { borderColor: brand.primary },
  },
  "& label.Mui-focused": { color: brand.primaryDark },
};

const digitsOnly = (value = "") => String(value).replace(/\D/g, "");

// Same props as before. `step` is the setStep function that MyCart passes in.
function AddressForm({
  special_instraction,
  setSpecialInstraction,
  phone,
  setPhone,
  shipping_address,
  setShippingAddress,
  hanleOrder,
  loading,
  step: setStep,
}) {
  const [errors, setErrors] = useState({});

  // Fill in the saved phone number, without overwriting something already typed
  useEffect(() => {
    if (phone) return;
    let cancelled = false;

    api
      .get("get-profile/")
      .then((resp) => {
        if (!cancelled && resp.data?.phone) setPhone((current) => current || resp.data.phone);
      })
      .catch((error) => console.error("Could not load the saved phone number", error));

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    if (loading) return;

    const next = {};
    if (digitsOnly(phone).length < 9) next.phone = "Enter a valid phone number.";
    if (!shipping_address?.trim()) next.address = "Tell us where to deliver.";

    setErrors(next);
    if (Object.keys(next).length === 0) hanleOrder();
  }

  return (
    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ boxSizing: "border-box", p: 2.5, display: "flex", flexDirection: "column", gap: 2 }}>
      <TextField
        label="Phone number"
        type="tel"
        autoComplete="tel"
        placeholder="0912345678"
        value={phone ?? ""}
        onChange={(e) => {
          setPhone(e.target.value);
          if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }));
        }}
        error={!!errors.phone}
        helperText={errors.phone || " "}
        disabled={loading}
        fullWidth
        sx={fieldSx}
      />

      <TextField
        label="Delivery address"
        autoComplete="street-address"
        placeholder="Male Dorm B-368 R-28"
        multiline
        minRows={3}
        value={shipping_address}
        onChange={(e) => {
          setShippingAddress(e.target.value);
          if (errors.address) setErrors((prev) => ({ ...prev, address: undefined }));
        }}
        error={!!errors.address}
        helperText={errors.address || " "}
        disabled={loading}
        fullWidth
        sx={fieldSx}
      />

      <TextField
        label="Special instructions (optional)"
        placeholder="e.g. Call me when you arrive"
        multiline
        minRows={3}
        value={special_instraction}
        onChange={(e) => setSpecialInstraction(e.target.value)}
        disabled={loading}
        fullWidth
        sx={fieldSx}
      />

      <Box sx={{ pt: 0.5 }}>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          disableElevation
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
          sx={{
            py: 1.4,
            borderRadius: 999,
            fontSize: 16,
            fontWeight: 700,
            textTransform: "none",
            backgroundColor: brand.primary,
            "&:hover": { backgroundColor: brand.primaryDark },
            "&.Mui-disabled": { backgroundColor: brand.line, color: brand.muted },
          }}
        >
          {loading ? "Placing order…" : "Place order"}
        </Button>

        {typeof setStep === "function" && (
          <Button
            fullWidth
            startIcon={<ArrowBack />}
            disabled={loading}
            onClick={() => setStep(0)}
            sx={{ mt: 0.75, py: 1, borderRadius: 999, textTransform: "none", fontWeight: 500, color: brand.muted }}
          >
            Back to cart
          </Button>
        )}
      </Box>
    </Box>
  );
}

export default AddressForm;
