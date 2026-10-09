'use server';

/**
 * Riverè Cafe & Bakery - Preorder & Checkout Server Actions
 * File: lib/actions/orders.ts
 * Description: Server actions to create preorder checkout intents and update payment statuses.
 */

import { PreorderCheckoutSchema, PreorderCheckoutInput } from '../validations/database';

export interface CheckoutIntentResponse {
  orderId: string;
  subtotal: number;
  tax: number;
  total: number;
  pickupDate: string;
  pickupTime: string;
  customerEmail: string;
  paymentStatus: 'pending' | 'processing' | 'paid' | 'failed' | 'refunded';
  clientSecret: string;
  created_at: string;
}

export interface OrderActionResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  fieldErrors?: Record<string, string[]>;
}

// In-memory store or mock data structure for preorders state
const orderStore = new Map<string, CheckoutIntentResponse>();

/**
 * Server action to validate order payload, calculate line totals, and create a preorder checkout intent.
 */
export async function createPreorderCheckoutIntentAction(
  input: PreorderCheckoutInput
): Promise<OrderActionResponse<CheckoutIntentResponse>> {
  try {
    const validationResult = PreorderCheckoutSchema.safeParse(input);
    if (!validationResult.success) {
      const fieldErrors = validationResult.error.flatten().fieldErrors;
      const firstError = Object.values(fieldErrors)[0]?.[0] || 'Invalid preorder checkout payload.';
      return {
        success: false,
        error: firstError,
        fieldErrors,
      };
    }

    const { customer_email, pickup_date, pickup_time, items } = validationResult.data;

    // Calculate line items total
    const subtotal = items.reduce((acc, item) => acc + item.unit_price * item.quantity, 0);
    const tax = Math.round(subtotal * 0.0825 * 100) / 100; // 8.25% local tax
    const total = Math.round((subtotal + tax) * 100) / 100;

    const orderId = `riv_ord_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const clientSecret = `pi_riv_secret_${Math.random().toString(36).substring(2, 15)}`;

    const intentPayload: CheckoutIntentResponse = {
      orderId,
      subtotal,
      tax,
      total,
      pickupDate: pickup_date,
      pickupTime: pickup_time,
      customerEmail: customer_email,
      paymentStatus: 'pending',
      clientSecret,
      created_at: new Date().toISOString(),
    };

    orderStore.set(orderId, intentPayload);

    return {
      success: true,
      data: intentPayload,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to create checkout intent.';
    return {
      success: false,
      error: message,
    };
  }
}

/**
 * Server action to update payment status for an existing preorder.
 */
export async function updateOrderPaymentStatusAction(
  orderId: string,
  paymentStatus: 'pending' | 'processing' | 'paid' | 'failed' | 'refunded'
): Promise<OrderActionResponse<CheckoutIntentResponse>> {
  try {
    const existingOrder = orderStore.get(orderId);
    if (!existingOrder) {
      // Create fallback record if updating directly
      const updated: CheckoutIntentResponse = {
        orderId,
        subtotal: 0,
        tax: 0,
        total: 0,
        pickupDate: new Date().toISOString().split('T')[0],
        pickupTime: '12:00',
        customerEmail: 'customer@rivere.bakery',
        paymentStatus,
        clientSecret: `pi_riv_secret_${orderId}`,
        created_at: new Date().toISOString(),
      };
      orderStore.set(orderId, updated);
      return { success: true, data: updated };
    }

    existingOrder.paymentStatus = paymentStatus;
    orderStore.set(orderId, existingOrder);

    return {
      success: true,
      data: existingOrder,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to update payment status.';
    return {
      success: false,
      error: message,
    };
  }
}
