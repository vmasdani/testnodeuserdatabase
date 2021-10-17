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

dotenv.config({ path: `${__dirname}/.env` });

const app = express();

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
  const connection = await createConnection({
    type: "mysql",
    host: process.env.DB_HOST,
    port: 3306,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [User],
    synchronize: true,
  });

  try {
    console.log("Getting connection...", process.env.DB_NAME);
    await connection.getRepository(User).save({
      ...new User(),
      // id: 1,
      firstName: "lavina",
      lastName: "masdani",
      age: 22,
    });
  } catch (e) {
    console.error("Getting connection error", e);
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
