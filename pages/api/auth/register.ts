import { Prisma, PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { checkEmail, isEmpty, isNullorUndefined, checkContrasenia } from "../functions";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if(req.method === "POST"){
        return await crearUsuario(req, res);
    }
    else{
        res.status(405).end();
    }
}

async function crearUsuario(req: NextApiRequest, res: NextApiResponse){
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
    if(!checkEmail(body.email)){
        res.status(400).json({message: "El email no es valido"});
    }
    if(!checkContrasenia(body.contrasenia)){
        res.status(400).json({message: "La contrasenia no cumple con los parametros requeridos"});
    }
    try{
        const newUser = await prisma.usuario.create({
            data: {
                email: body.email,
                contrasenia: body.contrasenia,
            }
        });
        if(newUser){
            return res.status(200).json({message: "Se ha creado con exito el perfil para: " + newUser.email});
        }
        
    } catch(error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            return res.status(400).json({message: "La cuenta ya existe"});
        }
        return res.status(500).end();
    }

    async function crearAdmin(req: NextApiRequest, res: NextApiResponse){
        //esta funcion se espera que se use de forma correcta y por ende no trae ningn tipo de revisión
        const body = req.body;
        try{
            const newUser = await prisma.usuario.create({
                data: {
                    email: body.email,
                    contrasenia: body.contrasenia,
                    rolUsuario: 1
                }
            });
            console.log(newUser.rolUsuario, newUser);
            if(newUser && newUser.rolUsuario == 1){
                return res.status(200).json({message: "Se a creado con exito el perfil de admin 😎🤑 para: " + newUser.email});
            }
            else if (newUser) {
                return res.status(200).json({message: "Se a creado con exito el perfil para: " + newUser.email});
            }
            
        } catch(error) {
            console.log(typeof error, error);
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                return res.status(400).json({message: "La cuenta ya existe"});
            }
            return res.status(500).end();
        }
    }
}