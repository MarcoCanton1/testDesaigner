import { Prisma, PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { cookies } from "next/headers";
import { coleccionExists, checkEmail, isEmpty, isNullorUndefined, userExists, hasAccesToken, renewTokens, isBoolean } from "../functions";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const AT = cookies().get("DesAIgnerToken");
    const RT = cookies().get("DesAIgnerRefreshToken");
    const data = hasAccesToken(AT);
    if(req.method === "POST"){
        if(Object.keys(data).length != 0){
                const email = Object(data).email;
                if(req.body.email == email){
                    return await crearColeccion(req, res, email);
                }
                else{
                    res.status(403).end();
                }
            }
        else{
            const data = renewTokens(RT, res);
            if(Object.keys(data).length != 0){
                const email = Object(data).email; 
                return await crearColeccion(req, res, email);
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

async function crearColeccion(req: NextApiRequest, res: NextApiResponse, email: string){
    const body = req.body;

    if(isNullorUndefined(body.nombre) || isNullorUndefined(email || isNullorUndefined(body.favorito))){
        res.status(400).json({message: "Algun parametro enviado es undefined o null"});
    }
    if(isEmpty(email) || isEmpty(body.nombre)){
        res.status(400).json({message: "O el usuario o el nombre de la coleccion estan vacios"});
    }
    if(!isBoolean(body.favorito)){
        res.status(400).json({message: "El parametro de favorito no fue recibido como bool, tiene que serlo"});
    }
    if(!checkEmail(email)){
        res.status(400).json({message: "El usuario no es valido"});
    }
    const usuarioExistente: boolean = await userExists(email, body.contrasenia);
    if(!usuarioExistente){
        res.status(400).json({message: "El usuario enviado no existe, quizas escribiste algun parametro mal"});
    }
    const coleccionExistente: boolean = await coleccionExists(body.nombre, email);
    if(coleccionExistente){
        res.status(400).json({message: "La coleccion enviada ya existe"});
    }


    try{
        const newColeccion = await prisma.coleccion.create({
            data: {
                nombre: body.nombre,
                favorito: body.favorito,
                duenio_id: email
            }
        })
        if(newColeccion){
            return res.status(200).json({message: "Nueva coleccion creada con exito"});
        }
    } catch {
        return res.status(500).end();
    }
}