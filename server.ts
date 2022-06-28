import * as express from 'express';
import { existsSync } from 'fs';
import { join } from 'path';
import { json, urlencoded } from 'body-parser';
import * as cors from "cors"
import { CommandHandlier } from './api/command-handler';

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
    const server = express();
    server.use(json())
    server.use(cors())
    server.use(urlencoded({extended: false}))
    const distFolder = join(process.cwd(), 'dist/amigos');

    server.set('view engine', 'html');
    server.set('views', distFolder);

    const commandHandler = new CommandHandlier()

    // Example Express Rest API endpoints
    server.use('/api/:command', async (req, res) => { 
        // console.log(req.baseUrl, req.body)
        const command = req.params.command;
        try {
            const response: any = await (commandHandler as any)[command](req.body)
            console.log({response})
            const result = {
                status: true, 
                message: typeof response == 'string'? response : "successful",
                data: typeof response == 'string'? null : response,
            }
            return res.send(result)
        } catch (error: any) {
            console.log({error})
            const result = {
                status: false, 
                message: error.message || "error processing the request",
                data: null,
            }
            return res.status(error?.code || 401).send(result)
        }
    });

    // Serve static files from /browser
    server.get('*', express.static(distFolder));

    return server;
}



// start the server
const port = process.env['PORT'] || 4000;

// Start up the Node server
const server = app();
server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
});


