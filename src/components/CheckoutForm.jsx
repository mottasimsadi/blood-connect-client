import { useState, useEffect, useContext } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import Swal from "sweetalert2";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../providers/AuthProvider";
import { FaDonate, FaMoneyBill } from "react-icons/fa";

const CheckoutForm = ({ closeModal, checkoutKey }) => {
  const stripe = useStripe();
  const elements = useElements();
  const axiosSecure = useAxiosSecure();
  const { user } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const [cardError, setCardError] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [amount, setAmount] = useState("");

  useEffect(() => {
    // Reset all form state when the key changes
    if (elements) {
      setAmount("");
      setCardError("");
      const cardElement = elements.getElement(CardElement);
      if (cardElement) {
        cardElement.clear();
      }
    }
  }, [checkoutKey, elements]);

  // 1. Get client secret from the backend whenever the amount changes
  useEffect(() => {
    if (amount > 0) {
      axiosSecure
        .post("/create-payment-intent", { price: amount })
        .then((res) => {
          setClientSecret(res.data.clientSecret);
        });
    }
  }, [amount, axiosSecure]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    const card = elements.getElement(CardElement);
    if (card == null) return;

    setIsProcessing(true);

    const { error: paymentMethodError } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });

    if (paymentMethodError) {
      setCardError(paymentMethodError.message);
      setIsProcessing(false);
      return;
    } else {
      setCardError("");
    }

    // 2. Confirm the payment
    const { paymentIntent, error: confirmError } =
      await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: card,
          billing_details: {
            email: user?.email || "anonymous",
            name: user?.displayName || "anonymous",
          },
        },
      });

    if (confirmError) {
      setCardError(confirmError.message);
    } else {
      if (paymentIntent.status === "succeeded") {
        // 3. Save the payment info in the database
        const paymentInfo = {
          name: user.displayName,
          email: user.email,
          amount: parseFloat(amount),
          transactionId: paymentIntent.id,
          date: new Date(),
        };

        try {
          await axiosSecure.post("/funding", paymentInfo);
          Swal.fire({
            title: "Success!",
            text: "Your donation has been received. Thank you!",
            icon: "success",
            confirmButtonColor: "#ef4343",
          });
          queryClient.invalidateQueries({ queryKey: ["all-funding"] });
          queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
          closeModal();
        } catch (dbError) {
          Swal.fire({
            title: "Database Error",
            text: "Payment succeeded but failed to save. Please contact support.",
            icon: "error",
          });
        }
      }
    }
    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="form-control">
        <label className="label">
          <span className="label-text text-base-100">Amount (USD)</span>
        </label>
        <div className="relative">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="input w-full text-base-100 bg-white border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-1 pl-10"
            placeholder="Enter amount"
            required
          />
          <FaDonate className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
        </div>
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text text-base-100">Card Information</span>
        </label>
        <div className="p-3 border border-gray-300 rounded-lg">
          <CardElement options={{ style: { base: { fontSize: "16px" } } }} />
        </div>
      </div>
      {cardError && <p className="text-red-600 text-sm">{cardError}</p>}
      <div className="modal-action justify-center">
        <button
          type="submit"
          className="btn bg-[#ef4343] border hover:bg-transparent hover:text-[#ef4343] border-[#ef4343] text-white disabled:text-[#ef4343]"
          disabled={!stripe || !clientSecret || isProcessing}
        >
          {isProcessing ? (
            <span className="loading loading-spinner text-[#ef4343]"></span>
          ) : (
            `Pay $${amount || "0"}`
          )}
        </button>
      </div>
    </form>
  );
};

export default CheckoutForm;
