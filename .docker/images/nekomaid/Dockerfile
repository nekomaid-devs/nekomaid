# Stage: build
FROM node:16-alpine
WORKDIR /usr/src/app
RUN apk update
RUN apk add bash jq

RUN apk add git build-base ffmpeg

RUN apk add --update --no-cache python3 && ln -sf python3 /usr/bin/python
RUN python3 -m ensurepip
RUN pip3 install --no-cache --upgrade pip setuptools

COPY package*.json ./
RUN yarn --no-cache

COPY . .
RUN yarn run build
RUN yarn remove $(cat package.json | jq -r '.devDependencies | keys | join(" ")')

# State: run
CMD [ "yarn", "serve" ]