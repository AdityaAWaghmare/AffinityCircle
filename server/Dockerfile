FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Expose the port the app runs on
EXPOSE 5000

ENV PORT=5000
ENV RECOMMENDER_URL=http://recommender:8000
ENV DB_MIN_CONN=1
ENV DB_MAX_CONN=20

CMD ["npm", "start"]