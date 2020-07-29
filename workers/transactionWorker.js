const {  parentPort, workerData } = require('worker_threads');

registerForEventListening();

function registerForEventListening () {
  let cb = (err) => {
    if(err) return console.error(err);

    processDataAndSendData()
  };

  parentPort.on('error', cb);
  parentPort.on('message', (msg) => {
    cb(null, msg);
  });
}

function processDataAndSendData () {
  const resultSum = workerData.transactions.reduce((acc, transaction) => {
    acc.countSums += transaction.count;
    return acc;
  }, {countSums: 0});

  parentPort.postMessage({resultSum});
}
