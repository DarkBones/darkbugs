FROM ruby:2.7.1-alpine

RUN apk add --update --no-cache \
    build-base \
    postgresql-dev \
    sqlite-dev \
    git \
    file \
    imagemagick \
    nodejs-current \
    yarn \
    tzdata

# Create project directory (workdir)
WORKDIR /app

# Install gems
COPY Gemfile* ./
RUN bundle config --global frozen 1 \
 && bundle install -j4 --retry 3

# Add source code files to WORKDIR
COPY . .

# Install yarn packages (non-optimized version, remove if you are using optimized version above)
RUN yarn install

# Application port (optional)
EXPOSE 3000

# Container start command
CMD ["bundle", "exec", "rails", "server", "-p", "3000", "-b", "0.0.0.0"]
