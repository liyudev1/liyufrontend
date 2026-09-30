import { memo, useCallback, useEffect, useRef, useState } from "react";
import { IconButton, InputAdornment, InputBase } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { brand } from "./brand";

/**
 * The input keeps its own state so typing is always instant.
 * Only the debounced value is sent up through `onSearchChange`.
 */
function SearchComponent({
  onSearchChange,
  placeholder = "Search anything…",
  delay = 250,
}) {
  const [value, setValue] = useState("");
  const timerRef = useRef(null);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const emit = useCallback(
    (next, immediate = false) => {
      clearTimeout(timerRef.current);
      if (immediate) {
        onSearchChange?.(next);
        return;
      }
      timerRef.current = setTimeout(() => onSearchChange?.(next), delay);
    },
    [onSearchChange, delay]
  );

  const handleChange = (e) => {
    setValue(e.target.value);
    emit(e.target.value);
  };

  const handleClear = () => {
    setValue("");
    emit("", true);
  };

  return (
    <InputBase
      fullWidth
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      inputProps={{ "aria-label": "Search", enterKeyHint: "search" }}
      startAdornment={
        <InputAdornment position="start" sx={{ color: brand.muted, mr: 1.5 }}>
          <SearchIcon />
        </InputAdornment>
      }
      endAdornment={
        value ? (
          <InputAdornment position="end">
            <IconButton size="small" aria-label="Clear search" onClick={handleClear}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </InputAdornment>
        ) : null
      }
      sx={{
        width: "100%",
        maxWidth: 640,
        px: 2,
        py: 0.75,
        fontSize: 17,
        color: brand.ink,
        backgroundColor: brand.card,
        border: `1px solid ${brand.line}`,
        borderRadius: `${brand.radius}px`,
        transition: "border-color 0.2s, box-shadow 0.2s",
        "&.Mui-focused": {
          borderColor: brand.primary,
          boxShadow: `0 0 0 4px ${brand.tint}`,
        },
      }}
    />
  );
}

export default memo(SearchComponent);
