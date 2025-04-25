FROM python:3.9
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir torch --extra-index-url https://download.pytorch.org/whl/rocm6.3
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["python", "-u", "./client.py"]
