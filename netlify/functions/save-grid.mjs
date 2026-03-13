import { getStore } from "@netlify/blobs";

export default async (req, context) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }
  let body;
  try { body = await req.json(); } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400, headers: { "Content-Type": "application/json" } });
  }
  try {
    const store = getStore("craft-grids");
    const id = `grid-${Date.now()}`;
    const record = { id, date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }), fn: body.fn || "", context: body.context || "", levels: body.levels || [], competencies: body.competencies || [], gridData: body.gridData || {} };
    await store.setJSON(id, record);
    return new Response(JSON.stringify({ success: true, id }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
};
export const config = { path: "/api/save-grid" };
