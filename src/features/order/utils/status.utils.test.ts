import { describe, it, expect } from "vitest";
import {
  mapStatusToEnglish,
  mapStatusToVietnamese,
  getStatusColorByEnglish,
  getStatusColorByVietnamese,
  applyOrderStatusUpdate,
} from "./status.utils";

describe("status mapping", () => {
  it("maps Vietnamese to English correctly", () => {
    expect(mapStatusToEnglish("chờ xử lý")).toBe("pending");
    expect(mapStatusToEnglish("đã nhận đơn")).toBe("acknowledged");
    expect(mapStatusToEnglish("chờ demo")).toBe("demo_pending");
    expect(mapStatusToEnglish("đã giao hàng")).toBe("delivered");
  });

  it("maps English to Vietnamese correctly", () => {
    expect(mapStatusToVietnamese("pending")).toBe("chờ xử lý");
    expect(mapStatusToVietnamese("acknowledged")).toBe("đã nhận đơn");
    expect(mapStatusToVietnamese("demo_pending")).toBe("chờ demo");
    expect(mapStatusToVietnamese("delivered")).toBe("đã giao hàng");
  });
});

describe("status colors", () => {
  it("returns phase-based colors for English statuses", () => {
    expect(getStatusColorByEnglish("pending")).toBe("#ff9800");
    expect(getStatusColorByEnglish("demo_editing")).toBe("#2196f3");
    expect(getStatusColorByEnglish("payment_pending")).toBe("#9c27b0");
    expect(getStatusColorByEnglish("manufacturing")).toBe("#3f51b5");
    expect(getStatusColorByEnglish("delivered")).toBe("#4caf50");
    expect(getStatusColorByEnglish("complaint_closed")).toBe("#795548");
  });

  it("returns colors via Vietnamese mapping", () => {
    expect(getStatusColorByVietnamese("chờ xử lý")).toBe("#ff9800");
    expect(getStatusColorByVietnamese("chỉnh sửa demo")).toBe("#2196f3");
  });
});

describe("applyOrderStatusUpdate", () => {
  it("does nothing when status is unchanged", async () => {
    const res = await applyOrderStatusUpdate("id", "pending", "chờ xử lý", async () => {});
    expect(res.updated).toBe(false);
    expect(res.nextEnglishStatus).toBe("pending");
    expect(res.error).toBeUndefined();
  });

  it("updates when status changes successfully", async () => {
    const mockUpdate = async (_id: string, _status: string) => Promise.resolve(true);
    const res = await applyOrderStatusUpdate("id", "pending", "đã nhận đơn", mockUpdate);
    expect(res.updated).toBe(true);
    expect(res.nextEnglishStatus).toBe("acknowledged");
    expect(res.error).toBeUndefined();
  });

  it("handles failure and returns error", async () => {
    const mockUpdate = async () => Promise.reject({ message: "Network error" });
    const res = await applyOrderStatusUpdate("id", "pending", "đã nhận đơn", mockUpdate);
    expect(res.updated).toBe(false);
    expect(res.nextEnglishStatus).toBe("pending");
    expect(res.error).toBe("Network error");
  });
});

