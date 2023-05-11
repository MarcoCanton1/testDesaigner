import { Prisma, PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if(req.method === "DELETE"){
        return await deleteUsuario(req, res);
    }
    else{
        res.status(405).end();
    }
}

async function deleteUsuario(req: NextApiRequest, res: NextApiResponse) {
    const body = req.body;
    if (!('email' in body && 'contrasenia' in body)) {
        return res.status(400).json({message: "Falta el mail o la contraseña"});
    }
    else if(!checkEmail(body.email)){
        res.status(400).json({message: "El email no es valido"});
    }
    try{
        //falta el tema de buscar las colecciones y los diseños
    } catch {
        res.status(500).end();
    }
}

function checkEmail(email: string){
    const emailRegEx = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    if(emailRegEx.test(email)){
        return true;
    }
    else{
        return false;
    }
}