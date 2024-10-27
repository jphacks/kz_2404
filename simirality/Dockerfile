FROM python:3.11
WORKDIR /similarity
COPY ./requirements.txt /similarity/requirements.txt
RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r ./requirements.txt


COPY  ./ /similarity

