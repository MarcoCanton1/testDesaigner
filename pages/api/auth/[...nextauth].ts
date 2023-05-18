import NextAuth, {type NextAuthOptions} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import DiscordProvider from "next-auth/providers/discord";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;


if (!GOOGLE_CLIENT_ID) {
    throw new Error("Google ID is missing in .env file WTH OMG :O >:(");
}
if (!GOOGLE_CLIENT_SECRET) {
    throw new Error("Google secret is missing in .env file WTH OMG :O >:(");
}
if (!DISCORD_CLIENT_ID) {
    throw new Error("Discord ID is missing in .env file WTH OMG :O >:(");
}
if (!DISCORD_CLIENT_SECRET) {
    throw new Error("Discord secret is missing in .env file WTH OMG :O >:(");
}



export default NextAuth ({
    session: {
        strategy: 'jwt'
    },
    adapter: PrismaAdapter(prisma),
    providers: [
        GoogleProvider({
            clientId: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET,
        }),
        DiscordProvider({
            clientId: DISCORD_CLIENT_ID,
            clientSecret: DISCORD_CLIENT_SECRET
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
    secret: process.env.JWT_SECRET,
    callbacks: {
        async jwt({ token, user }){
            return { ...token, ...user };
        },
        async session({ session, token, user }) {
            session.user = token;
            return session;
        },
    },
});
