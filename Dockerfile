FROM oven/bun:latest

# Set working directory
WORKDIR /app

# Copy the project files to the container
COPY . .

# Create a non-root user and set permissions for the project folder
RUN addgroup --system appgroup && adduser --system --group appuser
RUN chown -R appuser:appgroup /app
COPY start.sh /start.sh
RUN chmod +x /start.sh

# Switch to non-root user
USER appuser

# Install dependencies
RUN bun install --frozen-lockfile --production

# Expose a port and run the application
EXPOSE 8000
CMD ["./start.sh"]