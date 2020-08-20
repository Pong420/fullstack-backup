const ghpages = require('gh-pages');
const { exec } = require('child_process');

// const branch =
// https://pong420.github.io/fullstack/
const public_url = 'https://pong420.github.io/fullstack/';

const execPromise = command => {
  return new Promise((resolve, reject) => {
    const cmd = exec(command, error => {
      if (error) {
        reject(error);
        return;
      }
      resolve();
    });

    cmd.stdout.on('data', data => {
      console.log(data.trim());
    });
  });
};

async function init() {
  await execPromise(`expo export --public-url ${public_url} --force`);

  ghpages.publish('dist', { branch: 'expo-app' }, function (err) {
    // eslint-disable-next-line
    console.log(err);
  });
}

init();
