# make sure you have a database up and running before running this dockerfile

FROM node:16-alpine as builder

WORKDIR /app

COPY . .

RUN yarn install --frozen-lockfile
RUN yarn build

FROM node:16-alpine

WORKDIR /app

COPY --from=builder /app/package.json /app/yarn.lock ./

RUN yarn install --frozen-lockfile --production

COPY --from=builder /app/build /app/prisma ./

RUN yarn prisma:generate

EXPOSE 3000

CMD ["node", "./index.js"]
