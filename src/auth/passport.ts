import passport from "passport";
import { Strategy } from "passport-google-oauth2";

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user as any);
});

passport.use(
    new Strategy({
        clientID:
            "417852261372-98o962l2l92hudptskq8k22v22lhu5c0.apps.googleusercontent.com",
        clientSecret: "WOnxbjx8kfac8cZ7Gxch9SSz",
        callbackURL: "http://localhost:8000/google/callback",
        passReqToCallback: true,
    } as any)
);
