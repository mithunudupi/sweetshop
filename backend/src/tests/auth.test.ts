import request from "supertest";
import { AppDataSource } from "../../../ormconfig";
import app from "./testApp";

beforeAll(async ()=> {
  await AppDataSource.initialize();
});

afterAll(async ()=> {
  await AppDataSource.destroy();
});

test("register and login", async ()=>{
  const server = app.listen();
  const agent = request(server);
  const email = "test@example.com";
  await agent.post("/api/auth/register").send({ email, password: "pass123" }).expect(200);
  const login = await agent.post("/api/auth/login").send({ email, password: "pass123" }).expect(200);
  expect(login.body.token).toBeDefined();
  server.close();
});
