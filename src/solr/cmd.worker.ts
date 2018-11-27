let id: number|null = null;
let results: any[] = [];
const ctx: Worker = self as any;
ctx.addEventListener('message', (event) => {
  const data = event.data;
  if (data.responseHeader.status === 'accept') {
    if (id === null) {
      console.debug('confirm with id: ' + data.id);
      id = data.id;
    } else {
      console.error('already initialized with ' + id);
    }
    return;
  }
  if (data.responseHeader.status === 'finished') {
    if (data.id === id) {
      console.log('end: ' + data.id);
      if (1 === results.length) {
        ctx.postMessage(results[0]);
      } else {
        ctx.postMessage(results);
      }
    } else {
       console.error(
        'worker ' + id + ' received end message for wrong id: ' + data.id,
      );
    }
    return;
  }
  // console.log('result: ' + content);
  results.push(data);
});
