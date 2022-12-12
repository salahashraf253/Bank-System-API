const {readFileSync} = require('fs');

function syncReadFile(filename) {
  const contents = readFileSync(filename, 'utf-8');
  const credentials = contents.split(/\r?\n/);
  return credentials;
}
module.exports=syncReadFile('./dbAccess.txt');;