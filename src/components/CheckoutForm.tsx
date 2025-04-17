import React, { useState } from "react";
import { motion } from "framer-motion";
import { Check, CreditCard, Truck, Calendar } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Separator } from "./ui/separator";
import { LoadingSpinner } from "./ui/loading-spinner";

interface CheckoutFormProps {
  cartItems: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }>;
  subtotal: number;
  onCheckout: () => Promise<void>;
  onCancel: () => void;
}

const CheckoutForm = ({
  cartItems = [],
  subtotal = 0,
  onCheckout = async () => {},
  onCancel = () => {},
}: CheckoutFormProps) => {
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    zip: "",
    country: "",
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvv: "",
    paymentMethod: "card",
    shippingMethod: "standard",
  });

  const shipping = formData.shippingMethod === "express" ? 15 : 5;
  const total = subtotal + shipping;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRadioChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
      return;
    }

    setIsProcessing(true);
    try {
      await onCheckout();
      // Success would be handled by the parent component
    } catch (error) {
      console.error("Checkout failed:", error);
      // Error would be handled by the parent component
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-background p-6 rounded-lg max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Checkout</h2>
        <div className="flex items-center">
          <div
            className={`flex items-center justify-center h-8 w-8 rounded-full ${step >= 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
          >
            1
          </div>
          <div
            className={`h-1 w-8 ${step >= 2 ? "bg-primary" : "bg-muted"}`}
          ></div>
          <div
            className={`flex items-center justify-center h-8 w-8 rounded-full ${step >= 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
          >
            2
          </div>
          <div
            className={`h-1 w-8 ${step >= 3 ? "bg-primary" : "bg-muted"}`}
          ></div>
          <div
            className={`flex items-center justify-center h-8 w-8 rounded-full ${step >= 3 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
          >
            3
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Step 1: Contact Information */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-medium mb-4">Contact Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zip">ZIP / Postal Code</Label>
                <Input
                  id="zip"
                  name="zip"
                  value={formData.zip}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 2: Shipping Method */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-medium mb-4">Shipping Method</h3>

            <RadioGroup
              value={formData.shippingMethod}
              onValueChange={(value) =>
                handleRadioChange("shippingMethod", value)
              }
              className="space-y-3"
            >
              <div className="flex items-center space-x-2 border p-4 rounded-md">
                <RadioGroupItem value="standard" id="standard" />
                <Label
                  htmlFor="standard"
                  className="flex flex-1 justify-between items-center cursor-pointer"
                >
                  <div className="flex items-center">
                    <Truck className="mr-2 h-5 w-5 text-muted-foreground" />
                    <span>Standard Shipping (3-5 business days)</span>
                  </div>
                  <span className="font-medium">$5.00</span>
                </Label>
              </div>

              <div className="flex items-center space-x-2 border p-4 rounded-md">
                <RadioGroupItem value="express" id="express" />
                <Label
                  htmlFor="express"
                  className="flex flex-1 justify-between items-center cursor-pointer"
                >
                  <div className="flex items-center">
                    <Truck className="mr-2 h-5 w-5 text-primary" />
                    <span>Express Shipping (1-2 business days)</span>
                  </div>
                  <span className="font-medium">$15.00</span>
                </Label>
              </div>
            </RadioGroup>

            <div className="mt-6">
              <h4 className="font-medium mb-2">Order Summary</h4>
              <div className="space-y-2">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center"
                  >
                    <span>
                      {item.name} x {item.quantity}
                    </span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <Separator className="my-4" />
              <div className="flex justify-between items-center">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Shipping</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              <Separator className="my-4" />
              <div className="flex justify-between items-center font-medium">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 3: Payment */}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-medium mb-4">Payment Method</h3>

            <RadioGroup
              value={formData.paymentMethod}
              onValueChange={(value) =>
                handleRadioChange("paymentMethod", value)
              }
              className="space-y-3"
            >
              <div className="flex items-center space-x-2 border p-4 rounded-md">
                <RadioGroupItem value="card" id="card" />
                <Label
                  htmlFor="card"
                  className="flex items-center cursor-pointer"
                >
                  <CreditCard className="mr-2 h-5 w-5" />
                  <span>Credit / Debit Card</span>
                </Label>
              </div>

              <div className="flex items-center space-x-2 border p-4 rounded-md">
                <RadioGroupItem value="paypal" id="paypal" />
                <Label
                  htmlFor="paypal"
                  className="flex items-center cursor-pointer"
                >
                  <span className="mr-2 font-bold text-blue-600">PayPal</span>
                  <span>PayPal</span>
                </Label>
              </div>
            </RadioGroup>

            {formData.paymentMethod === "card" && (
              <div className="mt-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    name="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={formData.cardNumber}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cardName">Name on Card</Label>
                  <Input
                    id="cardName"
                    name="cardName"
                    value={formData.cardName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input
                      id="expiry"
                      name="expiry"
                      placeholder="MM/YY"
                      value={formData.expiry}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      name="cvv"
                      placeholder="123"
                      value={formData.cvv}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6">
              <h4 className="font-medium mb-2">Order Total</h4>
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </motion.div>
        )}

        <div className="mt-8 flex justify-between">
          {step > 1 ? (
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep(step - 1)}
            >
              Back
            </Button>
          ) : (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}

          <Button type="submit" disabled={isProcessing}>
            {isProcessing ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Processing...
              </>
            ) : step < 3 ? (
              "Continue"
            ) : (
              "Place Order"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CheckoutForm;
