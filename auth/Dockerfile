FROM python:3.6

# Update the package lists
RUN apt-get update

COPY . /authentication

WORKDIR /authentication

# Install the dependencies
RUN pip install --no-cache-dir -r requirements.txt

CMD ["python", "auth.py"]