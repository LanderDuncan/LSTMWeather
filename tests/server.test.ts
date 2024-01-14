import request from "supertest";
import app from "../backend/server";

describe("GET /api/prediction", () => {
  test("Prediction endpoint should return valid values.", async () => {
    const res = await request(app).get("/api/prediction");
    expect(res.body.creationMills).toBeGreaterThan(1700000000000);
    expect(res.body.predictedTemp).toBeGreaterThan(-100);
    expect(res.body.actualTemp).toBeGreaterThan(-100);
    expect(res.body.predictedSpeed).toBeGreaterThan(0);
    expect(res.body.actualSpeed).toBeGreaterThan(0);
    expect(res.body.predictedDegrees).toBeGreaterThanOrEqual(0);
    expect(res.body.predictedDegrees).toBeLessThanOrEqual(360);
    expect(res.body.actualDegrees).toBeGreaterThanOrEqual(0);
    expect(res.body.actualDegrees).toBeLessThanOrEqual(360);
  });
});

describe("GET /tfjs_artifacts/model.json", () => {
  test("model endpoint should return JSON file.", async () => {
    await request(app)
      .get("/tfjs_artifacts/model.json")
      .expect("Content-Type", /json/);
  });
});

describe("GET BIN file", () => {
  test("JSON file should produce a valid link to the bin file.", async () => {
    const res = await request(app).get("/tfjs_artifacts/model.json");
    const ext = res.body.weightsManifest[0].paths[0];
    const l = "/tfjs_artifacts/" + ext;
    const res2 = await request(app).get(l);
    expect(res2.headers["content-type"]).toEqual("application/octet-stream");
  });
});
