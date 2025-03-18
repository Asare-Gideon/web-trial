"use client";
import React, { useEffect, useState } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import convertSubCurrency from "../Util/convertSubCurrency";

const PaymentCheckout = ({ amount }: { amount: number }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [clientSecrete, setClientSecrete] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: convertSubCurrency(amount) }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecrete(data.clientSecret));

    // console.log(clientSecrete);
  }, [amount]);

  return <div>{clientSecrete && <PaymentElement />}</div>;
};

export default PaymentCheckout;
