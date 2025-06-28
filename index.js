require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const URL = require('./models/url');
const urlRoute = require("./routes/url");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/url", urlRoute);

app.get('/:shortId', async (req, res) => {
  const shortId = req.params.shortId;

  const entry = await URL.findOneAndUpdate(
    { shortId },
    {
      $push: {
        visitHistory: {
          timestamp: Date.now(),
        },
      },
    }
  );

  if (!entry) {
    return res.status(404).send("Short URL not found");
  }

  res.redirect(entry.originalUrl);
});

const PORT = process.env.PORT || 8001;
const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI)
  .then(() => {
    console.log("MongoDB Atlas connected");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
