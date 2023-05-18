import { Prisma, PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { isEmpty, isNullorUndefined, checkEmail, coleccionExists, coleccionIsFromUser, isInt, hasAccesToken, renewTokens } from "../functions";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse, AT: string, RT: string) {
    if(hasAccesToken(AT)){
            if(req.method === "POST"){
            return await diseños(req, res);
        }
        else{
            res.status(405).end();
        }
    }
    else{
        renewTokens
    }
    
}

async function diseños(req: NextApiRequest, res: NextApiResponse){
    const body = req.body;

    if(isNullorUndefined(body.coleccion) || isNullorUndefined(body.email)){
        res.status(400).json({message: "La coleccion enviada es undefined o null"});
    }
    if(isEmpty(body.coleccion) || isEmpty(body.email)){
        res.status(400).json({message: "El nombre de la coleccion enviado esta vacio"});
    }
    if(!checkEmail(body.email)){
        res.status(400).json({message: "El usuario no es valido"});
    }
    if(!isInt(body.coleccion)){
        res.status(400).json({message: "La coleccion enviada no es un INT, debe ser un INT"});
    }
    if(!coleccionExists(body.coleccion)){
        res.status(400).json({message: "La coleccion enviada no existe"});
    }
    if(!coleccionIsFromUser(body.email, body.coleccion)){
        res.status(403).json({message: "No tienes acceso a esta coleccion"});
    }

    try{
        const data = await prisma.disenio.findMany({
            include: {
                colecciones: true,
            }
        }) 
    } catch {
        res.status(500).end();
    }
}