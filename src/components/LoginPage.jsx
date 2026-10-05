import { useState } from "react";
import { Alert, Box, Link } from "@mui/material";
import { AccountCircle, Lock } from "@mui/icons-material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import api from "../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import AuthLayout, { AuthField, AuthSubmitButton } from "./AuthLayout";
import { brand } from "./brand";

function getLoginError(error) {
  const status = error.response?.status;
  if (!error.response) return "Couldn’t reach the server. Check your connection and try again.";
  if (status === 400 || status === 401) return "Incorrect username or password. Please try again.";
  return "Something went wrong on our side. Please try again in a moment.";
}

function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const { control, handleSubmit } = useForm({
    defaultValues: { username: "", password: "" },
  });

  async function handleForm(data) {
    setLoading(true);
    setFormError("");
    try {
      const resp = await api.post("api/token/", { username: data.username.trim(), password: data.password });
      localStorage.setItem(ACCESS_TOKEN, resp.data.access);
      localStorage.setItem(REFRESH_TOKEN, resp.data.refresh);
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);
      setFormError(getLoginError(error));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Log in to continue ordering."
      footer={
        <>
          Don’t have an account?{" "}
          <Link component={RouterLink} to="/register" underline="hover" sx={{ fontWeight: 700, color: brand.primaryDark }}>
            Register
          </Link>
        </>
      }
    >
      <Box component="form" noValidate onSubmit={handleSubmit(handleForm)} sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
        <AuthField
          control={control}
          name="username"
          label="Username"
          icon={<AccountCircle />}
          autoComplete="username"
          rules={{ required: "Username is required" }}
        />
        <AuthField
          control={control}
          name="password"
          label="Password"
          type="password"
          icon={<Lock />}
          autoComplete="current-password"
          rules={{ required: "Password is required" }}
        />

        {formError && (
          <Alert severity="error" sx={{ mb: 1.5, borderRadius: "12px" }}>
            {formError}
          </Alert>
        )}

        <AuthSubmitButton loading={loading} loadingText="Signing in…">
          Log in
        </AuthSubmitButton>
      </Box>
    </AuthLayout>
  );
}

export default Login;
