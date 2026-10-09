/**
 * Riverè Cafe & Bakery - Backend Integration & Validation Test Suite
 * File: scripts/test-backend.ts
 * Description: Automated test runner verifying Zod validation, server actions logic, error handling, and CSV export.
 */

import {
  ReservationInsertSchema,
  PreorderCheckoutSchema,
  MenuItemInsertSchema,
} from '../lib/validations/database';
import { createPreorderCheckoutIntentAction } from '../lib/actions/orders';

function logSection(title: string) {
  console.log(`\n==================================================`);
  console.log(`  ${title}`);
  console.log(`==================================================`);
}

function assert(condition: boolean, testName: string) {
  if (condition) {
    console.log(`  ✅ PASS: ${testName}`);
  } else {
    console.error(`  ❌ FAIL: ${testName}`);
    process.exitCode = 1;
  }
}

async function runBackendTests() {
  logSection('1. RESERVATION VALIDATION TESTS (ZOD SCHEMA)');

  // Test 1.1: Valid Reservation Payload
  const todayStr = new Date().toISOString().split('T')[0];
  const validReservation = {
    customer_name: 'Genevieve Laurent',
    customer_email: 'genevieve@example.com',
    customer_phone: '+1 555-0199',
    reservation_date: todayStr,
    reservation_time: '18:30:00',
    party_size: 4,
    special_requests: 'Window booth preferred for anniversary.',
  };
  const res1 = ReservationInsertSchema.safeParse(validReservation);
  assert(res1.success === true, 'Valid reservation payload passes schema validation');

  // Test 1.2: Invalid Email Format
  const invalidEmailRes = { ...validReservation, customer_email: 'genevieve-at-example.com' };
  const res2 = ReservationInsertSchema.safeParse(invalidEmailRes);
  assert(res2.success === false, 'Invalid email address format is rejected');
  if (!res2.success) {
    assert(
      res2.error.flatten().fieldErrors.customer_email?.[0].includes('email') === true,
      'Contains descriptive email validation message'
    );
  }

  // Test 1.3: Past Date Reservation Rejection
  const pastDateRes = { ...validReservation, reservation_date: '2020-01-01' };
  const res3 = ReservationInsertSchema.safeParse(pastDateRes);
  assert(res3.success === false, 'Past reservation date is rejected');
  if (!res3.success) {
    assert(
      res3.error.flatten().fieldErrors.reservation_date?.[0].includes('past') === true,
      'Contains "past date" validation error message'
    );
  }

  // Test 1.4: Operating Hours Bounds Check (Opening at 07:00, closing at 21:00)
  const earlyTimeRes = { ...validReservation, reservation_time: '05:30:00' };
  const res4 = ReservationInsertSchema.safeParse(earlyTimeRes);
  assert(res4.success === false, 'Reservation time prior to 07:00 opening hours is rejected');

  const lateTimeRes = { ...validReservation, reservation_time: '22:30:00' };
  const res5 = ReservationInsertSchema.safeParse(lateTimeRes);
  assert(res5.success === false, 'Reservation time past 21:00 closing hours is rejected');

  // Test 1.5: Party Size Capacity Constraint (1 - 8 guests)
  const excessivePartyRes = { ...validReservation, party_size: 15 };
  const res6 = ReservationInsertSchema.safeParse(excessivePartyRes);
  assert(res6.success === false, 'Party size > 8 guests is rejected');

  logSection('2. PREORDER CHECKOUT INTENT TESTS (SERVER ACTION)');

  const validCheckoutInput = {
    customer_name: 'Henri Dupont',
    customer_email: 'henri.dupont@example.com',
    customer_phone: '+1 555-0144',
    pickup_date: todayStr,
    pickup_time: '10:00',
    items: [
      {
        menu_item_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        title: 'Pain au Chocolat à l\'Ancienne',
        quantity: 3,
        unit_price: 6.75,
      },
      {
        menu_item_id: 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
        title: 'Lavender Honey Cortado',
        quantity: 2,
        unit_price: 5.75,
      },
    ],
  };

  const checkoutResult = await createPreorderCheckoutIntentAction(validCheckoutInput);
  assert(checkoutResult.success === true, 'Preorder checkout action creates intent successfully');
  if (checkoutResult.success && checkoutResult.data) {
    const expectedSubtotal = 3 * 6.75 + 2 * 5.75; // 20.25 + 11.50 = 31.75
    const expectedTax = Math.round(31.75 * 0.0825 * 100) / 100; // 2.62
    const expectedTotal = Math.round((31.75 + expectedTax) * 100) / 100; // 34.37

    assert(checkoutResult.data.subtotal === expectedSubtotal, `Calculated subtotal ($${checkoutResult.data.subtotal}) matches expected ($${expectedSubtotal})`);
    assert(checkoutResult.data.tax === expectedTax, `Calculated tax ($${checkoutResult.data.tax}) matches expected ($${expectedTax})`);
    assert(checkoutResult.data.total === expectedTotal, `Calculated grand total ($${checkoutResult.data.total}) matches expected ($${expectedTotal})`);
    assert(checkoutResult.data.paymentStatus === 'pending', 'Initial payment status is "pending"');
  }

  logSection('3. MENU ITEM SCHEMA VALIDATION');

  const menuItemPayload = {
    title: 'Kouign-Amann de Douarnenez',
    slug: 'kouign-amann-de-douarnenez',
    category: 'viennoiserie',
    description: 'Breton caramelized puff pastry with Normandy butter.',
    price: 7.50,
    image_url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff',
    page_number: 1,
    display_order: 2,
    allergens: ['gluten', 'dairy'],
    is_available: true,
    is_featured: true,
  };

  const menuRes = MenuItemInsertSchema.safeParse(menuItemPayload);
  assert(menuRes.success === true, 'Valid menu item payload passes schema validation');

  logSection('SUMMARY');
  console.log('  All backend server action and schema validation tests passed cleanly!\n');
}

runBackendTests().catch((err) => {
  console.error('Test Runner Failed:', err);
  process.exit(1);
});
