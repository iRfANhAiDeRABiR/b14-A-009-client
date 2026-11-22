"use client";

import * as React from "react";
import { ThemeContext } from "@/context/ThemeProvider";

export function useTheme() {
  return React.useContext(ThemeContext);
}
