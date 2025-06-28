const shortid = require("shortid");
const QRCode = require("qrcode");
const URL = require("../models/url");

async function handleGenerateNewShortURL(req, res) {
  const body = req.body;
  if (!body.url) return res.status(400).json({ error: 'url is required' });

  const shortId = shortid();
  const shortUrl = `http://localhost:8001/${shortId}`;

  // Generate QR code
  const qrCode = await QRCode.toDataURL(shortUrl);

  // Save to DB
  await URL.create({
    shortId,
    originalUrl: body.url,
    qrCode,
    visitHistory: [],
  });

  return res.json({ id: shortId, shortUrl, qrCode });
}

async function handleGetAnalytics(req, res) {
  const shortId = req.params.shortId;
  const result = await URL.findOne({ shortId });

  if (!result) {
    return res.status(404).json({ error: "Short URL not found" });
  }

  return res.json({
    totalClicks: result.visitHistory.length,
    analytics: result.visitHistory,
  });
}


module.exports = {
  handleGenerateNewShortURL,
  handleGetAnalytics,
};
