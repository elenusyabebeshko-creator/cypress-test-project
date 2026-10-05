# Образ базується на офіційному cypress/browsers (Node + Chrome + Firefox + Edge).
# Тег образу та версія Cypress передаються з docker-compose.yml.
ARG BASE_IMAGE=cypress/browsers:latest
FROM ${BASE_IMAGE}

ARG CYPRESS_VERSION=latest

# husky (скрипт prepare) у контейнері без git не потрібен
ENV HUSKY=0 \
    CI=true

WORKDIR /e2e

COPY package*.json ./
RUN npm ci

# Перевстановлюємо Cypress на потрібну версію (бінарник завантажується postinstall-скриптом)
RUN npm install --no-save cypress@${CYPRESS_VERSION} \
    && npx cypress verify \
    && npx cypress --version

COPY . .

# Браузер і конфіг задаються командою в docker-compose.yml
ENTRYPOINT ["npx", "cypress", "run"]
