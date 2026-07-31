import test from "node:test";
import assert, { deepStrictEqual } from "node:assert";
import request from "supertest";
import { faker } from "@faker-js/faker";

import app from "../src/app";
import { prisma } from "../config/prisma";

test.beforeEach(async () => {
    await prisma.user.deleteMany();
});

test.after(async () => {
    await prisma.$disconnect();
});

test("Deve buscar um usuário pelo id", async () => {
    const user = await prisma.user.create({
        data: {
            name: faker.person.firstName(),
            email: faker.internet.email(),
        },
    });

    const response = await request(app).get(`/users/${user.id}`);

    assert.deepStrictEqual(response.status, 200);
    assert.deepStrictEqual(response.body, user);
});

test("Deve retornar erro se tentar buscar um usuário que não existe", async () => {
    const response = await request(app).get("/users/999999");

    assert.deepStrictEqual(response.status, 404);
    assert.deepStrictEqual(response.body, "User not found");
});