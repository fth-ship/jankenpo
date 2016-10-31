FROM kaiquewdev/docker-nodejs-compiled

ADD . /code
WORKDIR /code
RUN apt-get update; apt-get install curl
RUN curl https://install.meteor.com/ | sh
RUN meteor
