const isDev = process.env.NODE_ENV !== 'production';
const ts = () => new Date().toISOString();

const logger = {
  info:  (msg) => console.log(`${ts()} [INFO]  ${msg}`),
  warn:  (msg) => console.warn(`${ts()} [WARN]  ${msg}`),
  error: (msg, err) => {
    console.error(`${ts()} [ERROR] ${msg}`);
    if (err && isDev) console.error(err);
  },
  debug: (msg) => { if (isDev) console.log(`${ts()} [DEBUG] ${msg}`); },
};

module.exports = logger;
