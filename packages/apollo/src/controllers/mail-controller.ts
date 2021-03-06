import { Parser, route, Response } from "typera-express";
import { authenticated, authorized } from "../middlewares/authenticated";
import * as t from "io-ts";
import { mail } from "../util/mail";
import { Role } from "@prisma/client";

export module MailController {
  export const sendMessage = route
    .post("/")
    .use(authenticated)
    .use(authorized([Role.EXEC]))
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
        subject: `Contact Form: ${body.subject}`,
        text: `${body.from} has sent you a message:\n${body.text}`,
      });

      return Response.noContent();
    });
}
