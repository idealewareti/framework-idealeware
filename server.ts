import 'zone.js/dist/zone-node';
import 'reflect-metadata';
import { enableProdMode, ValueProvider } from '@angular/core';
import { provideModuleMap } from '@nguniversal/module-map-ngfactory-loader';
import * as express from 'express';
import { join } from 'path';
import { renderModuleFactory } from '@angular/platform-server';
import { RESPONSE } from '@nguniversal/express-engine/tokens';
import { readFileSync } from 'fs';
import { AppConfig } from './src/app/app.config';

// Faster server renders w/ Prod mode (dev mode never needed)
enableProdMode();

// Express server
const app = express();
const PORT = AppConfig.PORT;
const TITLE = `store.${AppConfig.DOMAIN}`;
process.title = TITLE;

const DIST_FOLDER = join(process.cwd(), 'dist');

// * NOTE :: leave this as require() since this file is built Dynamically from webpack
const { AppServerModuleNgFactory, LAZY_MODULE_MAP } = require('./dist/server/main');

const template = readFileSync(join(DIST_FOLDER, 'browser', 'index.html')).toString();

app.engine('html', (_, options, callback) => {
    renderModuleFactory(AppServerModuleNgFactory, {
        document: template,
        url: options.req.url,

        extraProviders: [

            <ValueProvider>{
                provide: RESPONSE,
                useValue: options.req.res,
            },

            provideModuleMap(LAZY_MODULE_MAP)
        ]
    }).then(html => {
        callback(null, html);
    });
});

app.set('view engine', 'html');
app.set('views', join(DIST_FOLDER, 'browser'));

// Server static files from /browser
app.get('*.*', express.static(join(DIST_FOLDER, 'browser'), {
    maxAge: '1y'
}));

// All regular routes use the Universal engine
app.get('*', (req, res) => {
    res.render('index', { req });
});

// Start up the Node server
app.listen(PORT, () => {
    console.log(`${process.title} listening on http://localhost:${PORT}`);
});