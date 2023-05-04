import { Prisma, PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if(req.method === "POST"){
        return await revisarInfo(req, res)
    }
    else{
        res.status(405).end()
    }
}

async function revisarInfo(req: NextApiRequest, res: NextApiResponse) {
    
}