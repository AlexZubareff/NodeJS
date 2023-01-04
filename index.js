
const colors = require("colors/safe");

/* Функция определяет простое число или нет */

function isPrime(num) {
    for (let i = 2, max = Math.sqrt(num); i <= max; i++) {
        if (num % i === 0) {
            return false;
        }
    }
    return num;
}

/*  
   Функция принимает начальное и конечное значения интервала
   и определяет есть ли в этом интервале простые числа
*/
function getPrimes(num1, num2) {
    const primes = [];
    let count = 0;

    if (isNaN(num1) || isNaN(num2)) {
        process.stdout.write(colors.red(`Один или оба аргумента не является числом` + "\n"));
        return;
    } else {
        for (let i = num1; i <= num2; i++) {
            if (isPrime(i)) {
                primes.push(i);
                if (count === 0) {
                    process.stdout.write(colors.red(`${i} `));
                    count++;
                } else
                    if (count === 1) {
                        process.stdout.write(colors.yellow(`${i} `));
                        count++;
                    } else
                        if (count === 2) {
                            process.stdout.write(colors.green(`${i} `));
                            count = 0;
                        }
           }
        }
    }
    if (primes.length === 0) {
        process.stdout.write(colors.red(`В данном интервале нет простых чисел` + "\n"));

    }

}
getPrimes(parseInt(process.argv[2]), parseInt(process.argv[3]));