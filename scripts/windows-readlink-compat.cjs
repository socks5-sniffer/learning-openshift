const fs = require('fs');

// A regular file or directory is not a symlink. Some Windows drives report
// EISDIR for that readlink probe; Webpack expects EINVAL and handles it.
function normalize(error) {
  if (error?.code === 'EISDIR') {
    error.code = 'EINVAL';
    error.errno = -4071;
  }
  return error;
}

const readlink = fs.readlink;
fs.readlink = function (target, ...args) {
  const callback = args.pop();
  return readlink.call(this, target, ...args, (error, result) => callback(normalize(error), result));
};

const readlinkPromise = fs.promises.readlink;
fs.promises.readlink = async function (target, ...args) {
  try {
    return await readlinkPromise.call(this, target, ...args);
  } catch (error) {
    throw normalize(error);
  }
};

const readlinkSync = fs.readlinkSync;
fs.readlinkSync = function (target, ...args) {
  try {
    return readlinkSync.call(this, target, ...args);
  } catch (error) {
    throw normalize(error);
  }
};
