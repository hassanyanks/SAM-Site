import express from 'express';
import { v4 as uuid } from 'uuid';
import session from 'express-session';
import FileStoreFactory from 'session-file-store';
import path from 'path';
import url from 'url';
import passport from 'passport';
import dotenv from 'dotenv';
import flash from 'connect-flash';
import multer from 'multer';
import helmet from 'helmet';
import authRouter from './routes/authRoutes.js';
import productsRouter from './routes/productsRoutes.js';
import uploadRouter from './routes/uploadRoutes.js';
//import commonRouter from './routes/commonRoutes.js';
import passportConfig from './config/passportConfig.js';
import { upload_form } from './controllers/commonControllers.js';

dotenv.config({ path: './.env' }); 

const __dirname = import.meta.dirname
const sessionDir = path.join(__dirname, 'sessions');

const FileStore = FileStoreFactory(session);
const fileStoreOptions = {
    path: sessionDir,
    ttl: 3600,
    fileExtension: '.json',
    reapInterval: 300,
    lifetime: 2400
};
const file_store = new FileStore(fileStoreOptions);

const app = express();
app.use(express.urlencoded({ extended: false }))
app.use(express.json());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'images')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'lib')));
app.use(express.static(path.join(__dirname, 'scripts')));

app.use(session({
  genid: (req) => {
    return uuid() // use UUIDs for session IDs
  },
    store: file_store,
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        httpOnly: true, // Prevents client-side JS from reading the cookie
        maxAge: 1000 * 60 * 60 * 24 // Cookie expiration time (e.g., 1 day)
    },
},
    console.log('exiting app.use(session())')
));

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'none'"],
      connectSrc: ["'self'", "https://localhost"], // Add necessary APIs here
    },
  },
}));

app.use(flash());

const uploadsDir = path.join(__dirname, './uploads');

// Configure Multer storage
const storage = multer.diskStorage({
    destination: uploadsDir,
    filename: function(req, file, cb) {
        cb(null, file.originalname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Init upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 }, // Limit file size to 1MB
    fileFilter: function(req, file, cb) {
        checkFileType(req, file, cb);
    }
}).single('document'); // 'document' is the field name in the form

// Check File Type
function checkFileType(req, file, cb) {
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
}

app.get('/', (req, res ) => {
    res.render('index');
});

/*
  const host = req.headers.host; // e.g., 'localhost:8080'
  const pathname = url.parse(req.url).pathname; // e.g., '/MyApp'
  const fullUrl = `https://${host}${pathname}`;
  
  console.log(fullUrl);

    //const targetUrl = req.query.url || 'https://default.com';
    console.log(`**************************current url:  ${fullUrl}`)
    // Serve an HTML string or a view template
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Redirecting...</title>
            <!-- Option A: Meta refresh as a fallback (3 seconds) -->
            <meta http-equiv="Content-Security-Policy; refresh" content="form-action 'self';script-src 'self' 'unsafe-inline'; connect-src 'self';url=${req.query.targetUrl};">
            <style>
                body { font-family: sans-serif; text-align: center; padding-top: 50px; }
                .loader { border: 8px solid #f3f3f3; border-top: 8px solid #3498db; 
                          border-radius: 50%; width: 50px; height: 50px; 
                          animation: spin 2s linear infinite; margin: auto; }
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            </style>
        </head>
        <body>
            <div class="loader"></div>
            <h1>Please wait while we redirect you...</h1>
            <p>If you are not redirected within 3 seconds, <a href="${req.query.targetUrl}">click here</a>.</p>
            
            <script type="text/javascript"; src="./server/redirectTimeout.js">
                // Option B: Immediate JavaScript redirect for better UX
            </script>
        </body>
        </html>
    `);
});
*/

app.get('/upload', upload_form);

app.get('/uploaded', (req, res) => {
    const error_msg = req.flash('error');
    const success_msg = req.flash('success');
    res.render('index', {success_msg: success_msg.toString().trim(), error_msg: error_msg.toString().trim()});
} );

app.post('/upload', (req, res) => {
    req.flash('success');
    req.flash('error');

    upload(req, res, function(err) {
        if(err) {
            req.flash('error', err);
        }
        else if (!req.file) {
            req.flash('error', 'Error: No File Selected!');
        } else {
            req.flash('success', 'File Uploaded Successfully!');
        }
        req.session.save(err => { // This to persist flash msgs
            if (err) {
            return next(err); // Handle errors
            }
            res.redirect(303, '/uploaded'); // Redirect in the callback
        });
    });
});

console.log('app.use passport start...');
app.use(passport.initialize());
app.use(passport.session()); // This uses the express-session middleware
console.log('app.use passport end...');

passportConfig(passport);

app.get('/login', (req, res) => {
    res.render('login');
} );

//app.set('view cache', false);
app.use(authRouter);
app.use(productsRouter);
app.use(uploadRouter);
console.log('app setup done...');

export default app;