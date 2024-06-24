FROM oven/bun:1 as base
WORKDIR /usr/src/app

# Declare ARG instructions for build-time variables
ARG PASSWORDSEED
ARG EMAIL
ARG EMAIL_PASSWORD
ARG SUPABASE_URL
ARG SUPABASE_KEY
ARG FRONTEND_URL


# Set ENV instructions to use the ARG values
ENV PASSWORDSEED=${PASSWORDSEED}
ENV EMAIL=${EMAIL}
ENV EMAIL_PASSWORD=${EMAIL_PASSWORD}
ENV SUPABASE_URL=${SUPABASE_URL}
ENV SUPABASE_KEY=${SUPABASE_KEY}
ENV FRONTEND_URL=${FRONTEND_URL}


# Install dependencies into a temp folder
FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lockb /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

RUN mkdir -p /temp/prod
COPY package.json bun.lockb /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

# Copy node_modules from the temp folder
FROM base AS prerelease
COPY --from=install /temp/dev/node_modules /usr/src/app/node_modules
COPY . .

# Copy production dependencies and source code into the final image
FROM base AS release
COPY --from=install /temp/prod/node_modules /usr/src/app/node_modules
COPY --from=prerelease /usr/src/app /usr/src/app

# Set the user to bun
USER bun

# Sliplane will provide the PORT, so we don't need to set it here
# We'll use an EXPOSE instruction without a specific port
EXPOSE 8080-65535

# Run the app
CMD ["bun", "run", "start"]