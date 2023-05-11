import { Prisma, PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

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

export { checkEmail, isEmpty, isNullorUndefined, checkContrasenia };

