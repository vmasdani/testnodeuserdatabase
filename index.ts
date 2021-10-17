import express from "express";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  createConnection,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import dotenv from "dotenv";
import { readFileSync } from "fs";

const app = express();

const env = (() => {
  try {
    return JSON.parse(
      readFileSync(`${__dirname}/env.json`, { encoding: "utf8" })
    );
  } catch (e) {
    return null;
  }
})();

// console.log("env:", env);

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id?: number | null;

  @Column({ type: "text", nullable: true })
  firstName?: string | null;

  @Column({ type: "text", nullable: true })
  lastName?: string | null;

  @Column({ type: "int", nullable: true })
  age?: number | null;

  @CreateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
    nullable: true,
  })
  created_at?: Date | null;

  @UpdateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
    onUpdate: "CURRENT_TIMESTAMP(6)",
    nullable: true,
  })
  updated_at?: Date | null;
}

const main = async () => {
  console.log("Getting connection...", env?.dbName);

  const connection = await createConnection({
    type: "mysql",
    host: env?.dbHost ?? "",
    port: 3306,
    username: env?.dbUsername ?? "",
    password: env?.dbPassword ?? "",
    database: env?.dbName ?? "",
    entities: [User],
    synchronize: true,
  });

  console.log("Getting connection ok...", process.env.DB_NAME);

  try {
    console.error("Populating init data..");

    await connection.getRepository(User).save({
      ...new User(),
      // id: 1,
      firstName: "lavina",
      lastName: "masdani",
      age: 22,
    });
  } catch (e) {
    console.error("Populate init error", e);
  }

  console.log("Getting connection ok...", process.env.DB_NAME);

  app.get("/", async (req, res) => {
    try {
      res.json(await connection.getRepository(User).find());
    } catch (e) {
      res.status(500);
      res.send(e);
    }
  });

  // app.get("/test-add", async (req, res) => {
  //   try {
  //     res.json(
  //       await connection.getRepository(User).save({
  //         ...new User(),
  //         id: 1,
  //         firstName: "lavina",
  //         lastName: "masdani",
  //         age: 22,
  //       })
  //     );
  //   } catch (e) {
  //     res.status(500);
  //     res.send(e);
  //   }
  // });
};

main();

export default app;
