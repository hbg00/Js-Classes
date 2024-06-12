
const asyncAdd = async (a, b) => {
    if (typeof a !== 'number' || typeof b !== 'number') {
      return Promise.reject('Type of arguments must be number.');
    }
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(a + b);
      }, 100);
    });
  };
  

  const asyncSum = async (array) => {
    if (array.length === 0) {
        return { sum: 0, asyncOperations: 0 };
    }

    let sum = array[0];
    let asyncOperations = 0;

    for (let i = 1; i < array.length; i++) {
        sum = await asyncAdd(sum, array[i]);
        asyncOperations++;
    }

    return { sum, asyncOperations };
};



const asyncSumWithTiming = async(array) =>{
    const start = Date.now();
    const { sum, asyncOperations } = await asyncSum(array);
    console.log(`Sum: ${sum}`);
    console.log(`Amount of async operations: ${asyncOperations}`);

    const timer = Date.now() - start;
    return timer / 1000;
};


function generateArray(numberOfElements){
    const result = [];
    let i = 1;
    while(numberOfElements >= i){
        result.push(i);
        i++;
    }
    return result;
};

const main = async () => {
    console.log('task 1');
    console.log(await asyncAdd(1, 2));

    console.log('task 2');
    const array1 = generateArray(10);
    const { sum, asyncOperations } = await asyncSum(array1);
    console.log(`Sum: ${sum}`);

    console.log('task 3');
    const array2 = generateArray(20);
    console.log(await asyncSumWithTiming(array2) + 'sec');

    console.log('task 4');
    const array3 = generateArray(100);
    console.log(await asyncSumWithTiming(array3) + 'sec');

    console.log('task 5');
    console.log('none');
};

main();