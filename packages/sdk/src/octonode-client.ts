import { createClient as createHttpClient } from "./gen/client";
import { OctonodeApi } from "./gen/sdk.gen";
import { CLOUD_API_URL } from "./constants";

export interface OctonodeClientOptions {
  url?: string;
  headers?: HeadersInit;
}

export class OctonodeClient extends OctonodeApi {
  constructor(token: string, url?: string, headers?: HeadersInit) {
    super({ client: createHttpClient({ throwOnError: true }) });
    this.configureOctonode(token, url, headers);
  }

  configureOctonode(
    token: string,
    url = CLOUD_API_URL,
    headers?: HeadersInit,
  ): void {
    if (!token.trim()) throw new Error("token is required");
    const baseUrl = new URL(url);
    if (baseUrl.protocol !== "https:" && baseUrl.protocol !== "http:") {
      throw new Error("url must use HTTP or HTTPS");
    }
    const requestHeaders = new Headers(headers);
    requestHeaders.set("authorization", `Bearer ${token}`);

    this.client.setConfig({
      baseUrl: baseUrl.href.replace(/\/$/, ""),
      headers: requestHeaders,
    });
  }
}

export function createClient(token: string, options: OctonodeClientOptions = {}): OctonodeClient {
  return new OctonodeClient(token, options.url, options.headers);
}
