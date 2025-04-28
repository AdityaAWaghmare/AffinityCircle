import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(process.env.POSTGRES_URI, {
  dialect: "postgres",
  logging: false, // Disable logging; set to true for debugging
});

sequelize
  .authenticate()
  .then(() => {
    console.log("PostgreSQL connected successfully");
  })
  .catch((error) => {
    console.error("Unable to connect to PostgreSQL:", error);
  });

export default sequelize;