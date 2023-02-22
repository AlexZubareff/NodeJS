#!/usr/bin/env node

const inquirer = require("inquirer");
const fs = require("fs");
const path = require("path");
const colors = require("colors/safe");
const readline = require('readline');
const EventEmitter = require('events');


const currentDirectory = process.cwd();

const isDirectory = dirName => {
    return fs.lstatSync(dirName).isDirectory();
}

function listObjects(pathFile) {

    const list = fs.readdirSync(pathFile);
    inquirer
        .prompt([
            {
                name: "fileName",
                type: "list",
                message: "Choose File or Directory:",
                choices: list,
            }])
        .then((answers) => {
            if (isDirectory(pathFile + '/' + answers.fileName)) {

                listObjects(pathFile + '/' + answers.fileName);

            } else {

                const filePath = path.join(pathFile, answers.fileName);

                inquirer
                    .prompt([
                        {
                            name: "ip",
                            type: "input",
                            message: "Enter ip adress for filter:",
                        }
                    ])
                    .then((answer) => {

                        const ipAdr = answer.ip;

                        if (ipAdr || filePath) {
                            const rs = fs.createReadStream(filePath, 'utf8');
                            const wsIp = fs.createWriteStream(`./${ipAdr}_requests.log`, { flags: 'a', encoding: 'utf8' });

                            const readInterface = readline.createInterface({
                                input: rs,
                            });

                            readInterface.on('line', (line) => {
                                if (line.includes(`${ipAdr}`)) {
                                    wsIp.write('\n');
                                    wsIp.write(line);
                                }

                            });
                            rs.on('end', () => process.stdout.write(colors.red(
                                `Reading the file ${colors.green(answers.fileName)} is finished! New file, ${colors.green(ipAdr + '_requests.log')} have been created!` + "\n"
                            )))

                        } else {
                            process.stdout.write(colors.red(`Please enter ip adress` + "\n"))
                        }

                    });
            }

        })
}


inquirer
    .prompt([
        {
            name: "fileDir",
            type: "confirm",
            message: "File in this directory or subdirectory?",
            default: true,
        },
    ])
    .then((answer) => {
        if (answer.fileDir) {

            listObjects(currentDirectory);

        } else {
            inquirer
                .prompt([
                    {
                        name: "fileDirName",
                        type: "input",
                        message: "Enter a path of to the file?",
                    },
                    {
                        name: "ip",
                        type: "input",
                        message: "Enter ip adress for filter:",
                    }
                ])
                .then((answers) => {
                    const pathToFile = answers.fileDirName;
                    const ipAdr = answers.ip;


                    if (ipAdr || pathToFile) {
                        const rs = fs.createReadStream(pathToFile, 'utf8');
                        const wsIp = fs.createWriteStream(`./${ipAdr}_requests.log`, { flags: 'a', encoding: 'utf8' });

                        const readInterface = readline.createInterface({
                            input: rs,
                        });

                        readInterface.on('line', (line) => {
                            if (line.includes(`${ipAdr}`)) {
                                wsIp.write('\n');
                                wsIp.write(line);
                            }
                        });
                        rs.on('end', () => process.stdout.write(colors.red(
                            `Reading the file ${colors.green(answers.fileName)} is finished! New file, ${colors.green(ipAdr + '_requests.log')} have been created!` + "\n"
                        )))
                    } else {
                        process.stdout.write(colors.red(`Please enter ip adress` + "\n"))
                    }
                })
        }

    })