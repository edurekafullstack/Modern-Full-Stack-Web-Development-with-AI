export function requestTimer(req, res, next) {
  const start = process.hrtime.bigint();
  console.log(`[timer] started ${req.method} ${req.originalUrl}`);

  res.on("finish", () => {
    const ms = Number(process.hrtime.bigint() - start) / 1e6;
    console.log(`[timer] finished ${res.statusCode} in ${ms.toFixed(1)} ms`);
  });

  next();
}
