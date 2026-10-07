// A stray NODE_ENV=production in the shell/IDE environment makes the dev
// server load production React and show a blank page. Pin it, then hand
// over to craco's own start script (it reads NODE_ENV on load).
process.env.NODE_ENV = "development";
process.env.BABEL_ENV = "development";
require("@craco/craco/dist/scripts/start");
