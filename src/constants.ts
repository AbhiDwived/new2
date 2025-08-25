export const env = {
    // API_BACKEND: process.env.NEXT_PUBLIC_API_BACKEND || 'https://api.mybestvenue.com/api/v1',
    API_BACKEND: process.env.NEXT_PUBLIC_API_BACKEND || 'http://localhost:5000/api/v1',
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || 'your-secret-key-here-change-this-in-production',
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'http://localhost:3000',
   
}
