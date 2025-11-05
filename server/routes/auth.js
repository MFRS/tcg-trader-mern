import express from "express";
import jwt from "jsonwebtoken";
import { secretFingerprint } from "../utils/secretFingerprint.js";
const router = express.Router();

router.post("/test-login", (req, res) => {
  const { userId } = req.body || {};
  if (!userId) return res.status(400).json({ code: "bad_user", message: "userId required" });

  if (!process.env.JWT_SECRET) {
    return res.status(500).json({ code: "server_misconfig", message: "JWT_SECRET missing" });
  }

  // console.log(req.body.password)

  const token = jwt.sign(
    { sub: String(userId), aud: process.env.JWT_AUD, iss: process.env.JWT_ISS },
    process.env.JWT_SECRET,
    { algorithm: "HS256", expiresIn: "1h" }
  );

  res.json({
    ok: true,
    token,
    env: {
      iss: process.env.JWT_ISS,
      aud: process.env.JWT_AUD,
      secret_fp: secretFingerprint()
    }
  });
});

router.get("/diag", (req, res) => {
  res.json({
    ok: true,
    env: {
      iss: process.env.JWT_ISS || null,
      aud: process.env.JWT_AUD || null,
      secret_fp: secretFingerprint(),
      secret_len: (process.env.JWT_SECRET || "").length
    },
    pid: process.pid
  });
});

export default router;
