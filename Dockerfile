FROM kaiquewdev/docker-nodejs-compiled

ADD . /code
WORKDIR /code
RUN curl https://install.meteor.com/ | sh
RUN meteor
