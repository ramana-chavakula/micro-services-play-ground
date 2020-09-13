FROM node:12
ENV HOME=/wrk
WORKDIR ${HOME}
COPY ./package.json ${HOME}/package.json
COPY ./src/ ${HOME}/src
RUN npm i
ENV PORT=8000
EXPOSE $PORT
CMD ["node", "src/index.js"]