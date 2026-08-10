import test, { describe } from "node:test";
import assert from "node:assert";
import request from "supertest";
import { faker } from "@faker-js/faker";

import app from "../src/app";
import { prisma } from "../config/prisma";

test.before(() => {
    console.error = () => {};
});

test.beforeEach(async () => {
    await prisma.user.deleteMany();
});

test.after(async () => {
    await prisma.$disconnect();
});

describe("Testes da controller users create:", () => {
    test("Deve cadastrar um usuário", async () => {
        const user = {
            name: faker.person.firstName(),
            email: faker.internet.email(),
            password: faker.string.alphanumeric(),
        };

        const response = await request(app).post("/users").send(user);
    
        assert.deepStrictEqual(response.status, 201);
        assert.deepStrictEqual(response.body.name, user.name);
        assert.deepStrictEqual(response.body.email, user.email);
        assert.ok(response.body.id);
        assert.deepStrictEqual(response.body.password, undefined);
    });

    test("Deve retornar erro se o email não for informado", async () => {
        const response = await request(app).post("/users").send({
            name: faker.person.firstName(),
            password: faker.string.alphanumeric(),
        });
    
        assert.deepStrictEqual(response.status, 400);
        assert.deepStrictEqual(response.body, "User data incomplete");
    });

    test("Deve retornar erro se o senha não for informado", async () => {
        const response = await request(app).post("/users").send({
            name: faker.person.firstName(),
            password: faker.internet.email(),
        });
    
        assert.deepStrictEqual(response.status, 400);
        assert.deepStrictEqual(response.body, "User data incomplete");
    });

    test("Deve permitir cadastar um usuário sem nome", async () => {
        const user = {
            email: faker.internet.email(),
            password: faker.string.alphanumeric(),
        };
    
        const response = await request(app).post("/users").send(user);
    
        assert.deepStrictEqual(response.status, 201);
        assert.deepStrictEqual(response.body.email, user.email);
        assert.deepStrictEqual(response.body.name, null);
        assert.ok(response.body.id);
    });

    test("Deve retornar erro ao cadastrar uma email duplicado", async () => {
        const email = faker.internet.email();
        await request(app).post("/users").send({
            name: faker.person. firstName(),
            email,
            password: faker.string.alphanumeric(),
        });
    
        const response = await request(app).post("/users").send({
            name: faker.person.firstName(),
            email,
            password: faker.string.alphanumeric(),
        });
    
        assert.deepStrictEqual(response.status, 409);
        assert.deepStrictEqual(response.body,
            "Unique constraint failed on the fields: (`email`)",       
        );
    });

    test("Deve retornar erro caso o email seja inválido", async () => {
        const response = await request(app).post("/users").send({
            name: faker.person.firstName(),
            email: "teste",
            password: faker.string.alphanumeric(),
        });
    
        assert.deepStrictEqual(response.status, 400);
        assert.deepStrictEqual(response.body, "Invalid email");
    });
})