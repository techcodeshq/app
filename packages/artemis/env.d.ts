declare namespace NodeJS {
  interface ProcessEnv {
    GOOGLE_CLIENT_ID: string;
    GOOGLE_CLIENT_SECRET: string;
    NEXTAUTH_SECRET: string;
    NEXT_PUBLIC_BACKEND_URL: string;
    NEXTAUTH_URL: string;
  }
}
