
const dummy = require('./dummyEvents.json')

const fetch = require('node-fetch');

let url = 'http://localhost:3000/log';

(async () => {
  for (let i = 0; i < dummy.length; i++) {
    let options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dummy[i])
    };

    await fetch(url, options)
      .then(res => res.json())
      .then(json => console.log(json))
      .catch(err => console.error('error:' + err));
  }
})();


