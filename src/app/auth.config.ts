import { CredentialsSignin, type NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials";

class InvalidLoginError extends CredentialsSignin {
    code = "Invalid identifier or password"
}

export type UserType = {
    email: string;
    id: string;
    image: string;
    name: string;
    accessToken: string;
}

export const CredentialsProvider = Credentials({
    credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
    },
    authorize: async (
        credentials: Partial<Record<"email" | "password" | "rememberMe", unknown>>,
    ) => {
        const apiUrl = `${process.env.NEXT_PUBLIC_API_BACKEND || 'http://localhost:5000/api/v1'}/user/login`;
        
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: credentials.email,
                password: credentials.password
            })
        })

        if (!response.ok) {
            throw new InvalidLoginError();
        }

        const result = await response.json()

        return {
            email: typeof credentials.email === "string" ? credentials.email : "vikas@gmail.com",
            id: result.user?.id || "1",
            image: result.user?.image || null,
            name: result.user?.name || "vikas",
            accessToken: result.token || 'dummy-token'
        };
    },
})


export default { providers: [CredentialsProvider] } satisfies NextAuthConfig