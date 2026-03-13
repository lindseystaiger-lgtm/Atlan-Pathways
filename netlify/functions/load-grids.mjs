import { getStore } from "@netlify/blobs";

export default async (req, context) => {
  try {
    const store = getStore("craft-grids");
    const { blobs } = await store.list();
    const grids = await Promise.all(blobs.map(async ({ key }) => { try { return await store.get(key, { type: "json" }); } catch { return null; } }));
    const sorted = grids.filter(Boolean).sort((a, b) => b.id.localeCompare(a.id));
    return new Response(JSON.stringify({ grids: sorted }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message, grids: [] }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
};
export const config = { path: "/api/load-grids" };
