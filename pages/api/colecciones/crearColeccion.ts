import { Prisma, PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if(req.method === "POST"){
        return await crearColeccion(req, res);
    }
    else{
        res.status(405).end();
    }
}

async function crearColeccion(req: NextApiRequest, res: NextApiResponse){
    const body = req.body;

    try{
        const newUser = await prisma.usuario.create({
            data: {
                email: body.email,
                contrasenia: body.contrasenia,
                idioma: 0,
                estilo: 0,
                font: 0
            }
        });
        if(!newUser) {
            return res.status(400).json({message: "La cuenta ya existe"});
        }
        else if(newUser){
            return res.status(200).json({message: "Se a creado con exito el perfil para: " + newUser.email});
        }
    } catch {
        res.status(500).end();
    }
}