export function getApiBaseUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_SERVER_DOMAIN || "";

  if (typeof window === "undefined") {
    return configuredUrl;
  }

  const currentHostIsLocal =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1";

  const configuredUrlIsLocal =
    configuredUrl.includes("localhost") ||
    configuredUrl.includes("127.0.0.1");

  if (!currentHostIsLocal && configuredUrlIsLocal) {
    return "";
  }

  return configuredUrl;
}
