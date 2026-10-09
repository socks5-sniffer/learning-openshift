const path = require('path');

const [command, ...args] = process.argv.slice(2);
if (!['dev', 'build'].includes(command)) {
  throw new Error('Usage: node scripts/next.cjs <dev|build> [Next.js options]');
}

// On non-C: Windows drives, Node can return EISDIR when Webpack probes a
// regular path with readlink. Load the shim here and in Next's worker processes.
if (process.platform === 'win32' && !/^[Cc]:/i.test(process.cwd())) {
  const shim = path.join(__dirname, 'windows-readlink-compat.cjs');
  require(shim);
  const option = `--require=${JSON.stringify(shim)}`;
  process.env.NODE_OPTIONS = [process.env.NODE_OPTIONS, option].filter(Boolean).join(' ');
}

process.argv = [process.argv[0], require.resolve('next/dist/bin/next'), command, ...args];
require('next/dist/bin/next');
