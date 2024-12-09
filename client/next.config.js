/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  env:{
    NEXT_PUBLIC_ZEGO_APP_ID:226993451,
    NEXT_PUBLIC_ZEGO_SERVER_ID:"96fbabdac277e512890d3618f3e3a9d8"
  },
  images:{
    domains:["localhost"],
  }
};

module.exports = nextConfig;
