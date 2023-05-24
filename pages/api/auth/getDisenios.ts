import { Prisma, PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { cookies } from "next/headers";
import { userExists, isEmpty, isNullorUndefined, checkEmail, coleccionExists, coleccionIsFromUser, isInt, hasAccesToken, renewTokens } from "../functions";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const AT = cookies().get("DesAIgnerToken");
    const RT = cookies().get("DesAIgnerRefreshToken");
    const data = hasAccesToken(AT);
    if(req.method === "POST"){
        if(Object.keys(data).length != 0){
                const email = Object(data).email;
                if(req.body.email == email){
                    return await diseños(req, res, email);
                }
                else{
                    res.status(403).end();
                }
            }
        else{
            const data = renewTokens(RT, res);
            if(Object.keys(data).length != 0){
                const email = Object(data).email; 
                return await diseños(req, res, email);
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

async function diseños(req: NextApiRequest, res: NextApiResponse, email: string){
    const body = req.body;

    if(isNullorUndefined(body.coleccion) || isNullorUndefined(email)){
        res.status(400).json({message: "Algun parametro enviado es undefined o null"});
    }
    if(isEmpty(body.coleccion) || isEmpty(email)){
        res.status(400).json({message: "El email o el nombre de la coleccion enviado esta vacio"});
    }
    if(!checkEmail(email)){
        res.status(400).json({message: "El usuario no es valido"});
    }
    if(!isInt(body.coleccion)){
        res.status(400).json({message: "La coleccion enviada no es un INT, debe ser un INT"});
    }
    const usuarioExistente: boolean = await userExists(email, body.contrasenia);
    if(!usuarioExistente){
        res.status(400).json({message: "El usuario enviado no existe, quizas escribiste algun parametro mal"});
    }
    if(!coleccionExists(body.coleccion, email)){
        res.status(400).json({message: "La coleccion enviada no existe"});
    }
    if(!coleccionIsFromUser(email, body.coleccion)){
        res.status(403).json({message: "No tienes acceso a esta coleccion"});
    }

    try{
        const data = await prisma.disenio.findMany({
            include: {
                colecciones: true,
            }
        })
        if(Object.keys(data).length == 0){
            return res.status(204).json({message: "La coleccion no tieene diseños"});
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