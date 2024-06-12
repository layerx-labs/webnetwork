export function countRequestSize(req: { query?:object, body: object }) {
  const queryLength = Buffer.from(JSON.stringify(req.query??{})).length;
  const bodyLength = Buffer.from(JSON.stringify(req.body??{})).length;

  return (queryLength+bodyLength)/1024
}