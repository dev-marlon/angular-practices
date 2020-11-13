const { exec } = require('child_process');
const ngVersion = process.argv.slice(2)[0];
const projectName = process.argv.slice(2)[1];

if (ngVersion === undefined) {
    console.log('Specify the angular version.');
    return;
}

if (projectName === undefined) {
    console.log('Project name missing.');
    return;
}

const command = `npx -p @angular/cli@${ngVersion} ng new ${projectName} --minimal --skipGit=true --style=less --routing=false`;

exec(command, (error, stdout, stderr) => {
    if (error) {
        console.log(error);
        return;
    }

    console.log(`${stdout}`);
    console.log(`${stderr}`);
});
