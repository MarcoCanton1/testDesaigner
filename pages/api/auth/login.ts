import { Prisma, PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { checkEmail, isEmpty, isNullorUndefined, checkContrasenia } from "../functions";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";

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
    const body = req.body;
    if (!('email' in body && 'contrasenia' in body)) {
        return res.status(400).json({message: "Falta el mail o la contraseña"});
    }
    if(isNullorUndefined(body.email) || isNullorUndefined(body.contrasenia)){
        res.status(400).json({message: "Algun parametro es null o undefined"});
    }
    if(isEmpty(body.email) || isEmpty(body.contrasenia)){
        res.status(400).json({message: "Algun parametro esta vacio"});
    }
    if(!checkContrasenia(body.contrasenia)){
        res.status(400).json({message: "La contrasenia no es valida"});
    }
    if(!checkEmail(body.email)){
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
            const token = jwt.sign({
                maxAge: 60 * 15,
                email: body.email,
                contrasenia: body.contrasenia
            }, String(process.env.JWT_SECRET))
            //falta la creacion de la refresh token

            const refreshToken = jwt.sign({
                maxAge: 60 * 30,
                email: body.email,
                contrasenia: body.contrasenia,
                token: token
            },  String(process.env.JWT_SECRET))

            const serialized = serialize("DesAIgnerToken", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV == "production",
                sameSite: "strict", //puesto que el back esta concetado directamente con el front, debe ser asi pero es algo que podria cambiar a none
                maxAge: 60 * 15, 
                path: "/"
            })

            const serializedRefresh = serialize("DesAIgnerRefeshToken", refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV == "production",
                sameSite: "strict", 
                maxAge: 60 * 30, 
                path: "/"
            })

            res.setHeader("Set-Cookie", serialized);
            res.setHeader("Set-Cookie", serializedRefresh);
            return res.status(200).end();
        }
        else{
            return res.status(401).end();
        }   
    } catch {
        return res.status(500).end();
    }
}