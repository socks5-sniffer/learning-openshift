FROM registry.access.redhat.com/ubi9/nodejs-22:latest@sha256:e52f879096f28d9a6cfb308b3bf2c71c0fc35caec613060bbe41dac054002831 AS build

WORKDIR /opt/app-root/src
ENV NEXT_TELEMETRY_DISABLED=1 NEXT_STANDALONE=1
COPY --chown=1001:0 package.json package-lock.json ./
RUN npm ci
COPY --chown=1001:0 . .
RUN npm run build

FROM registry.access.redhat.com/ubi9/nodejs-22-minimal:latest@sha256:03b7dd64cafaaca5019c4cc1c36e05140b1650dab6cd5c4ab1fde9d88c0537ca AS runtime

WORKDIR /opt/app-root/src
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    HOSTNAME=0.0.0.0 \
    PORT=3000
COPY --from=build --chown=1001:0 /opt/app-root/src/.next/standalone ./
COPY --from=build --chown=1001:0 /opt/app-root/src/.next/static ./.next/static
COPY --from=build --chown=1001:0 /opt/app-root/src/public ./public
# OpenShift assigns a user ID in the project's range, with access to group 0.
USER 0
RUN chgrp -R 0 /opt/app-root/src && chmod -R g=u /opt/app-root/src
USER 1001
EXPOSE 3000
CMD ["node", "server.js"]
