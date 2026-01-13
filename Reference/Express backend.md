# Express Server for the Backend API

This is a "minimalst web framework" for Node.js

The minimal script for an installation should look like this and can be used
to test functioning.

```app.js
const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
```

This can then be run locally with `node app.js`. In a browser, set the URL
to `http://localhost:3000` to get the output

## Express Generator

Express has the ability to create an application skeleton using this command:

```bash
`$ npx express-generator
```

## Basic Routing

Routing as used here is the use of a URI with a request method to have a server
perform an operation like retrieving or saving assets/data. Each route can
execute one or more handler functions. Definitions of routes have the format

```pseudo
app.METHOD(PATH, HANDLER);
```

```js
app.get("/", (req, res) => {
   res.send("hello world");
});

// a POST request was sent to home page path
app.post("/", (req, res) => {
   res.send("Got a POST request");
});

// a PUT request 
app.put("/user", (req, res) => {
   res.send("PUT request to '/user'");
});

// a DELETE request 
app.delete("/user", (req, res) => {
   res.send("DELETE request to '/user'");
});
```

## Static Files

The middleware `express.static()` function of Express is used to serve images,
CSS and JavaScript files.

```js
express.static(root, options?);
```

To serve images, CSS and JS files from directory 'public':

```js
app.use(express.static('public'));
```

To reference these:

```url
http://localhost:3000/images/kitten.jpg
http://localhost:3000/css/style.css
http://localhost:3000/js/app.js
http://localhost:3000/images/bg.png
http://localhost:3000/hello.html
```

These files are looked up from the static directory so the full URL does not have
these path names.

```js
app.use(express.static('public'));
app.use(express.static('files'));
```

Express will search for the static files in order of 'public' then 'files'

## API (abbreviated)

This will be expanded as the need arises. There are 88 entries.

- express.json(options?)
- express.raw(options?)
- express.Router(options?)
- express.static(root, options?)
- express.text(options?)
- express.urlencoded(options?)
- app.locals - local variables available to templates in `res.render`. The `res.locals` is available only for lifetime of request
- app.mountpath
- app.router - only instance of router for application. See Router.
- app.on('mount', callback(parent)) - fired on a sub-app when mounted on parent app
- app.all(path, callback [, callback ...]) - this will match all HTTP verbs
- app.delete(path, callback [, callback]) - routes HTTP DELETE to specified path

   ```js
   app.delete('/', (req, res) => {res.send('DELETE request to homepage')});
   ```

- app.disable(name)
- app.disabled(name) - this gets and sets disabled status of the named app setting
- app.enable(name)
- app.enabled(name) - this gets and sets enabled status of the named app setting
- app.engine(ext, callback)
- app.get(name) - gets the name of an app setting
- app.get(path, callback [, callback ...]) - this will route GET request to path with specified callback functions. The callback usually haas form (req, res) => { functions to return resource }
- app.listen(path, [callback]) - start UNIX socket to listen for connections on path. Identicla to Node's http.Server.listen()
- app.listen([port[, host [, backlog]]][, callback]) - binds and listens to connections on specified host and port. If port omitted or is zero, assigns arbitrary unused port
- app.METHOD(path, callback [, callback]) - routing methods supported include 23 methods
- app.param(name, callback)
- app.path() - returns path of the app
- app.post(path, callback [, callback...])
- app.put(path, callback [, callback...])
- app.render(view, [locals], callback) - returns rendered HTML of a view of the callback
- app.route(path) - returns instance of single route, which can then be used to handle HTTP verbs with optional middleware
- app.set(name, value)
- app.use([path,] callback, [, callback...]) - mounts specified middleware function or functions at specified path: the function is executed when base of requested path matches `path`
- req.app
- req.baseUrl
- req.body
- req.cookies
- req.fresh
- req.host
- req.hostname
- req.ip
- req.ips
- req.method
- req.originalUrl
- req.params
- req.path
- req.protocol
- req.query
- req.res
- req.route - contains currently matched route
- req.secure
- req.signedCookies
- req.stale
- req.subdomains
- req.xhr
- req.accepts(types)
- req.acceptsCharsets(charset [,...])
- req.acceptsEncodings(encoding [, ...])
- req.acceptsLanguages([lang, ...])
- req.get(field)
- req.is(type)
- req.range(size [, options])
- res.app
- res.headersSent
- res.locals
- res.req
- res.append(field [, value])
- res.attachment([filename])
- res.cookie(name, value [, options])
- res.clearCookie(name [, options])
- res.download(path [, filename] [, options] [, fn])
- res.end([data])
- res.format(object)
- res.get(field)
- res.json([body])
- res.jsonp([body])
- res.links(links)
- res.location(path)
- res.redirect([status,] path)
- res.render(view \[, locals\][, callback])
- res.send[(body)]
- res.sendFile(path [, options] [, fn])
- res.sendStatus(statusCode)
- res.set(field [, value])
- res.status(code)
- res.type(type)
- res.vary(field)
- router.all(path, [callback, ...] callback)
- router.METHOD(path, [callback, ...] callback)
- router.param(name, callback)
- router.route(path)
- router.use([path], [function, ...] function)
