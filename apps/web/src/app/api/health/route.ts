import { NextResponse } from "next/server";
import { catalog, getAllComponents } from "@/lib/catalog";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "rakitek",
    styles: catalog.styles.length,
    components: getAllComponents().length,
  });
}
