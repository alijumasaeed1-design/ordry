const express = require("express");
const app = express();

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

app.use(express.json());
app.use(express.static(__dirname));

app.post("/create-checkout-session", async (req, res) => {
  try {
    const { plan } = req.body;

    let priceId;

    if (plan === "monthly") {
      priceId = process.env.STRIPE_MONTHLY_PRICE_ID;
    } else if (plan === "yearly") {
      priceId = process.env.STRIPE_YEARLY_PRICE_ID;
    } else {
      return res.status(400).send("Invalid plan");
    }

    const baseUrl = process.env.RENDER_EXTERNAL_URL || `http://localhost:${process.env.PORT || 3000}`;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [
        {
          price: priceId,
          quantity: 1
        }
      ],
      success_url: `${baseUrl}/success.html`,
      cancel_url: `${baseUrl}/cancel.html`
    });

    res.json({ url: session.url });
  } catch (err) {
    console.log(err);
    res.status(500).send("Stripe error");
  }
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});