import { Parser, route, Response } from "typera-express";
import { authenticated } from "../middlewares/authenticated";
import * as t from "io-ts";
import { mail } from "../util/mail";

export module MailController {
  export const sendMessage = route
    .post("/")
    .use(authenticated)
    .use(
      Parser.body(
        t.type({
          from: t.string,
          subject: t.string,
          text: t.string,
        }),
      ),
    )
    .handler(async ({ body }) => {
      await mail.send({
        to: process.env.SENDGRID_TO_EMAIL,
        from: process.env.SENDGRID_FROM_EMAIL!,
        subject: body.subject,
        text: body.text,
      });

      return Response.noContent();
    });
}
