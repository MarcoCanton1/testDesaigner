import { Prisma, PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { checkEmail, isEmpty, isNullorUndefined, userExists, hasAccesToken, renewTokens } from "../functions";
import { cookies } from "next/headers";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const AT = cookies().get("DesAIgnerToken");
    const RT = cookies().get("DesAIgnerRefreshToken");
    const data = hasAccesToken(AT);
    if(req.method === "POST"){
        if(Object.keys(data).length != 0){
                const email = Object(data).email;
                if(req.body.email == email){
                    return await colecciones(req, res, email);
                }
                else{
                    res.status(403).end();
                }
            }
        else{
            const data = renewTokens(RT, res);
            if(Object.keys(data).length != 0){
                const email = Object(data).email; 
                return await colecciones(req, res, email);
            }
            else{
                res.status(403).end();
            }
        }
    }
    else{
        res.status(405).end();
    }
}

async function colecciones(req: NextApiRequest, res: NextApiResponse, email: string) {
    const body = req.body;

    //chequeos de informacion
    if(isNullorUndefined(email)){
        res.status(400).json({message: "El usuario es undefined o null"});
    }
    if(isEmpty(email)){
        res.status(400).json({message: "El usuario enviado estaba vacio"});
    }
    if(!checkEmail(email)){
        res.status(400).json({message: "El usuario no es valido"});
    }
    const usuarioExistente: boolean = await userExists(email, body.contrasenia);
    if(!usuarioExistente){
        res.status(400).json({message: "El usuario enviado no existe, quizas escribiste algun parametro mal"});
    }

    //la query en si
    try{
        const data = await prisma.coleccion.findMany({
            where:{
                duenio_id: email
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