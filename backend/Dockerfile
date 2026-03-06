#docker build . -t backend-docker
#docker run -p 8081:3000 -d backend-docker #DEBUG
#docker run -p 80:XXXXX -d 'name' #PROD
#docker image tag backend-docker:node20-alpine truenoob/backend-docker:node20-alpine

FROM node:20-alpine AS builder

WORKDIR /app/backend

COPY package*.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

EXPOSE 3000

CMD ["node", "dist/main.js"] 

# Production stage
#FROM node:20-alpine

#WORKDIR /app/backend

#COPY package*.json yarn.lock ./

#RUN yarn install --production --frozen-lockfile

#COPY --from=builder /app/dist ./dist

#CMD ["node", "./dist/main.js"] 