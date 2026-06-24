import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");

  if (!q || q.trim().length < 3) {
    return NextResponse.json({ error: "Query too short" }, { status: 400 });
  }

  try {
    const url = new URL("https://nominatim.openstreetmap.org/search");
    url.searchParams.set("format", "json");
    url.searchParams.set("limit", "1");
    url.searchParams.set("countrycodes", "mx");
    url.searchParams.set("q", q);

    const res = await fetch(url.toString(), {
      headers: {
        "User-Agent": "CarreraGourmet/1.0 (World Cup 2026 MVP)",
      },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Geocoding failed" }, { status: 502 });
    }

    const results = await res.json();
    if (!results.length) {
      return NextResponse.json({ error: "No results" }, { status: 404 });
    }

    const hit = results[0];
    return NextResponse.json({
      lat: parseFloat(hit.lat),
      lng: parseFloat(hit.lon),
      displayName: hit.display_name,
    });
  } catch {
    return NextResponse.json({ error: "Geocoding error" }, { status: 500 });
  }
}
