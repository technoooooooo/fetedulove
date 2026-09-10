import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // sans ça, Turbopack remonte jusqu'au home et prend le mauvais lockfile
  turbopack: { root: path.resolve(".") },
};

export default nextConfig;
