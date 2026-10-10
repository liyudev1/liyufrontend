import { useEffect, useState } from "react";
import { Alert, Box, Link } from "@mui/material";
import { AccountCircle, Lock, Phone } from "@mui/icons-material";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import api from "../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import AuthLayout, { AuthField, AuthSubmitButton } from "./AuthLayout";
import { brand } from "./brand";

// The old pattern also allowed a backslash by accident
const usernameRegex = /^[\w@.+-]+$/;

const SignUpSchema = z.object({
  username: z
    .string()
    .min(1, "Username is required")
    .regex(usernameRegex, { message: "Use only letters, numbers and _ @ + . -" }),
  phone: z
    .string()
    .length(10, "Phone must be exactly 10 digits")
    .regex(/^\d+$/, "Phone must contain only numbers"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const onlyDigits = (value) => value.replace(/\D/g, "").slice(0, 10);

// In a Telegram Mini App opened from the bot's private chat, the user's id is also the chat id.
// Returns null when the app is opened in a normal browser.
const getTelegramChatId = () => {
  const id = window.Telegram?.WebApp?.initDataUnsafe?.user?.id;
  return id ? String(id) : null;
};

function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const { control, handleSubmit, setError } = useForm({
    defaultValues: { username: "", phone: "", password: "" },
    resolver: zodResolver(SignUpSchema),
    mode: "onTouched", // show errors after a field is left, so the button never sits disabled
  });

  useEffect(() => {
    if (localStorage.getItem(ACCESS_TOKEN)) navigate("/");
  }, [navigate]);

  async function handleForm(data) {
    setLoading(true);
    setFormError("");
    // Only the old sign-in tokens are removed now. localStorage.clear() also wiped cached data.
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);

    const chatId = getTelegramChatId();

    let created = false;
    try {
      await api.post("create-user/", {
        is_delivery: false,
        ...data,
        username: data.username.trim(),
        ...(chatId ? { chat_id: chatId } : {}),
      });
      created = true;
      const resp = await api.post("api/token/", { username: data.username.trim(), password: data.password });
      localStorage.setItem(ACCESS_TOKEN, resp.data.access);
      localStorage.setItem(REFRESH_TOKEN, resp.data.refresh);
      navigate("/");
    } catch (error) {
      console.error("Registration failed:", error);
      if (created) {
        setFormError("Your account was created, but we couldn’t sign you in. Please log in.");
      } else if (error.response?.data?.username) {
        setError("username", { message: "This username is already taken" });
      } else if (!error.response) {
        setFormError("Couldn’t reach the server. Check your connection and try again.");
      } else {
        setFormError("We couldn’t create your account. Please check your details and try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Sign up to start ordering."
      footer={
        <>
          Already have an account?{" "}
          {/* Change "/login" if your login page lives at another path */}
          <Link component={RouterLink} to="/login" underline="hover" sx={{ fontWeight: 700, color: brand.primaryDark }}>
            Log in
          </Link>
        </>
      }
    >
      <Box component="form" noValidate onSubmit={handleSubmit(handleForm)} sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
        <AuthField control={control} name="username" label="Username" icon={<AccountCircle />} autoComplete="username" />
        <AuthField
          control={control}
          name="phone"
          label="Phone number"
          type="tel"
          icon={<Phone />}
          autoComplete="tel"
          hint="10 digits, for example 0912345678"
          onValueChange={onlyDigits}
          inputProps={{ inputMode: "numeric", maxLength: 10 }}
        />
        <AuthField
          control={control}
          name="password"
          label="Password"
          type="password"
          icon={<Lock />}
          autoComplete="new-password"
          hint="At least 8 characters"
        />

        {formError && (
          <Alert severity="error" sx={{ mb: 1.5, borderRadius: "12px" }}>
            {formError}
          </Alert>
        )}

        <AuthSubmitButton loading={loading} loadingText="Creating account…">
          Create account
        </AuthSubmitButton>
      </Box>
    </AuthLayout>
  );
}

export default Register;
