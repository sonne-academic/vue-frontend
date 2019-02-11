let id: number|null = null;
let results: any[] = [];
const ctx: Worker = self as any;
ctx.addEventListener('message', (event) => {
  const data = event.data;
  if (data.responseHeader) {
    if (data.responseHeader.status === 'accept') {
      return acceptMessage(event);
    }
    if (data.responseHeader.status === 'finished') {
      return finishedMessage(event);
    }
  }
  // console.log('result: ' + content);
  results.push(data);
});

let acceptMessage = (event: MessageEvent) => {
  const data = event.data;
  if (id === null) {
    console.debug('confirm with id: ' + data.id);
    id = data.id;
  } else {
    console.error('already initialized with ' + id);
  }
  return;
};

let finishedMessage = (event: MessageEvent) => {
  const data = event.data;
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
};
