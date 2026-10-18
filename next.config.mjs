/** Assets stay on their original host; this local rewrite avoids CORS without
 * checking third-party images or fonts into the source repository. */
const githubPages = process.env.GITHUB_PAGES === "true";
const config = {
  poweredByHeader: false,
  ...(githubPages
    ? {
        output: "export",
        basePath: process.env.PAGES_BASE_PATH || "/holdingtotal-study",
        trailingSlash: true,
      }
    : {
        async rewrites() {
          return [
            {
              source: "/source-assets/:asset*",
              destination: "https://holdingtotal.com.br/imersao/:asset*",
            },
          ];
        },
        async headers() {
          return [
            {
              source: "/:path*",
              headers: [
                { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
              ],
            },
          ];
        },
    }),
};
export default config;
