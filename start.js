var daemon = require("daemonize2").setup({
  main: "server.ts",
  name: "server",
  pidfile: "sampleapp.pid",
});

switch (process.argv[2]) {
  case "start":
    daemon.start();
    break;

  case "stop":
    daemon.stop();
    break;

  default:
    console.log("Usage: [start|stop]");
}
