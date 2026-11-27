import { NextResponse } from "next/server";

export const GITHUB_REPO = "SieghartSaladdin/rakitek";
export const GITHUB_REPO_URL = `https://github.com/${GITHUB_REPO}`;

const CACHE_TTL_MS = 5 * 60 * 1000;

let cachedStars: number | null = null;
let cachedAt = 0;

export async function GET() {
  const now = Date.now();
  if (cachedStars !== null && now - cachedAt < CACHE_TTL_MS) {
    return NextResponse.json(
      { stars: cachedStars, repoUrl: GITHUB_REPO_URL },
      { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" } },
    );
  }

  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
    "User-Agent": "rakitek-web",
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  try {
    const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}`, {
      headers,
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(4000),
    });

    if (res.ok) {
      const data = (await res.json()) as { stargazers_count?: unknown };
      if (typeof data.stargazers_count === "number") {
        cachedStars = data.stargazers_count;
        cachedAt = now;
      }
    }
  } catch {
    // Keep last known star count or return null when GitHub is unreachable.
  }

  return NextResponse.json(
    { stars: cachedStars, repoUrl: GITHUB_REPO_URL },
    { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" } },
  );
}
