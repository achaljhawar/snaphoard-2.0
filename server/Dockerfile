# Use the official Bun image
# See all versions at <https://hub.docker.com/r/oven/bun/tags>
FROM oven/bun:1 as base
WORKDIR /usr/src/app

# Install dependencies into a temp folder
# This will cache them and speed up future builds
FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lockb /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

# Install with --production (exclude devDependencies)
RUN mkdir -p /temp/prod
COPY package.json bun.lockb /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

# Copy node_modules from the temp folder
# Then copy all (non-ignored) project files into the image
FROM install AS prerelease
COPY --from=install /temp/dev/node_modules /usr/src/app/node_modules
COPY . .

# Optional: Run tests & build
# ENV NODE_ENV=production
# RUN bun test
# RUN bun run build

# Copy production dependencies and source code into the final image
FROM base AS release
COPY --from=install /temp/prod/node_modules /usr/src/app/node_modules
COPY --from=prerelease /usr/src/app /usr/src/app

# Set the user to bun and expose port 3000
USER bun
EXPOSE 3000/tcp

# Run the app
CMD ["bun", "run", "dev"]