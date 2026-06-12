import { NextRequest } from "next/server";

function resolveUrl(relative: string, base: string): string {
  try {
    return new URL(relative, base).href;
  } catch {
    return relative;
  }
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const targetUrl = searchParams.get("url");

  if (!targetUrl) {
    return Response.json({ error: "Missing 'url' parameter" }, { status: 400 });
  }

  try {
    const upstreamHeaders: Record<string, string> = {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36",
      "Accept": "*/*",
      "Accept-Language": "en-US,en;q=0.9",
    };

    const rangeHeader = request.headers.get("range");
    if (rangeHeader) {
      upstreamHeaders["Range"] = rangeHeader;
    }

    try {
      const parsedTarget = new URL(targetUrl);
      upstreamHeaders["Referer"] = parsedTarget.origin + "/";
      upstreamHeaders["Origin"] = parsedTarget.origin;
    } catch {
      console.warn("Proxy: unable to parse target URL for Referer/Origin headers:", targetUrl);
    }

    const response = await fetch(targetUrl, {
      headers: upstreamHeaders,
      signal: AbortSignal.timeout(9000),
      redirect: "follow",
    });

    if (!response.ok && response.status !== 206) {
      return Response.json(
        { error: `Failed to fetch from target URL (Status ${response.status})` },
        { status: response.status }
      );
    }

    const contentType = response.headers.get("content-type") || "";

    const isM3U8 =
      contentType.toLowerCase().includes("mpegurl") ||
      contentType.toLowerCase().includes("mpeg-url") ||
      targetUrl.toLowerCase().split(/[?#]/)[0].endsWith(".m3u8") ||
      targetUrl.toLowerCase().split(/[?#]/)[0].endsWith(".m3u");

    if (isM3U8) {
      const text = await response.text();
      const cleanText = text.charCodeAt(0) === 0xFEFF ? text.slice(1) : text;
      const lines = cleanText.split(/\r?\n/);
      const forwardedHost = request.headers.get("x-forwarded-host");
      const forwardedProto = request.headers.get("x-forwarded-proto");
      const host = request.headers.get("host");

      let resolvedOrigin = origin;
      if (forwardedProto && forwardedHost) {
        resolvedOrigin = `${forwardedProto.split(",")[0].trim()}://${forwardedHost.split(",")[0].trim()}`;
      } else if (host) {
        const isHttps = request.url.startsWith("https://") || 
                        request.headers.get("x-forwarded-ssl") === "on";
        const proto = isHttps ? "https" : "http";
        resolvedOrigin = `${proto}://${host.split(",")[0].trim()}`;
      }

      const proxyBaseUrl = `${resolvedOrigin}/api/iptv/proxy`;

      const rewrittenLines = lines.map((line) => {
        const trimmed = line.trim();
        if (!trimmed) return line;

        if (trimmed.startsWith("#")) {
          return line.replace(
            /URI=(?:"([^"]+)"|'([^']+)'|([^,\s]+))/g,
            (match, qDouble, qSingle, unquoted) => {
              const uri = qDouble || qSingle || unquoted;
              if (!uri) return match;
              const resolved = resolveUrl(uri, targetUrl);
              return `URI="${proxyBaseUrl}?url=${encodeURIComponent(resolved)}"`;
            }
          );
        } else {
          const resolved = resolveUrl(trimmed, targetUrl);
          return `${proxyBaseUrl}?url=${encodeURIComponent(resolved)}`;
        }
      });

      return new Response(rewrittenLines.join("\n") + "\n", {
        status: 200,
        headers: {
          "Content-Type": "application/vnd.apple.mpegurl",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "Range",
          "Access-Control-Expose-Headers": "Content-Range, Content-Length",
          "Cache-Control": "no-cache, no-store, must-revalidate",
        },
      });
    } else {
      const headers: Record<string, string> = {
        "Content-Type": contentType || "application/octet-stream",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Range",
        "Access-Control-Expose-Headers": "Content-Range, Content-Length, Accept-Ranges",
      };

      const contentLength = response.headers.get("content-length");
      if (contentLength) {
        headers["Content-Length"] = contentLength;
      }

      const contentRange = response.headers.get("content-range");
      if (contentRange) {
        headers["Content-Range"] = contentRange;
      }

      const acceptRanges = response.headers.get("accept-ranges");
      if (acceptRanges) {
        headers["Accept-Ranges"] = acceptRanges;
      }

      const cacheControl = response.headers.get("cache-control");
      if (cacheControl) {
        headers["Cache-Control"] = cacheControl;
      } else {
        headers["Cache-Control"] = "public, max-age=3600";
      }

      const buffer = await response.arrayBuffer();

      return new Response(buffer, {
        status: response.status,
        headers,
      });
    }
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      return Response.json(
        { error: "Upstream server timed out (9s)" },
        { status: 504 }
      );
    }
    console.error("Proxy error:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to fetch from target URL";
    const errorCause = error instanceof Error && error.cause ? String(error.cause) : undefined;
    return Response.json(
      { error: errorMessage, cause: errorCause },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Range, Content-Type",
      "Access-Control-Expose-Headers": "Content-Range, Content-Length, Accept-Ranges",
      "Access-Control-Max-Age": "86400",
    },
  });
}
