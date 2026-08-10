import test, { describe } from "node:test";
import { validateEmail, validateId } from "./validateData";
import { faker } from "@faker-js/faker";
import assert from "node:assert";

describe("Testes do validateEmail:", () => {
    test("Deve retornar true para emails válidos", () => {
        const response = validateEmail(faker.internet.email());
        assert.deepStrictEqual(response, true);
    });

    test("Deve retornar false para emails sem @", () => {
        const response = validateEmail("email.com");
        assert.deepStrictEqual(response, false);
    });

    test("Deve retornar false para emails sem .", () => {
        const response = validateEmail("email@email");
        assert.deepStrictEqual(response, false);
    })
});

describe("Testes do validadeId:", () => {
    test("Deve retornar true para ids válidos", () => {
        const response = validateId(faker.number.int().toString());
        assert.deepStrictEqual(response, true);
    });

    test("Deve retornar false para id que não é número", () => {
        const response = validateId(faker.string.alpha());
        assert.deepStrictEqual(response, false);
    })

    test("Deve retornar false para id 0", () => {
        const response = validateId("0");
        assert.deepStrictEqual(response, false);
    })

    test("Deve retornar false para id negativo", () => {
        const response = validateId((-faker.number.int()).toString());
        assert.deepStrictEqual(response, false);
    })

    test("Deve retornar false para id decimal", () => {
        const response = validateId(faker.number.float().toString());
        assert.deepStrictEqual(response, false);
    })
});