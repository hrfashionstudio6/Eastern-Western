import { spawn } from "node:child_process";

const npmCmd = process.platform === "win32" ? "npm.cmd" : "npm";
const env = { ...process.env, HOST: "127.0.0.1", PORT: process.env.PORT || "5050" };
const children = [
  spawn(process.execPath, ["server/server.js"], { stdio: "inherit", env }),
  spawn(npmCmd, ["run", "client", "--", "--host", "127.0.0.1"], { stdio: "inherit", env, shell: process.platform === "win32" }),
];

function stop() {
  for (const child of children) child.kill();
  process.exit();
}

process.on("SIGINT", stop);
process.on("SIGTERM", stop);
