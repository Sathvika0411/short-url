const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const URL = require('./models/url');
const urlRoute = require("./routes/url");

const app = express();

// ✅ Always register CORS and JSON middleware BEFORE routes
app.use(cors());
app.use(express.json());

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

const PORT = 8001;
const mongoURI = "mongodb+srv://itsmechama2004:WaY4WeN5fktIZYwY@cluster0.14ixw3r.mongodb.net/shorturl?retryWrites=true&w=majority&appName=Cluster0";

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
