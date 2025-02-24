import net from "node:net";
import { SocksClient } from "socks";
import { z } from "zod";

const RemoteProxyConfigSchema = z.object({
  REMOTE_PROXY_PROTOCOL: z.string(),
  REMOTE_PROXY_URL: z.string(),
  REMOTE_PROXY_LOGIN: z.string(),
  REMOTE_PROXY_PASSWORD: z.string(),
});

const LocalProxyConfigSchema = z.object({
  LOCAL_PROXY_PORT: z.string(),
});

const remoteProxyConfig = RemoteProxyConfigSchema.parse(process.env);
const localProxyConfig = LocalProxyConfigSchema.parse(process.env);

const server = net.createServer((clientSocket) => {
  console.log("Client connected:", clientSocket.remoteAddress, clientSocket.remotePort);

  clientSocket.once("data", async (handshake) => {
    try {
      // Обработка этапа 1: Метод выбора
      if (handshake[0] !== 0x05) {
        console.error("Unsupported SOCKS version:", handshake[0]);
        clientSocket.end();
        return;
      }

      const numMethods = handshake[1];
      const methods = handshake.subarray(2, 2 + numMethods);

      // Предполагаем, что клиент поддерживает метод без аутентификации (0x00)
      if (!methods.includes(0x00)) {
        console.error("Client doesn't support no-authentication method");
        clientSocket.end();
        return;
      }

      // Этап 2: Выбор метода сервером (без аутентификации)
      clientSocket.write(Buffer.from([0x05, 0x00]));

      // Ожидаем запрос на подключение
      clientSocket.once("data", async (request) => {
        try {
          // Обработка запроса на подключение
          if (request[0] !== 0x05 || request[1] !== 0x01) {
            // Версия 5, команда CONNECT
            console.error("Unsupported SOCKS request:", request.slice(0, 2));
            clientSocket.end();
            return;
          }

          let destinationHost;
          let destinationPort;
          const addressType = request[3];

          if (addressType === 0x01) {
            // IPv4 address
            destinationHost = `${request[4]}.${request[5]}.${request[6]}.${request[7]}`;
            destinationPort = request.readUInt16BE(8);
          } else if (addressType === 0x03) {
            // Domain name
            const domainLength = request[4];
            destinationHost = request.subarray(5, 5 + domainLength).toString();
            destinationPort = request.readUInt16BE(5 + domainLength);
          } else if (addressType === 0x04) {
            // IPv6 address
            console.error("IPv6 is not supported");
            clientSocket.end();
            return;
          } else {
            console.error("Unsupported address type:", addressType);
            clientSocket.end();
            return;
          }

          console.log("Connecting to:", destinationHost, destinationPort);

          // Перенаправляем запрос на внешний SOCKS5 прокси
          const { socket: externalSocket } = await SocksClient.createConnection({
            proxy: {
              ipaddress: remoteProxyConfig.REMOTE_PROXY_URL.split(":")[0],
              port: +remoteProxyConfig.REMOTE_PROXY_URL.split(":")[1],
              type: 5 as const,
              userId: remoteProxyConfig.REMOTE_PROXY_LOGIN,
              password: remoteProxyConfig.REMOTE_PROXY_PASSWORD,
            },
            command: "connect",
            destination: {
              host: destinationHost,
              port: destinationPort,
            },
            timeout: 20000,
          });

          // Отправляем клиенту SOCKS5 ответ об успешном подключении
          const response = Buffer.from([0x05, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);
          clientSocket.write(response);

          // Пересылаем данные между клиентом и внешним прокси
          clientSocket.pipe(externalSocket);
          externalSocket.pipe(clientSocket);

          externalSocket.on("error", (err) => {
            console.error("Remote proxy error:", err);
            clientSocket.end();
          });

          clientSocket.on("error", (err) => {
            console.error("Client error:", err);
            externalSocket.end();
          });

          externalSocket.on("close", () => {
            console.log("External proxy connection closed");
            clientSocket.end();
          });

          clientSocket.on("close", () => {
            console.log("Client connection closed");
            externalSocket.end();
          });
        } catch (error) {
          console.error("Error processing request:", error);
          // Отправляем клиенту SOCKS5 ответ об ошибке
          clientSocket.write(Buffer.from([0x05, 0x01, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]));
          clientSocket.end();
        }
      });
    } catch (error) {
      console.error("Error during handshake:", error);
      clientSocket.end();
    }
  });

  clientSocket.on("error", (err) => {
    console.error("Client-side error:", err);
  });
});

server.listen(+localProxyConfig.LOCAL_PROXY_PORT, "0.0.0.0", () => {
  console.log(
    `SOCKS5 local proxy server successfully launched and listening on port ${localProxyConfig.LOCAL_PROXY_PORT}`
  );
});

server.on("error", (err) => {
  console.error("SOCKS5 local proxy server error:", err);
});
