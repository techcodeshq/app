import type { OAuthConfig, OAuthUserConfig } from "next-auth/providers";

export interface GoogleProfile {
  sub: string;
  name: string;
  email: string;
  picture: string;
}

export default function Google<P extends Record<string, any> = GoogleProfile>(
  options: OAuthUserConfig<P>
): OAuthConfig<P> {
  return {
    id: "google",
    name: "Google",
    type: "oauth",
    wellKnown: "https://accounts.google.com/.well-known/openid-configuration",
    authorization: { params: { scope: "openid email profile" } },
    idToken: true,
    checks: ["pkce", "state"],
    profile(profile, { access_token }) {
      return {
        id: profile.sub,
        name: profile.name,
        email: profile.email,
        image: profile.picture,
        organization: profile.hd || "",
        accessToken: access_token,
      } as any;
    },
    options,
  };
}
