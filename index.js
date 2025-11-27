const express = require('express');
const app = express();
const mongoose = require('mongoose');
const methodOverride = require('method-override');

// Import Post model
const Post = require('./models/post');

// Import utility function
const normalizeContent = require('./utils/normalizeContent');

// App Config
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(methodOverride('_method'));

app.set('layout', 'boilerplate');
const expressLayouts = require('express-ejs-layouts');
app.use(expressLayouts);

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/blogApp")
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err));

// Home route
app.get('/', (req, res) => {
    res.render('home');
})

// INDEX route
app.get('/posts', async (req, res) => {
    try{
        const posts = await Post.find({});
        res.render('posts/index', { posts});
    } catch (e) {
        console.error(e);
        res.status(500).send("Server Error");
    }
});

// NEW route
app.get('/posts/new', (req, res) => {
    res.render('posts/new');
});

// CREATE route
app.post('/posts', async (req, res) => {
    try {
        const { title = '', image = '', content = '' } = req.body;

        // normalize before saving
        const normalized = normalizeContent(content);

        await Post.create({
            title: title.trim(),
            image: image.trim(),
            content: normalized
        });

        res.redirect('/posts');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});


// SHOW route
app.get('/posts/:id', async (req, res) => {
    const post = await Post.findById(req.params.id);
    res.render('posts/show', { post });
});

// DELETE route
app.delete('/posts/:id', async (req, res) => {
    try {
        await Post.findByIdAndDelete(req.params.id);
        res.redirect('/posts');
    } catch (err) {
        console.error(err);
        res.redirect('/posts');
    }
});

// EDIT route
app.get('/posts/:id/edit', async (req, res) => {
    const post = await Post.findById(req.params.id);
    res.render('posts/edit', { post });
});

// UPDATE route
app.put('/posts/:id', async (req, res) => {
    try {
        const { title = '', image = '', content = '' } = req.body;
        const normalized = normalizeContent(content);
        await Post.findByIdAndUpdate(req.params.id, {
            title: title.trim(),
            image: image.trim(),
            content: normalized
        });
        res.redirect(`/posts/${req.params.id}`);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
