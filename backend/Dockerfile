FROM python:3.9

WORKDIR /usr/src/backend

COPY backend/requirements.txt /usr/src/backend/requirements.txt

RUN pip install --no-cache-dir --upgrade -r /usr/src/backend/requirements.txt

COPY ./backend /usr/src/backend/app

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8001", "--reload"]
