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

describe("Testes da controller update:", () => {
    test("Deve Atualizar um usuário", async () => {
        const user = await prisma.user.create({
            data: {
                name: faker.person.firstName(),
                email: faker.internet.email(),
                password: faker.string.alphanumeric(),
            },
        });
        
        const response = await request(app).put(`/users/${user.id}`).send({
            name: "Novo Nome da Silva",
            email: "novoNomeDaSilva@gmail.com"
        });
        
        const updatedUser = await prisma.user.findUnique({
            where: {
                id: user.id,
            },
        });

        assert.deepStrictEqual(response.status, 200);
        assert.deepStrictEqual(response.body.name, "Novo Nome da Silva");
        assert.deepStrictEqual(response.body.email, "novoNomeDaSilva@gmail.com");
        assert.deepStrictEqual(response.body.password, undefined);
        assert.deepStrictEqual(updatedUser?.name, "Novo Nome da Silva");
        assert.deepStrictEqual(updatedUser?.email, "novoNomeDaSilva@gmail.com");
    })
    
    test("Deve atualizar apenas o nome de um usuário", async () => {
        const user = await prisma.user.create({
            data: {
                name: faker.person.firstName(),
                email: faker.internet.email(),
                password: faker.string.alphanumeric(),
            },
        });
        
        const response = await request(app).put(`/users/${user.id}`).send({
            name: "Novo Nome"
        })
        
        assert.deepStrictEqual(response.status, 200);
        assert.deepStrictEqual(response.body.name, "Novo Nome");
        assert.deepStrictEqual(response.body.email, user.email);
        assert.deepStrictEqual(response.body.password, undefined);
    })
    
    test("Deve dar erro se tentar atualizar um usuário inexistente", async () => {
        const response = await request(app).put(`/users/999999`).send({
            name: "Novo Nome da Silva",
            email: "novoNomeDaSilva@gmail.com"
        });
        
        assert.deepStrictEqual(response.status, 404);
        assert.deepStrictEqual(response.body, "An operation failed because it depends on one or more records that were required but not found. No record was found for an update.");
    })
    
    test("Deve dar erro se tentar atualizar um email já existente", async () => {
        const user1 = await prisma.user.create({
            data: {
                name: faker.person.firstName(),
                email: faker.internet.email(),
                password: faker.string.alphanumeric(),
            },
        });
        
        const user2 = await prisma.user.create({
            data: {
                name: faker.person.firstName(),
                email: faker.internet.email(),
                password: faker.string.alphanumeric(),
            },
        });
        
        const response = await request(app).put(`/users/${user2.id}`).send({
            email: user1.email
        });
        
        assert.deepStrictEqual(response.status, 409);
        assert.deepStrictEqual(response.body, "Unique constraint failed on the fields: (`email`)")
    })
    
    test("Deve dar erro se tentar atualizar um email inválido", async () => {
        const user = await prisma.user.create({
            data: {
                name: faker.person.firstName(),
                email: faker.internet.email(),
                password: faker.string.alphanumeric(),
            },
        });
        
        const response = await request(app).put(`/users/${user.id}`).send({
            email: "test"
        })
        
        assert.deepStrictEqual(response.status, 400);
        assert.deepStrictEqual(response.body, "Invalid email");
    })
})