import { NextPage } from "next";
import React, { useEffect } from "react";
import { useState, useContext } from "react";

interface Theme {
  primary: string;
  secondary: string;
  neutral: string;
}
//Create context with useless data

const ThemeContext = React.createContext<Theme>({
  primary: "green",
  secondary: "blue",
  neutral: "white",
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
    primary: "green",
    secondary: "blue",
    neutral: "black",
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
