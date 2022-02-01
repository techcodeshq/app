FROM node:16

WORKDIR /usr/src/app

COPY package.json ./

COPY yarn.lock ./

COPY prisma/ prisma/

COPY packages/apollo/ packages/apollo

RUN yarn 

COPY packages/apollo/ packages/apollo/

RUN yarn prisma generate
RUN yarn apollo build

ENV NODE_ENV production

EXPOSE 8000
 
CMD ["yarn", "apollo", "start"]
