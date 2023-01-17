const colors = require("colors/safe");
const EventEmitter = require('events');
const fs = require('fs');
const readline = require('readline');


// открываем поток на чтение файла access_tmp.log
const readStream = fs.createReadStream(`./access_tmp.log`, 'utf-8');
// открываем поток на запись файла с именем 34.48.240.111_requests.log
const writeStreamIp34 = fs.createWriteStream('./34.48.240.111_requests.log', { flags: 'a', encoding: 'utf8' });
// открываем поток на запись файла с именем 89.123.1.41_requests.log
const writeStreamIp89 = fs.createWriteStream('./89.123.1.41_requests.log', { flags: 'a', encoding: 'utf8' });

//создаем интерфейс построчного чтения файла
const readInterface = readline.createInterface({
    input: readStream,
});
//слушатель события построчного чтения файла
readInterface.on('line', (line) => {
    if (line.includes('89.123.1.41')) {
        writeStreamIp89.write('\n');
        writeStreamIp89.write(line);
    } else if (line.includes('34.48.240.111')) {
        writeStreamIp34.write('\n');
        writeStreamIp34.write(line);
    }
});
//слушатель события окончания чтения файла access_tmp.log
readStream.on('end', () => process.stdout.write(colors.red(`Reading the file "access_tmp.log" is finished! New files have been created!` + "\n")))
