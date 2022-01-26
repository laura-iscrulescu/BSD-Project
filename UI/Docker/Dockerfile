FROM node:16.13.2 AS builder

WORKDIR /bsd

COPY . .
RUN rm -f package-lock.json
RUN npm install
RUN npm run build

FROM nginx

COPY --from=builder /bsd/Docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /bsd/dist/ui /usr/share/nginx/bsd

EXPOSE 80
