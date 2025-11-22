FROM python:3.11-slim

WORKDIR /app

# Install system dependencies for potential image processing libraries
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
# Install torch cpu version for lighter container in PoC
RUN pip3 install --no-cache-dir -i https://pypi.douban.com/simple/ -r requirements.txtps://pypi.douban.com/simple/ -r requirements.txt

COPY . .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
