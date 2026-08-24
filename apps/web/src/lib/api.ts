const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://prebunk-api-nctr.onrender.com";

export async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultHeaders = {
    "Content-Type": "application/json",
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  let response;
  try {
    response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options?.headers,
      },
      signal: options?.signal || controller.signal,
    });
  } finally {
    clearTimeout(timeoutId);
  }

  if (!response.ok) {
    let errorMsg = `API request failed: ${response.status} ${response.statusText}`;
    try { 
        const errData = await response.json(); 
        errorMsg = errData.detail || errorMsg; 
    } catch {}
    throw new Error(errorMsg);
  }

  return response.json();
}
