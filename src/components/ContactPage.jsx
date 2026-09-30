import { useState } from "react";
import { Alert, Box, Button, CircularProgress, Link, Snackbar, TextField, Typography } from "@mui/material";
import { PhoneOutlined, Send } from "@mui/icons-material";
import api from "../api";
import { Header } from "./HomePage";
import BottomNav from "./BottomNav";
import { brand } from "./brand";

const PHONE_NUMBERS = ["0956769920", "0777454599", "0949016815"];

const cardSx = {
  boxSizing: "border-box",
  p: { xs: 2.5, sm: 3 },
  backgroundColor: brand.card,
  border: `1px solid ${brand.line}`,
  borderRadius: `${brand.radius}px`,
};

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "12px",
    backgroundColor: brand.card,
    "&.Mui-focused fieldset": { borderColor: brand.primary },
  },
  "& label.Mui-focused": { color: brand.primaryDark },
};

function ContactUs() {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState("");
  const [messageError, setMessageError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null); // { severity, text }

  async function handleSubmit(e) {
    e.preventDefault();
    if (loading) return;

    if (!message.trim()) {
      setMessageError(true);
      return;
    }

    setLoading(true);
    try {
      await api.post("contact-us/", {
        name: name.trim(),
        contact: contact.trim(),
        message: message.trim(),
      });
      // Only clear the form once the message was really sent
      setName("");
      setContact("");
      setMessage("");
      setToast({ severity: "success", text: "Message sent. Thank you!" });
    } catch (error) {
      console.error("Error while submitting message", error);
      setToast({ severity: "error", text: "Couldn’t send your message. Please try again." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box
      sx={{
        boxSizing: "border-box",
        minHeight: "100dvh",
        width: "100%",
        backgroundColor: brand.bg,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Header />

      <Box
        component="main"
        sx={{
          boxSizing: "border-box",
          flex: 1,
          width: "100%",
          maxWidth: 1000,
          mx: "auto",
          px: { xs: 2, sm: 3 },
          pt: { xs: 11, sm: 12 },
          pb: 12, // room for the bottom navigation
        }}
      >
        <Typography component="h1" sx={{ fontSize: { xs: 26, sm: 32 }, fontWeight: 800, letterSpacing: "-0.5px", color: brand.ink }}>
          Contact us
        </Typography>
        <Typography sx={{ mt: 0.5, mb: 3, color: brand.muted }}>Questions or feedback? Call us or send a message.</Typography>

        <Box sx={{ display: "grid", gap: 2.5, gridTemplateColumns: { xs: "1fr", md: "1fr 1.3fr" }, alignItems: "start" }}>
          {/* Phone numbers */}
          <Box sx={{ ...cardSx, minWidth: 0 }}>
            <Typography sx={{ mb: 2, fontWeight: 700, color: brand.ink }}>Call us</Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}>
              {PHONE_NUMBERS.map((phone) => (
                <Link
                  key={phone}
                  href={`tel:${phone}`}
                  underline="none"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    p: 1.25,
                    borderRadius: "14px",
                    color: brand.ink,
                    border: `1px solid ${brand.line}`,
                    transition: "border-color 0.2s, background-color 0.2s",
                    "&:hover": { borderColor: brand.primary, backgroundColor: brand.tint },
                  }}
                >
                  <Box sx={{ width: 40, height: 40, borderRadius: "12px", display: "grid", placeItems: "center", backgroundColor: brand.tint, color: brand.primaryDark }}>
                    <PhoneOutlined />
                  </Box>
                  <Typography sx={{ fontSize: 18, fontWeight: 700, letterSpacing: "0.3px" }}>{phone}</Typography>
                </Link>
              ))}
            </Box>
          </Box>

          {/* Message form */}
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ ...cardSx, display: "flex", flexDirection: "column", gap: 2, minWidth: 0 }}>
            <Typography sx={{ fontWeight: 700, color: brand.ink }}>Send us a message</Typography>

            <TextField fullWidth label="Your name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} sx={fieldSx} />
            <TextField fullWidth label="Phone or email" value={contact} onChange={(e) => setContact(e.target.value)} sx={fieldSx} />
            <TextField
              fullWidth
              required
              multiline
              minRows={5}
              label="Your message"
              value={message}
              error={messageError}
              helperText={messageError ? "Please write a message before sending." : " "}
              onChange={(e) => {
                setMessage(e.target.value);
                if (messageError) setMessageError(false);
              }}
              sx={fieldSx}
            />

            <Button
              type="submit"
              variant="contained"
              disableElevation
              disabled={loading}
              startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <Send />}
              sx={{ py: 1.4, borderRadius: 999, fontSize: 16, fontWeight: 700, textTransform: "none", backgroundColor: brand.primary, "&:hover": { backgroundColor: brand.primaryDark } }}
            >
              {loading ? "Sending…" : "Send message"}
            </Button>
          </Box>
        </Box>
      </Box>

      <BottomNav />

      <Snackbar open={!!toast} autoHideDuration={5000} onClose={() => setToast(null)} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        {toast ? (
          <Alert severity={toast.severity} variant="filled" onClose={() => setToast(null)} sx={{ width: "100%" }}>
            {toast.text}
          </Alert>
        ) : undefined}
      </Snackbar>
    </Box>
  );
}

export default ContactUs;
