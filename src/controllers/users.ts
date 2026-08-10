import { Request, Response } from "express";

import { prisma } from "../../config/prisma";
import { handleErrors } from "../helpers/handleErrors";
import { validateEmail } from "../helpers/validateData";
import bcrypt from "bcrypt"
import { request } from "node:http";
import { generateToken } from "../helpers/jwt";

export default {
  login: async (request:Request, response: Response) => {
    try {
      const { email, password } = request.body;

      if ( !email || !password ) {
        return response.status(400).json("Email and password are required");
      }

      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (!user) {
        return response.status(401).json("Invalid email or password")
      }

      if (!bcrypt.compareSync(password, user.password)) {
        return response.status(401).json("Invalid email or password");
      }
      return response.status(200).json(generateToken({ id: user.id }));
    } catch (e) {
      return handleErrors(e, response);
    }
  },

  create: async (request: Request, response: Response) => {
    try {
      const { email, name, password } = request.body;

      if (!email || !password) {
        return response.status(400).json("User data incomplete");
      }

      if(!validateEmail(email)) {
        return response.status(400).json("Invalid email");
      }

      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: bcrypt.hashSync(password, +process.env.BCRYPT_ROUNDS!)
        },
        omit: {
          password: true
        }
      });

      return response.status(201).json(user);
    } catch (e) {
      return handleErrors(e, response);
    }
  },

  list: async (request: Request, response: Response) => {
    try {
      const users = await prisma.user.findMany({
        omit: {
          password: true,
        },
      });
      return response.status(200).json(users);
    } catch (e) {
      return handleErrors(e, response);
    }
  },

  getById: async (request: Request, response: Response) => {
    try {
      const { id } = request.params;
      const user = await prisma.user.findUnique({
        where: {
          id: +id,
        },
        omit: {
          password: true,
        },
      });
      if (!user) {
        return response.status(404).json("User not found");
      };
      
      return response.status(200).json(user);
    } catch (e) {
      return handleErrors(e, response);
    }
  },

  update: async (request: Request, response: Response) => {
    try {
      const { id } = request.params;
      const { name, email, password } = request.body;

      if(email && !validateEmail(email)) {
        return response.status(400).json("Invalid email");
      }

      const user = await prisma.user.update({
        data: {
          name,
          email,
          password: password ? bcrypt.hashSync(password, +process.env.BCRYPT_ROUNDS!) : undefined
        },
        where: { id: +id },
        omit: {
          password: true
        }
      });
      if (!user) {
        return response.status(404).json("User not found");
      };

      return response.status(200).json(user);
    } catch (e) {
      return handleErrors(e, response);
    }
  },

  delete: async (request: Request, response: Response) => {
    try {
      const { id } = request.params;

      const user = await prisma.user.delete({
        where: {
          id: +id,
        },
        omit: {
          password: true
        }
      });
      if (!user) {
        return response.status(404).json("User not found");
      };

      return response.status(200).json(user);
    } catch (e) {
      return handleErrors(e, response);
    }
  },
};
