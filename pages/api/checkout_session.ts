import convertSubCurrency from "../../components/Util/convertSubCurrency";
// const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const stripe = require("stripe")(
  "sk_test_51PPUYOP7aLEEoEmNcWxiKqwp7WyRFwD2OylgGrKmtYR0rWmwkim2cNRCARZvRdtWv5kX0nCktsZOptHleJRTlnBL00KoV2YkiJ"
);

export default async function handler(req: any, res: any) {
  if (req.method === "POST") {
    try {
      let { amount } = req.body;
      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            quantity: 1,
            price_data: {
              currency: "usd",
              unit_amount: convertSubCurrency(amount),
              product_data: {
                name: "first product",
              },
            },
          },
        ],
        mode: "payment",
        success_url: `${req.headers.origin}/checkout/?success=true`,
        cancel_url: `${req.headers.origin}/checkout/?canceled=true`,
      });
      //   res.redirect(303, session.url);
      res.json({ url: session.url });
    } catch (err: any) {
      res.status(err.statusCode || 500).json(err.message);
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
