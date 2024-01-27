FROM node:20.10.0

WORKDIR /app
COPY . .

RUN npm install

EXPOSE 6090

CMD ["npm", "run", "publish"]
