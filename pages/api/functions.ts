import { Prisma, PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";

const prisma = new PrismaClient();

function checkEmail(email: string): boolean{
    const emailRegEx = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    return emailRegEx.test(email);
}

function isEmpty(variable: string): boolean{
    return variable.length <= 0;
}

function isNullorUndefined(variable: any): boolean{
    return variable == null || variable == undefined
}

function checkContrasenia(contrasenia: string): boolean{
    const contraseniaRegEx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#_@$!%*?&])[A-Za-z\d#_@$!%*?&]{8,}$/g;
    return contraseniaRegEx.test(contrasenia);
}

async function userExists(usuario: string, contrasenia: string): Promise<boolean>{
    try{
        const existe = await prisma.usuario.findFirst({
            where: {
                email: usuario,
                contrasenia: contrasenia
            }
        })
        if (existe){
            return true;
        }
        return false;
    } catch {
        return false;
    }
}

async function coleccionExists(nombre: string, duenio: string): Promise<boolean>{
    try{
        const existe = await prisma.coleccion.findFirst({
            where: {
                nombre: nombre,
                duenio_id: duenio
            }
        })
        if(existe){
            return true;
        }
        return false;
    } catch {
        return false;
    }
}

async function coleccionIsFromUser(email: string, coleccion: number): Promise<boolean>{
    try{
        const pertenece = await prisma.coleccion.findFirst({
            where: {
                id: coleccion,
                duenio_id: email
            }
        })
        if(pertenece){
            return true;
        }
        return false;
    } catch {
        return false;
    }
}

function isInt(variable: any): boolean{
    return Number.isInteger(variable);
}

function isBoolean(variable: any): boolean{
    return typeof variable == "boolean";
}

function hasAccesToken(token: any): Object{
    try {
        const data = jwt.verify(token, String(process.env.JWT_SECRET));
        return data;
    } catch {
        return {};
    }
}

function hasRefreshToken(refreshToken: any): Object{
    try{
        const data = jwt.verify(refreshToken, String(process.env.RJWT_SECRET))
        return data;
    } catch {
        return {};
    }
}

function renewTokens(refreshToken: any, res: NextApiResponse): Object{
    const data = hasRefreshToken(refreshToken);
    if(Object.keys(data).length == 0){
        return {};
    }

    const token = jwt.sign({
        email: Object(data).email
    }, String(process.env.JWT_SECRET), { expiresIn: "15m"})

    const refreshTkn = jwt.sign({
        email: Object(data).email,
        token: token
    },  String(process.env.RJWT_SECRET), { expiresIn: "30m"})

    const serialized = serialize("DesAIgnerToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV == "production",
        sameSite: "strict", 
        maxAge: 60 * 15, 
        path: "/"
    })

    const serializedRefresh = serialize("DesAIgnerRefeshToken", refreshTkn, {
        httpOnly: true,
        secure: process.env.NODE_ENV == "production",
        sameSite: "strict", 
        maxAge: 60 * 30, 
        path: "/"
    })

    res.setHeader("Set-Cookie", [serialized, serializedRefresh]);
    
    return data;
}

export { checkEmail, isEmpty, isNullorUndefined, checkContrasenia, userExists, coleccionExists, coleccionIsFromUser,
isInt, hasAccesToken, renewTokens, isBoolean };

