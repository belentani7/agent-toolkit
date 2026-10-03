FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY src/ ./src/
COPY config/ ./config/
COPY scripts/ ./scripts/
COPY .kanban/ ./.kanban/

RUN chmod +x scripts/*.sh

EXPOSE 8080

CMD ["python", "src/main.py", "start"]
