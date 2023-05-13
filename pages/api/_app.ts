import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";

function MyApp({ Componente, pageProps, session}) {
    return (
        <SessionProvider session={session}>
            <Componente {...pageProps} />
        </SessionProvider>
    )
}

export default MyApp