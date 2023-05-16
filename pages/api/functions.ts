import { Prisma, PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

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

export { checkEmail, isEmpty, isNullorUndefined, checkContrasenia, userExists };

