import { DataSource } from "typeorm";
import { User } from "./src/entity/User";
import { Sweet } from "./src/entity/Sweet";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: process.env.SQLITE_FILE || "data/sqlite.db",
  synchronize: true,
  logging: false,
  entities: [User, Sweet],
});
