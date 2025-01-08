import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "tkietblogs",
  password: "Sai1234@@",
  port: 3000,
});
pool.connect().then(() => {
  console.log("success");
});

export default pool;
