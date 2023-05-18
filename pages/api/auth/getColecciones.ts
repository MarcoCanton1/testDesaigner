import { Prisma, PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { checkEmail, isEmpty, isNullorUndefined, userExists } from "../functions";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if(req.method === "POST"){
        return await colecciones(req, res);
    }
    else{
        res.status(405).end();
    }
}

async function colecciones(req: NextApiRequest, res: NextApiResponse) {
    const body = req.body;

    //chequeos de informacion
    if(isNullorUndefined(body.email)){
        res.status(400).json({message: "El usuario es undefined o null"});
    }
    if(isEmpty(body.email)){
        res.status(400).json({message: "El usuario enviado estaba vacio"});
    }
    if(!checkEmail(body.email)){
        res.status(400).json({message: "El usuario no es valido"});
    }
    const usuarioExistente: boolean = await userExists(body.email, body.contrasenia);
    if(!usuarioExistente){
        res.status(400).json({message: "El usuario enviado no existe, quizas escribiste algun parametro mal"});
    }

    //la query en si
    try{
        const data = await prisma.coleccion.findMany({
            where:{
                duenio_id: body.email
            }
        })
        if(Object.keys(data).length == 0){
            return res.status(204).json({message: "El usuario no tiene colecciones"});
        }
        if(data){
            return res.status(200).json(data);
        }
        else{
            return res.status(400).json({message: "Algo salio mal"}); //no se si el status esta bien pero bue
        }
    } catch {
        return res.status(500).end();
    }
}