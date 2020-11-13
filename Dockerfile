FROM ruby:2.7.1-alpine

ENV BUNDLE_PATH /box
ENV APP_HOME=/app
ENV PATH=$APP_HOME/bin:$PATH

RUN apk add --update --no-cache \
    build-base \
    linux-headers \
    ca-certificates \
    bash \
    libpq \
    git \
    nodejs \
    postgresql \
    postgresql-client \
    postgresql-dev \
    yarn \
    vim

COPY Gemfile* /tmp/
COPY vendor /tmp/vendor/
WORKDIR /tmp
RUN gem install bundler
RUN gem install rake
RUN bundle install

ENV app /app
RUN mkdir $APP_HOME
WORKDIR $APP_HOME
ADD . $APP_HOME

EXPOSE 3000

RUN bundle exec whenever --update-crontab

ENTRYPOINT ["bundle", "exec"]
CMD ["bundle", "exec", "rails", "server", "-b", "0.0.0.0"]
