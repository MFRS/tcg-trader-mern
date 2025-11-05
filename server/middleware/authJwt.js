import jwt from "jsonwebtoken";

export function authJwt(req, res, next) {
  try {
    const auth = req.get("authorization") || "";
    const m = auth.match(/^Bearer\s+(.+)$/i);
    if (!m) return res.status(401).json({ code: "no_token", message: "Missing Authorization: Bearer <token>" });

    const token = m[1].trim();
    const secret = process.env.JWT_SECRET;
    if (!secret) return res.status(500).json({ code: "server_misconfig", message: "JWT_SECRET missing" });

    const payload = jwt.verify(token, secret, {
      algorithms: ["HS256"],
      issuer: process.env.JWT_ISS,
      audience: process.env.JWT_AUD,
      clockTolerance: 5
    });

    const userId = payload.sub;
    if (!userId) return res.status(401).json({ code: "bad_token", message: "Token missing sub" });

    req.user = { id: String(userId), claims: payload, token };
    next();
  } catch (err) {
    return res.status(401).json({ code: "bad_token", message: err.message });
  }
}
