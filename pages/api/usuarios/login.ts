import { Prisma, PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { checkEmail, isEmpty, isNullorUndefined, checkContrasenia } from "../functions";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if(req.method === "POST"){
        return await revisarDatos(req, res);
    }
    else{
        res.status(405).end();
    }
}

async function revisarDatos(req: NextApiRequest, res: NextApiResponse) {
    const body = JSON.parse(req.body);
    if (!('email' in body && 'contrasenia' in body)) {
        return res.status(400).json({message: "Falta el mail o la contraseña"});
    }
    else if(!checkEmail(body.email)){
        res.status(400).json({message: "El email no es valido"});
    }
    try{
        //const respuesta = await prisma.$queryRaw`SELECT contrasenia FROM usuario WHERE email = ${body.email}`;
        const user = await prisma.usuario.findFirst({
            where: {
                email: body.email,
                contrasenia: body.contrasenia
            }
        })
        if(user){
            console.log(user);
            return res.status(200).end();
        }
        else{
            return res.status(401).end();
        }
    } catch {
        return res.status(500).end();
    }
}