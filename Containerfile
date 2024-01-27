FROM node:20.10.0

WORKDIR /app
COPY . .

RUN npm install
RUN npm run generate-config
RUN npm run build

EXPOSE 6090

CMD ["npm", "run", "start"]
