const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://prebunk-api-nctr.onrender.com";

export async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultHeaders = {
    "Content-Type": "application/json",
  };

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }

  return response.json();
}
