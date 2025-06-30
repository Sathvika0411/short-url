const shortid = require("shortid");
const QRCode = require("qrcode");
const URL = require("../models/url");

async function handleGenerateNewShortURL(req, res) {
  try {
    const body = req.body;

    if (!body.url) {
      return res.status(400).json({ error: "url is required" });
    }

    // Generate shortId
    const shortId = shortid.generate();

    // Base URL (use your deployed URL if available)
    const BASE_URL = process.env.BASE_URL || 'http://localhost:8001';
    const shortUrl = `${BASE_URL}/${shortId}`;

    // Generate QR Code for the short URL
    const qrCode = await QRCode.toDataURL(shortUrl);

    // Save to MongoDB
    await URL.create({
      shortId,
      originalUrl: body.url,
      qrCode,
      visitHistory: [],
    });

    // Return result
    return res.json({ id: shortId, shortUrl, qrCode });

  } catch (error) {
    console.error("Error in handleGenerateNewShortURL:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

async function handleGetAnalytics(req, res) {
  try {
    const shortId = req.params.shortId;
    const result = await URL.findOne({ shortId });

    if (!result) {
      return res.status(404).json({ error: "Short URL not found" });
    }

    return res.json({
      totalClicks: result.visitHistory.length,
      analytics: result.visitHistory,
    });

  } catch (error) {
    console.error("Error in handleGetAnalytics:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = {
  handleGenerateNewShortURL,
  handleGetAnalytics,
};
