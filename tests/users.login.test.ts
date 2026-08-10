import test, { describe } from "node:test";
import request from "supertest";
import { faker } from "@faker-js/faker";
import { prisma } from "../config/prisma";
import bcrypt from "bcrypt";
import assert from "node:assert";
import app from "../src/app";
import { validateToken } from "../src/helpers/jwt";

test.before(() => {
    console.error = () => {};
});

test.beforeEach(async () => {
    await prisma.user.deleteMany();
});

test.after(async () => {
    await prisma.$disconnect();
});

describe("Testes da controller users login:", () => {
    test("Deve realizar o login com email e senha válidos", async () => {
        const email = faker.internet.email();
        const password = faker.string.alphanumeric(5);

        const user = await prisma.user.create({
            data: {
                name: faker.person.firstName(),
                email,
                password: bcrypt.hashSync(password, +process.env.BCRYPT_ROUNDS!),
            },
        });

        const response = await request(app).post("/users/login").send({
            email,
            password,
        });

        assert.deepStrictEqual(response.status, 200);
        assert.ok(response.body);

        const payload = validateToken(response.body);

        assert.deepStrictEqual(payload.id, user.id);
        assert.deepStrictEqual(payload.password, undefined);
    });
});