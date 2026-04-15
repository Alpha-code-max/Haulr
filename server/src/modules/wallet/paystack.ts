/**
 * Paystack payment integration service
 * Handles transaction initialization and verification via Paystack API
 */
import { env } from "../../config/env";
import { AppError } from "../../utils/AppError";

const PAYSTACK_BASE_URL = "https://api.paystack.co";

interface PaystackInitResponse {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

interface PaystackVerifyResponse {
  status: boolean;
  message: string;
  data: {
    status: string; // "success" | "abandoned" | "failed"
    reference: string;
    amount: number; // in kobo
    currency: string;
    customer: {
      email: string;
    };
    metadata?: Record<string, any>;
  };
}

export class PaystackService {
  private static headers = {
    Authorization: `Bearer ${env.PAYSTACK_SECRET_KEY}`,
    "Content-Type": "application/json",
  };

  /**
   * Initialize a Paystack transaction
   * @param email - Customer email
   * @param amount - Amount in Naira (will be converted to kobo)
   * @param metadata - Optional metadata (e.g., userId)
   */
  static async initializeTransaction(
    email: string,
    amount: number,
    metadata?: Record<string, any>
  ): Promise<PaystackInitResponse["data"]> {
    if (env.PAYSTACK_SECRET_KEY === "sk_test_placeholder") {
      throw new AppError(
        "Paystack is not configured. Add PAYSTACK_SECRET_KEY to your .env file.",
        503
      );
    }

    const response = await fetch(`${PAYSTACK_BASE_URL}/transaction/initialize`, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify({
        email,
        amount: Math.round(amount * 100), // Convert Naira to kobo
        currency: "NGN",
        metadata,
      }),
    });

    const result = (await response.json()) as PaystackInitResponse;

    if (!result.status) {
      throw new AppError(
        `Paystack initialization failed: ${result.message}`,
        400
      );
    }

    return result.data;
  }

  /**
   * Verify a Paystack transaction
   * @param reference - Transaction reference from initialization
   */
  static async verifyTransaction(
    reference: string
  ): Promise<PaystackVerifyResponse["data"]> {
    if (env.PAYSTACK_SECRET_KEY === "sk_test_placeholder") {
      throw new AppError(
        "Paystack is not configured. Add PAYSTACK_SECRET_KEY to your .env file.",
        503
      );
    }

    const response = await fetch(
      `${PAYSTACK_BASE_URL}/transaction/verify/${encodeURIComponent(reference)}`,
      {
        method: "GET",
        headers: this.headers,
      }
    );

    const result = (await response.json()) as PaystackVerifyResponse;

    if (!result.status) {
      throw new AppError(
        `Paystack verification failed: ${result.message}`,
        400
      );
    }

    return result.data;
  }
}
