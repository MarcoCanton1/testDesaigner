import NextAuth, {type NextAuthOptions} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/GoogleProvider";
import DiscordProvider from "next-auth/providers/DiscordProvider";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default NextAuth ({
    session: {
        strategy: 'jwt'
    },
    adapter: PrismaAdapter(prisma),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        DiscordProvider({
            clientId: process.env.DISCORD_CLIENT_ID,
            clientSecret: process.env.DISCORD_CLIENT_SECRET
        }),
        CredentialsProvider({
            name: 'Credenciales',
            credentials: {
            email: { label: "Email", type: "email" },
            contrasenia: { label: "Contrasenia", type: "password" }
            },
            async authorize(credentials) {
                const {email,contrasenia}=credentials as any;
                const res = await fetch("http://localhost:3000/api/usuarios/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email,
                        contrasenia
                    })
                });

                const usuario = await res.json();

                if(res.ok && usuario){
                    return usuario;
                }
                else{
                    return null;
                }
            }    
        }),
    ],
    secret: process.env.JWT_SECRET
});
