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

describe("Testes da controller list:", () => {
        test("Deve listar os usuários", async () => {
            const user = await prisma.user.create({
                data: {
                    name: faker.person.firstName(),
                    email: faker.internet.email(),
                    password: faker.string.alphanumeric(),
                },
            });
        
            const response = await request(app).get("/users");
        
            assert.deepStrictEqual(response.status, 200);
            assert.deepStrictEqual(response.body.length, 1);
            assert.deepStrictEqual(response.body[0].name, user.name);
            assert.deepStrictEqual(response.body[0].email, user.email);
            assert.deepStrictEqual(response.body[0].password, undefined);
        });
    
        test("Deve retornar uma lista vazia quando não houver usuários", async () => {
            const response = await request(app).get("/users");
        
            assert.deepStrictEqual(response.status, 200);
            assert.deepStrictEqual(response.body, []);
        });
    
        test("Deve listar vários usuários", async () => {
            await prisma.user.createMany({
            data: [
                {
                    name: faker.person.firstName(),
                    email: faker.internet.email(),
                    password: faker.string.alphanumeric(),
                },
                {
                    email: faker.internet.email(),
                    password: faker.string.alphanumeric(),
                },
                {
                    name: faker.person.firstName(),
                    email: faker.internet.email(),
                    password: faker.string.alphanumeric(),
                },
            ],
        });
    
        const response = await request(app).get("/users");
    
        assert.deepStrictEqual(response.status, 200);
        assert.deepStrictEqual(response.body.length, 3);
        response.body.forEach((user: any) => {
            assert.ok(user.email);
            assert.ok(user.id);
            assert.deepStrictEqual(user.password, undefined);
        });
    });
})