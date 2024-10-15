FROM python:3.6

WORKDIR /follow

ENV PYTHONDONTWRITEBYTECODE 1

# Update the package lists
RUN apt-get update

ENV FLASK_APP=server.py

ENV FLASK_ENV=development

COPY ./requirements.txt ./requirements.txt

COPY . .

RUN pip install -r requirements.txt

EXPOSE 5178

CMD ["python", "server.py"]