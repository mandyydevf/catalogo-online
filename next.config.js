/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Libera o carregamento de imagens vindas do Supabase Storage.
    // Troque "SEU-PROJETO" pelo nome do seu projeto Supabase quando configurar.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

module.exports = nextConfig;
