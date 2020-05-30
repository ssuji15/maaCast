FROM node:latest

#RUN apt update -y
#RUN apt install nodejs -y
#RUN apt install npm -y

WORKDIR /app/
COPY maaCast /app/
RUN npm install

WORKDIR /app/filebeat
COPY filebeat-7.7.0-linux-x86_64 /app/filebeat
CMD chown root filebeat.yml

COPY myscript.sh /app
WORKDIR /app
CMD ./myscript.sh
EXPOSE 8081
