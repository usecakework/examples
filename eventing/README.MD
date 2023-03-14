Boot the service, from the `service` directory:
```
npm install
npm run build
npm start
```

Boot the webapp, from the `webapp` directory:
```
npm install
npm start
```

Build the cli, from the `cli` directory:
```
go build -o cupcake
```


Now you can try running the Hello World demo!

1. Go to `localhost:3001` in your browser to see the webapp. You can see that you are on the onSyncStarted event page. 
2. Add a new handler via the CLI. Run:
```
cupcake init redvelvet
cd redvelvet
```
3. You can install new dependencies with `npm install`, and update `cupcake.json` and `handlers.js` with your custom event code.
4. Now deploy your new handler directly with:
```
cupcake deploy
```
5. Go back to the webapp and refresh. You can now see your new handler and click Test Me which will fire off your custom code.

(Note that currently the logs are faked. You can use cakework.getVmLogs to actually show the correct logs)