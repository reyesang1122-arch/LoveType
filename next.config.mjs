import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const projectRoot = dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  // Pin file-tracing to this project (a stray lockfile lives in the parent dir).
  outputFileTracingRoot: projectRoot,
};

export default nextConfig;
