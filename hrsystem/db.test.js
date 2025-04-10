const db = require("./database/db"); 

describe("Database Connection Tests", () => {
  it("should connect to the database successfully", async () => {
    const pool = await db.poolPromise;
    expect(pool).toBeDefined();
    expect(pool).toHaveProperty("query");
  });

  it("should return an error for invalid queries", async () => {
    const pool = await db.poolPromise;
    await expect(pool.query("INVALID SQL QUERY")).rejects.toThrow();
  });
});
