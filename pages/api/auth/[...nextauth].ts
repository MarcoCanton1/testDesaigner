import NextAuth, {type NextAuthOptions} from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"


const authOptions: NextAuthOptions = {
    session: {
        strategy: 'jwt'
    },
    providers: [
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
        })
    ]
};

export default NextAuth(authOptions);