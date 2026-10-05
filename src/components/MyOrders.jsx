import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Skeleton,
  Snackbar,
  Typography,
} from "@mui/material";
import { Schedule, ShoppingCartCheckout } from "@mui/icons-material";
import api from "../api";
import { ACCESS_TOKEN } from "../constants";
import { Header } from "./HomePage";
import BottomNav from "./BottomNav";
import { brand } from "./brand";

const TABS = ["All", "pending", "confirmed", "delivered", "cancelled"];
const LOCKED_STATUSES = new Set(["confirmed", "delivered", "cancelled"]); // can't be cancelled any more
const CANCEL_TIMEOUT_MS = 10000; // stop the spinner if the server never answers
const RECONNECT_BASE_MS = 3000;
const RECONNECT_MAX_MS = 30000;
const MAX_REJECTED_ATTEMPTS = 5; // stop hammering the server when it keeps rejecting us
// Browsers can't send an Authorization header on a WebSocket, so the JWT goes in the query string.

function getToken() {
  try {
    return localStorage.getItem(ACCESS_TOKEN) || "";
  } catch {
    return "";
  }
}

const STATUS_STYLE = {
  pending: { bg: "#F1F2F4", color: "#4B5563" },
  confirmed: { bg: "#FFF1D6", color: "#8A5A00" },
  delivered: { bg: "#DDF5E5", color: "#13693A" },
  cancelled: { bg: "#FDE4E2", color: "#B42318" },
};
const DEFAULT_STATUS_STYLE = { bg: brand.tint, color: brand.primaryDark };

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});

function formatDate(iso) {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? "" : dateFormatter.format(date);
}

const sortNewestFirst = (list) =>
  [...list].sort((a, b) => (Date.parse(b.created_at) || 0) - (Date.parse(a.created_at) || 0));

/* ---------------------------------- Order --------------------------------- */

const Order = memo(function Order({ item, cancelling, onCancel }) {
  const status = String(item.status || "").toLowerCase();
  const statusStyle = STATUS_STYLE[status] || DEFAULT_STATUS_STYLE;
  const locked = LOCKED_STATUSES.has(status);
  const count = Number(item.item_count) || 0;

  return (
    <Box
      component="article"
      sx={{
        boxSizing: "border-box",
        minWidth: 0,
        p: 2,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        backgroundColor: brand.card,
        border: `1px solid ${brand.line}`,
        borderRadius: `${brand.radius}px`,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 1 }}>
        <Box sx={{ minWidth: 0 }}>
          <Typography noWrap sx={{ fontWeight: 700, fontSize: 17, color: brand.ink }}>
            Order #{item.order_number}
          </Typography>
          <Box sx={{ mt: 0.25, display: "flex", alignItems: "center", gap: 0.5, color: brand.muted }}>
            <ShoppingCartCheckout sx={{ fontSize: 16 }} />
            <Typography sx={{ fontSize: 13.5 }}>
              {count} {count === 1 ? "item" : "items"}
            </Typography>
          </Box>
        </Box>

        <Chip
          size="small"
          label={item.status}
          sx={{
            flexShrink: 0,
            height: 28,
            px: 0.5,
            fontWeight: 700,
            textTransform: "capitalize",
            backgroundColor: statusStyle.bg,
            color: statusStyle.color,
          }}
        />
      </Box>

      <Box sx={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 1 }}>
        <Typography sx={{ color: brand.muted, fontSize: 14 }}>Total</Typography>
        <Typography sx={{ fontWeight: 800, fontSize: 22, color: brand.ink }}>
          {Number(item.total_price || 0).toFixed(2)}
          <Box component="span" sx={{ ml: 0.5, fontSize: 13, fontWeight: 600, color: brand.muted }}>
            ETB
          </Box>
        </Typography>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 1.5 }}>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="outlined"
            color="error"
            disabled={locked || cancelling}
            onClick={() => onCancel(item)}
            startIcon={cancelling ? <CircularProgress size={16} color="inherit" /> : null}
            sx={{ borderRadius: 999, px: 2.25, fontWeight: 600, textTransform: "none" }}
          >
            {cancelling ? "Cancelling…" : "Cancel"}
          </Button>
          {/* Payment isn't available yet, so this stays disabled like before */}
          <Button
            variant="contained"
            disableElevation
            disabled
            sx={{ borderRadius: 999, px: 2.25, fontWeight: 600, textTransform: "none" }}
          >
            Pay now
          </Button>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: brand.muted }}>
          <Schedule sx={{ fontSize: 17 }} />
          <Typography sx={{ fontSize: 13.5 }}>{formatDate(item.created_at)}</Typography>
        </Box>
      </Box>
    </Box>
  );
});

/* ---------------------------------- Tabs ---------------------------------- */

const Tabs = memo(function Tabs({ category, setCategory, counts }) {
  return (
    <Box
      role="tablist"
      sx={{
        display: "flex",
        gap: 1,
        overflowX: "auto",
        py: 0.5,
        mb: 2.5,
        "&::-webkit-scrollbar": { display: "none" },
        scrollbarWidth: "none",
      }}
    >
      {TABS.map((tab) => {
        const active = category === tab;
        const count = counts[tab] ?? 0;
        return (
          <Button
            key={tab}
            role="tab"
            aria-selected={active}
            onClick={() => setCategory(tab)}
            disableElevation
            sx={{
              flexShrink: 0,
              px: 2.25,
              py: 0.9,
              borderRadius: 999,
              fontSize: 15,
              fontWeight: 600,
              textTransform: "capitalize",
              whiteSpace: "nowrap",
              border: `1px solid ${active ? brand.primary : brand.line}`,
              color: active ? "#fff" : brand.ink,
              backgroundColor: active ? brand.primary : brand.card,
              "&:hover": {
                backgroundColor: active ? brand.primaryDark : brand.tint,
                borderColor: brand.primary,
              },
            }}
          >
            {tab}
            {count > 0 && (
              <Box component="span" sx={{ ml: 0.75, opacity: active ? 0.9 : 0.6, fontWeight: 700 }}>
                {count}
              </Box>
            )}
          </Button>
        );
      })}
    </Box>
  );
});

function OrderSkeletons() {
  return [0, 1, 2].map((i) => (
    <Box key={i} sx={{ p: 2, borderRadius: `${brand.radius}px`, backgroundColor: brand.card, border: `1px solid ${brand.line}` }}>
      <Skeleton variant="text" sx={{ width: "45%", fontSize: 18 }} />
      <Skeleton variant="text" sx={{ width: "30%", fontSize: 14 }} />
      <Skeleton variant="rounded" height={36} sx={{ mt: 2, borderRadius: 999 }} />
    </Box>
  ));
}

/* --------------------------------- MyOrder -------------------------------- */

function MyOrder() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [category, setCategory] = useState("All");
  const [cancelTarget, setCancelTarget] = useState(null); // order waiting for confirmation
  const [cancellingIds, setCancellingIds] = useState({});
  const [notice, setNotice] = useState("");
  const socketRef = useRef(null);

  const loadOrders = useCallback(async () => {
    setLoadError(false);
    try {
      const result = await api.get("get-orders/");
      setOrders(sortNewestFirst(result.data));
    } catch (error) {
      console.error("Error while getting my-orders", error);
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  // One socket for the whole page. Reconnects with exponential backoff, and gives up after
  // repeated rejections (server says no) instead of retrying forever.
  useEffect(() => {
    let closedByUs = false;
    let retryTimer;
    let rejectedAttempts = 0;
    const host = import.meta.env.VITE_BACKEND_HOST || "";
    const protocol = host.startsWith("http://") ? "ws" : "wss";
    const baseUrl = `${protocol}://${host.replace(/^https?:\/\//, "")}/ws/livestatus/order-status/`;

    const connect = () => {
      clearTimeout(retryTimer);
      if (closedByUs) return;
      const token = getToken();
      const ws = new WebSocket(token ? `${baseUrl}?token=${encodeURIComponent(token)}` : baseUrl);
      socketRef.current = ws;
      let opened = false;

      ws.onopen = () => {
        opened = true;
        rejectedAttempts = 0;
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)?.data;
          if (!data?.id || !data?.status) return;
          setOrders((prev) => prev.map((o) => (o.id === data.id ? { ...o, status: data.status } : o)));
          setCancellingIds((prev) => {
            if (!prev[data.id]) return prev;
            const { [data.id]: _done, ...rest } = prev;
            return rest;
          });
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };

      ws.onerror = () => ws.close();

      ws.onclose = () => {
        if (closedByUs || socketRef.current !== ws) return;
        if (!opened) rejectedAttempts += 1;
        if (rejectedAttempts >= MAX_REJECTED_ATTEMPTS) {
          console.warn("Live order updates unavailable: the server keeps rejecting the WebSocket.");
          return; // resumes when the tab becomes visible again or the network comes back
        }
        const delay = Math.min(RECONNECT_BASE_MS * 2 ** rejectedAttempts, RECONNECT_MAX_MS);
        retryTimer = setTimeout(connect, delay + Math.random() * 1000);
      };
    };

    const resume = () => {
      if (closedByUs) return;
      const ws = socketRef.current;
      if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) return;
      rejectedAttempts = 0;
      connect();
    };
    const onVisible = () => document.visibilityState === "visible" && resume();

    connect();
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("online", resume);
    return () => {
      closedByUs = true;
      clearTimeout(retryTimer);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("online", resume);
      socketRef.current?.close();
    };
  }, []);

  const requestCancel = useCallback((order) => setCancelTarget(order), []);

  const confirmCancel = useCallback(() => {
    const order = cancelTarget;
    setCancelTarget(null);
    if (!order?.id) return;

    const ws = socketRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      setNotice("Connection lost. Reconnecting… please try again in a moment.");
      return;
    }

    ws.send(JSON.stringify({ type: "cancel_order", data: { status: "cancelled", order_id: order.id } }));
    setCancellingIds((prev) => ({ ...prev, [order.id]: true }));

    // If the server never replies, let the person try again
    setTimeout(() => {
      setCancellingIds((prev) => {
        if (!prev[order.id]) return prev;
        const { [order.id]: _timedOut, ...rest } = prev;
        return rest;
      });
    }, CANCEL_TIMEOUT_MS);
  }, [cancelTarget]);

  const counts = useMemo(() => {
    const result = { All: orders.length };
    for (const order of orders) {
      const key = String(order.status || "").toLowerCase();
      result[key] = (result[key] || 0) + 1;
    }
    return result;
  }, [orders]);

  const filteredOrders = useMemo(
    () => (category === "All" ? orders : orders.filter((o) => String(o.status || "").toLowerCase() === category)),
    [orders, category]
  );

  return (
    <Box
      sx={{
        boxSizing: "border-box",
        height: "100dvh",
        width: "100%",
        backgroundColor: brand.bg,
        overflowY: "auto",
        overflowX: "hidden",
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
          My orders
        </Typography>
        <Typography sx={{ mt: 0.5, mb: 2.5, color: brand.muted }}>
          {filteredOrders.length} order{filteredOrders.length === 1 ? "" : "s"}
        </Typography>

        <Tabs category={category} setCategory={setCategory} counts={counts} />

        {loading ? (
          <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" } }}>
            <OrderSkeletons />
          </Box>
        ) : loadError ? (
          <Box sx={{ py: 8, textAlign: "center" }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: brand.ink }}>
              Couldn’t load your orders
            </Typography>
            <Typography sx={{ mt: 0.5, mb: 2, color: brand.muted }}>Check your connection and try again.</Typography>
            <Button
              variant="contained"
              disableElevation
              onClick={() => {
                setLoading(true);
                loadOrders();
              }}
              sx={{ borderRadius: 999, px: 3, textTransform: "none", fontWeight: 600, backgroundColor: brand.primary, "&:hover": { backgroundColor: brand.primaryDark } }}
            >
              Try again
            </Button>
          </Box>
        ) : filteredOrders.length === 0 ? (
          <Box sx={{ py: 8, textAlign: "center" }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: brand.ink }}>
              No orders found
            </Typography>
            <Typography sx={{ mt: 0.5, color: brand.muted }}>
              {category === "All" ? "You haven’t placed any orders yet." : `You have no ${category} orders.`}
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" } }}>
            {filteredOrders.map((item) => (
              <Order key={item.id} item={item} cancelling={!!cancellingIds[item.id]} onCancel={requestCancel} />
            ))}
          </Box>
        )}
      </Box>

      <BottomNav />

      <Dialog open={!!cancelTarget} onClose={() => setCancelTarget(null)} PaperProps={{ sx: { borderRadius: `${brand.radius}px` } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>Cancel this order?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Order #{cancelTarget?.order_number} will be cancelled. This can’t be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setCancelTarget(null)} sx={{ textTransform: "none", fontWeight: 600, color: brand.ink }}>
            Keep order
          </Button>
          <Button onClick={confirmCancel} color="error" variant="contained" disableElevation sx={{ borderRadius: 999, textTransform: "none", fontWeight: 600 }}>
            Cancel order
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={!!notice} autoHideDuration={4000} onClose={() => setNotice("")} message={notice} />
    </Box>
  );
}

export default MyOrder;
