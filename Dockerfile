FROM oven/bun:latest

# Set working directory
WORKDIR /app

# Copy the project files to the container
COPY . .

# Create a non-root user and set permissions for the project folder
RUN addgroup --system appgroup && adduser --system --group appuser
RUN chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

# Run Prisma generate
RUN bunx prisma generate

# Install dependencies
RUN bun install --frozen-lockfile --production

# Expose a port and run the application
EXPOSE 8000
CMD ["bun", "run", "start"]