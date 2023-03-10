import fastify from "fastify";
import * as fs from "fs";

const server = fastify()

var data;
try {
  data = fs.readFileSync("./cupcake.json", "utf8")
} catch(err) {
  console.error(err);
  process.exit(1);
}

const handlers = JSON.parse(data);
for (const i in handlers.handlers) {
    if (handlers.handlers[i].runtime != "node") {
        continue;
    }
    const handlerName = handlers.handlers[i].name;
    const filePath = "./" + handlers.handlers[i].file;
    const methodName = handlers.handlers[i].method;

    const methods = await import(filePath);
    
    server.post("/" + handlerName, async(request, reply) => {
        const response = methods[methodName](request.body);
        reply.code(200).send(response);
    });    
}

const start = async () => {
    try {
      await server.listen({ port: 8080, host: '0.0.0.0' });
    } catch (err) {
      fastify.log.error(err)
      process.exit(1);
    }
}

start();