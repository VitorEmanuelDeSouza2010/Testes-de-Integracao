import test, { describe } from "node:test";
import assert, { deepStrictEqual } from "node:assert";
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

describe("Testes da controller users delete", () => {
    test("Deve deletar um usuário", async () => {
        const user = await prisma.user.create({
            data: {
                name: faker.person.firstName(),
                email: faker.internet.email(),
                password: faker.string.alphanumeric(),
            },
        });
        
        const response = await request(app).delete(`/users/${user.id}`).send(user);
        
        const deletedUser = await prisma.user.findUnique({
            where: {
                id: user.id
            }
        })
        
        assert.deepStrictEqual(response.status, 200);
        assert.deepStrictEqual(response.body.name, user.name);
        assert.deepStrictEqual(response.body.email, user.email);
        assert.deepStrictEqual(response.body.password, undefined)
        assert.deepStrictEqual(deletedUser, null);
    });
    
    test("Deve dar erro se tentar deletar um usuário inexistente", async () => {
        const response = await request(app).delete(`/users/999999`);
        
        assert.deepStrictEqual(response.status, 404);
        assert.deepStrictEqual(response.body, "An operation failed because it depends on one or more records that were required but not found. No record was found for a delete.");
    })
})