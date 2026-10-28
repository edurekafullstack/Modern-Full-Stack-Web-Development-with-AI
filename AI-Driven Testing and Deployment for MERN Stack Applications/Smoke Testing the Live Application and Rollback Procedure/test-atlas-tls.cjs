const tls = require("node:tls");

const hosts = [
  "ac-8w749vs-shard-00-00.lzkbkih.mongodb.net",
  "ac-8w749vs-shard-00-01.lzkbkih.mongodb.net",
  "ac-8w749vs-shard-00-02.lzkbkih.mongodb.net"
];

for (const host of hosts) {
  const socket = tls.connect({
    host,
    port: 27017,
    servername: host,
    timeout: 10000
  }, () => {
    console.log(host, "TLS OK:", socket.getProtocol());
    socket.end();
  });

  socket.on("error", error => {
    console.log(host, "TLS FAILED:", error.message);
  });

  socket.on("timeout", () => {
    console.log(host, "TLS TIMEOUT");
    socket.destroy();
  });
}
