import { Prisma, PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { checkEmail, isEmpty, isNullorUndefined } from "../functions";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await getSession({req});
    if(!session){
        //aca deberia buscar si existe la refresh token y hacer todo el quilombo ese
    }
    if(req.method === "DELETE"){
        return await deleteUsuario(req, res);
    }
    else{
        res.status(405).end();
    }
}

async function deleteUsuario(req: NextApiRequest, res: NextApiResponse) {
    const body = req.body;
    if (!('email' in body)) {
        return res.status(400).json({message: "Falta el email"});
    }
    if(isNullorUndefined(body.email)){
        res.status(400).json({message: "El email figura como null o undefined"});
    }
    if(isEmpty(body.email)){
        res.status(400).json({message: "El email enviado esta vacio"});
    }
    if(!checkEmail(body.email)){
        res.status(400).json({message: "El email no es valido"});
    }
    try{
        //falta el tema de buscar las colecciones y los diseños
    } catch {
        res.status(500).end();
    }
}