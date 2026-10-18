import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // دعم RTL والعربية
  i18n: undefined, // سيُضاف لاحقاً مع i18n كامل

  // إعدادات الأمان
  headers: async () => {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },

  // منع تسريب معلومات الخادم
  serverExternalPackages: ["@prisma/client", "prisma"],

  // لا stack traces للمستخدم
  productionBrowserSourceMaps: false,
};

export default nextConfig;
