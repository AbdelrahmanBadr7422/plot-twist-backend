import request from "supertest";
import app from "../src/app";

describe("Health Check", () => {
  it("should return OK status", async () => {
    const response = await request(app).get("/api/health");

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("OK");
    expect(response.body.service).toBe("Plot Twist Book Store API");
  });
});
