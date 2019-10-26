FROM node:11-alpine

# Set a working directory
WORKDIR /var/www/html


# Copy application files
COPY ./libeo ./libeo
COPY ./package.json ./package.json

RUN yarn workspace libeo --production --pure-lockfile

# Run the container under "node" user by default
# USER node

# Run PM2 for prod
CMD [ "yarn", "workspace", "libeo", "run", "start" ]
