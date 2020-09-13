FROM ruby:2.7.1-alpine

ENV BUNDLE_PATH /bundle
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
    yarn

RUN mkdir /$APP_HOME
WORKDIR /$APP_HOME

COPY Gemfile* ./
COPY vendor ./vendor

RUN gem install bundler \
    && gem install rake

RUN bundle install --jobs=2
COPY . ./

EXPOSE 3000

ENTRYPOINT ["bundle", "exec"]
CMD ["bundle", "exec", "rails", "server", "-b", "0.0.0.0"]
