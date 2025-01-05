FROM node:20-slim
# Create app directory
WORKDIR /usr/src/app

COPY node_modules/ node_modules/
COPY server/dist dist

EXPOSE 3001
CMD [ "node", "dist/index.js" ]