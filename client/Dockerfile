FROM node:alpine as builder
WORKDIR '/app'
COPY package.json .
RUN npm install
COPY . .
RUN npm run build

# second from means previous terminates first block
FROM nginx
# elastic beanstalk, looks for expose instruction
# elastic beanstalk will map automatically
EXPOSE 3000
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build /usr/share/nginx/html
# we don't need to add command to start since it does nginx by default
