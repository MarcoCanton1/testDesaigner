import { Prisma, PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { checkEmail, isEmpty, isNullorUndefined, userExists } from "../functions";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if(req.method === "POST"){
        return await crearColeccion(req, res);
    }
    else{
        res.status(405).end();
    }
}

function crearColeccion(req: NextApiRequest, res: NextApiResponse){
    const body = req.body;
}