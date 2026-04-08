import { supabase } from "@/lib/supabase";
import { objectToFormData } from "./object-to-form-data";

export const fetchClient = async <T, U>(
  url: string,
  options: Omit<RequestInit, "body"> & { body?: T } = {},
): Promise<U> => {
  const headers = new Headers(options.headers);
  const { body, ...rest } = options;
  const requestOptions: RequestInit = rest;

  // Supabase session'dan token al
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const accessToken = session?.access_token;

  headers.set("Accept", "application/json");
  headers.set("X-Client-Type", "web");
  headers.set("X-Client-Version", import.meta.env.VITE_APP_VERSION || "1.0.0");

  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  if (!options.method) {
    requestOptions.method = "GET";
  }

  if (headers.get("Content-Type") === "multipart/form-data") {
    headers.delete("Content-Type");
    requestOptions.body = objectToFormData({ ...body });
  } else if (!headers.get("Content-Type")) {
    headers.set("Content-Type", "application/json");
    if (body) {
      if (requestOptions.method?.toUpperCase() === "GET") {
        const [baseUrl, queryString] = url.split("?");
        const existingParams = new URLSearchParams(queryString);
        const newParams = new URLSearchParams();

        Object.entries(body as Record<string, unknown>).forEach(
          ([key, value]) => {
            if (value !== undefined && value !== null) {
              if (Array.isArray(value)) {
                newParams.set(key, value.join(","));
              } else {
                newParams.set(key, String(value));
              }
            }
          },
        );

        existingParams.forEach((value, key) => {
          newParams.set(key, value);
        });

        url = `${baseUrl}?${newParams.toString()}`;
      } else {
        requestOptions.body = JSON.stringify(body);
      }
    }
  }

  requestOptions.headers = headers;

  const response = await fetch(url, requestOptions);

  if (response.status === 401) {
    // Supabase session'ı yenile ve tekrar dene
    const {
      data: { session: newSession },
    } = await supabase.auth.refreshSession();
    if (newSession) {
      return fetchClient(url, options);
    }
    throw new Error("Unauthorized");
  }

  if (response.status < 200 || response.status >= 400) {
    throw new Error("Failed to fetch data");
  }

  const contentType = response.headers.get("content-type");
  if (contentType?.includes("application/json")) {
    return response.json() as Promise<U>;
  }

  return response as unknown as Promise<U>;
};
