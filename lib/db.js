import { Pool } from "pg";

const pool = new Pool({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  port: process.env.PGPORT,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
});

pool.on("connect", () => {
  console.log("Connected to the local database");
});

pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

const db = {
  query: async (text, params) => {
    const start = Date.now();
    try {
      const res = await pool.query(text, params);
      const duration = Date.now() - start;
      console.log("Executed query", { text, duration, rows: res.rowCount });
      return res;
    } catch (error) {
      console.error("Error executing query", { text, error });
      throw error;
    }
  },
};

export default db;
