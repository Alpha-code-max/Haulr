import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import app from "../app";
import "./setup";
import { WalletService } from "../modules/wallet/wallet.services";
import { User } from "../modules/users/user.models";
import { DeliveryModel } from "../modules/deliveries/delivery.model";

describe("Deliveries Workflow (E2E)", () => {
  let vendorToken: string;
  let haulerToken: string;
  let vendorId: string;
  let haulerId: string;
  let customerId: string;
  let currentDeliveryId: string;
  let generatedOtp: string;

  beforeAll(async () => {
    // 1. Create a Customer
    const custRes = await request(app).post("/api/users/register").send({
      name: "Customer Mike",
      email: "cust@haulr.com",
      phone: "0000001234",
      password: "password123",
      role: "customer",
    });
    customerId = (await User.findOne({ email: "cust@haulr.com" }))?._id.toString() || "";

    // 2. Create a Vendor
    const venRes = await request(app).post("/api/users/register").send({
      name: "Vendor Sarah",
      email: "ven@haulr.com",
      phone: "0000004321",
      password: "password123",
      role: "vendor",
    });
    vendorToken = venRes.body.token;
    vendorId = (await User.findOne({ email: "ven@haulr.com" }))?._id.toString() || "";

    // 3. Create a Hauler
    const haulRes = await request(app).post("/api/users/register").send({
      name: "Hauler Dan",
      email: "haul@haulr.com",
      phone: "0000009876",
      password: "password123",
      role: "hauler",
    });
    haulerToken = haulRes.body.token;
    haulerId = (await User.findOne({ email: "haul@haulr.com" }))?._id.toString() || "";
  });

  it("should block delivery creation if vendor has no funds", async () => {
    const res = await request(app)
      .post("/api/deliveries")
      .set("Authorization", `Bearer ${vendorToken}`)
      .send({
        customerId,
        pickupAddress: "123 Old Rd",
        deliveryAddress: "456 New Ave",
        deliveryFee: 100,
      });

    expect(res.status).toBe(500); // Because we rely on the Express generic error handler right now
    expect(res.body.message).toBe("Insufficient funds for escrow");
  });

  it("should create a delivery and deduct escrow once funded", async () => {
    // Manually fund the vendor
    await WalletService.createTransaction(vendorId, {
      type: "deposit",
      amount: 500,
      balanceAfter: 0,
    });

    const res = await request(app)
      .post("/api/deliveries")
      .set("Authorization", `Bearer ${vendorToken}`)
      .send({
        customerId,
        pickupAddress: "123 Old Rd",
        deliveryAddress: "456 New Ave",
        deliveryFee: 100, // This should put 100 into escrow
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("_id");
    currentDeliveryId = res.body._id;

    // Verify vendor's wallet went down to 400
    const wallet = await WalletService.getWallet(vendorId);
    expect(wallet.balance).toBe(400);

    // Verify OTP was randomly generated
    const doc = await DeliveryModel.findById(currentDeliveryId);
    generatedOtp = doc!.otp!;
    expect(generatedOtp).toBeDefined();
    expect(doc!.status).toBe("pending");
  });

  it("should assign the hauler", async () => {
    const res = await request(app)
      .post("/api/deliveries/assign")
      .set("Authorization", `Bearer ${vendorToken}`) // any authenticated user in the route, guarded by role
      .send({
        deliveryId: currentDeliveryId,
        haulerId: haulerId,
      });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("accepted");
  });

  it("should allow hauler to pick up the package", async () => {
    const res = await request(app)
      .post("/api/deliveries/pickup")
      .set("Authorization", `Bearer ${haulerToken}`)
      .send({
        deliveryId: currentDeliveryId,
      });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("picked_up");
  });

  it("should fail delivery if OTP is incorrect", async () => {
    const res = await request(app)
      .post("/api/deliveries/deliver")
      .set("Authorization", `Bearer ${haulerToken}`)
      .send({
        deliveryId: currentDeliveryId,
        otp: "wrongotp",
      });

    expect(res.status).toBe(500);
    expect(res.body.message).toBe("Invalid OTP");
  });

  it("should complete delivery and release funds to hauler", async () => {
    // Check initial hauler wallet (should be 0)
    let hWallet = await WalletService.getWallet(haulerId);
    expect(hWallet.balance).toBe(0);

    const res = await request(app)
      .post("/api/deliveries/deliver")
      .set("Authorization", `Bearer ${haulerToken}`)
      .send({
        deliveryId: currentDeliveryId,
        otp: generatedOtp,
      });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("delivered");

    // Check final hauler wallet (should be 100)
    hWallet = await WalletService.getWallet(haulerId);
    expect(hWallet.balance).toBe(100);
  });
});
