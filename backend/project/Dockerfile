# Use official Python image
FROM python:3.12-slim

# Set work directory
WORKDIR /app

# Prevent Python from writing .pyc files and buffering stdout
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install them
COPY requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy Django project files into the container
COPY project /app

# Expose Django port
EXPOSE 8000

# Default command to run Django server
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
