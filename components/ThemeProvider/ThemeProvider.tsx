import { NextPage } from "next";
import React, { useEffect } from "react";
import { useState, useContext } from "react";

interface Theme {
  primary: string;
  secondary: string;
  accent: string;
}
//Create context with useless data

const ThemeContext = React.createContext<Theme>({
  primary: "green",
  secondary: "blue",
  accent: "white",
});
const ThemeUpdateContext = React.createContext((theme: Theme) => {});

export function useTheme() {
  return useContext(ThemeContext);
}

export function useUpdateTheme() {
  return useContext(ThemeUpdateContext);
}

export const ThemeProvider: NextPage = (props) => {
  //Sets theme
  const [theme, setTheme] = useState({
    primary: "#121212",
    secondary: "rgba(255, 255, 255, 0.7)",
    accent: "#5a13a1",
  });

  //Updates Theme
  function updateTheme(theme: Theme) {
    setTheme(theme);
  }

  return (
    <ThemeContext.Provider value={theme}>
      <ThemeUpdateContext.Provider value={updateTheme}>
        {props.children}
      </ThemeUpdateContext.Provider>
    </ThemeContext.Provider>
  );
};
