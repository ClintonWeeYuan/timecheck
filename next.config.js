/** @type {import('next').NextConfig} */

const {
  PHASE_DEVELOPMENT_SERVER,
  PHASE_PRODUCTION_BUILD,
} = require("next/constants");

module.exports = (phase) => {
  reactStrictMode = true;
  const isDev = phase === PHASE_DEVELOPMENT_SERVER;
  const isProd = phase === PHASE_PRODUCTION_BUILD;

  const env = {
    APP_URL: (() => {
      if (isDev) return "http://localhost:3000";
      if (isProd) return "https://timecheck.vercel.app";
    })(),
  };
  return {
    env,
  };
};
