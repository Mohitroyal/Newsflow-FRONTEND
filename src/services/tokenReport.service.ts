import axios from "axios";

export const TOKEN_API_BASE_URL =
  import.meta.env.VITE_TOKEN_API_URL || "https://carbontracer-demo.onrender.com";

const tokenApi = axios.create({
  baseURL: TOKEN_API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

export interface CreateTokenInput {
  token_code: string;
  reporter_name?: string;
}

export interface TokenResponse {
  id: string;
  token_code: string;
  reporter_name?: string;
  qr_url?: string;
  workbook_url?: string;
}

/** Creates a backend token and returns the generated QR/report links. */
export async function createReportToken(input: CreateTokenInput) {
  const response = await tokenApi.post<TokenResponse>("/api/tokens/", input);
  return response.data;
}

/** Returns the direct Excel URL encoded by the QR code. */
export function getWorkbookUrl(tokenId: string) {
  return `${TOKEN_API_BASE_URL}/api/tokens/${encodeURIComponent(tokenId)}/workbook.xlsx`;
}

export default tokenApi;
