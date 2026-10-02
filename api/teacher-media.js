const NEON_TEACHER_API = "https://br-proud-wind-b8qdt9gb-teacherapi.compute.c-14.us-east-1.aws.neon.tech";

module.exports = async function handler(req, res) {
  if (!["GET", "HEAD"].includes(req.method)) {
    res.setHeader("Allow", "GET, HEAD");
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  try {
    const id = typeof req.query.view === "string" ? req.query.view.trim() : "";
    const target = id
      ? `${NEON_TEACHER_API}/view?id=${encodeURIComponent(id)}`
      : `${NEON_TEACHER_API}/catalog`;

    const headers = {};
    if (req.headers.range) headers.Range = req.headers.range;

    const upstream = await fetch(target, { headers });

    if (!id) {
      const body = await upstream.text();
      res.status(upstream.status);
      res.setHeader("Content-Type", upstream.headers.get("content-type") || "application/json; charset=utf-8");
      res.setHeader("Cache-Control", "public, max-age=60, s-maxage=60, stale-while-revalidate=300");
      if (req.method === "HEAD") return res.end();
      return res.send(body);
    }

    res.status(upstream.status);
    for (const name of ["content-type", "content-length", "content-range", "accept-ranges", "etag", "last-modified"]) {
      const value = upstream.headers.get(name);
      if (value) res.setHeader(name, value);
    }

    res.setHeader("Content-Disposition", "inline");
    res.setHeader("Cache-Control", "private, max-age=300");
    res.setHeader("X-Content-Type-Options", "nosniff");

    if (req.method === "HEAD") return res.end();
    const buffer = Buffer.from(await upstream.arrayBuffer());
    return res.send(buffer);
  } catch (error) {
    console.error("teacher-media proxy error", error);
    return res.status(502).json({ ok: false, error: "Teacher media service unavailable" });
  }
};