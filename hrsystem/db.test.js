const db = require("./database/db"); // Adjusted the path to the correct location

describe("Database Connection Tests", () => {
  it("should connect to the database successfully", async () => {
    const pool = await db.poolPromise; // Updated to use poolPromise
    expect(pool).toBeDefined();
    expect(pool).toHaveProperty("query"); // Assuming the connection object has a query method
  });

  it("should return an error for invalid queries", async () => {
    const pool = await db.poolPromise; // Updated to use poolPromise
    await expect(pool.query("INVALID SQL QUERY")).rejects.toThrow(); // Updated to use pool.query
  });
});
