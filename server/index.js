 const cors = require ('cors')
 const express = require ('express')
 const bodyParser = require('body-parser');
// const {Client} = require ('pg')

 const app = express()
 const port = 8000

const client = require ('./database')
const user = require ('./user')
const read_later = require ('./read_later')
const permainan = require ('./game')
const berita = require ('./news')
const uploadImage = require("./upload");
const fs = require("fs");
global.__basedir = __dirname;

app.use(express.json({limit: '50mb'}))
app.use(cors())
app.listen(port, ()=>{
    console.log (`app listening at http://localhost:${port}`)
})

//===============USER BACKEND================
app.get('/api/users/', async (req,res)=>{
    const users = await user.getAllUser()
    res.send(await users.rows)
})

app.post('/api/users/', async (req, res)=>{
    const username = req.body.username
    const email = req.body.email
    const password = req.body.password
    const isAdmin = req.body.is_admin

    await user.insertUser(username, email, password, isAdmin)
    console.log(isAdmin)
    res.status(201).end()
})

app.delete ('/api/users/:id', async (req, res)=>{
    await user.deleteUser(req.params.id)
    res.status(200).send()
})

app.put('/api/users/:id', async (req, res)=>{
    const id = req.params.id
    const username = req.body.username
    const email = req.body.email
    const password = req.body.password
    const isAdmin = req.body.is_admin

    await user.updateUser(id, username, email, password, isAdmin)
    console.log(isAdmin)
    res.status(204).end()
})

app.get('/api/users/:id', async (req,res)=>{
    const users = await user.getOneUser(req.params.id)
    res.send(await users.rows)
})

app.get('/api/users/search/:username/', async (req,res)=>{
    const users = await user.getUserByUsername(req.params.username)
    res.send(await users.rows)
})

//=============READ LATER BACKEND===========
app.get('/api/read_later/', async (req,res)=>{
    const bookmark = await read_later.getAllReadLater()
    res.send(await bookmark.rows)
})

app.post('/api/read_later/', async (req, res)=>{
    const id_user = req.body.id_user
    const id_berita = req.body.id_berita

    await read_later.addReadLater(id_user, id_berita)
    res.status(201).end()
})

app.delete ('/api/read_later/:id', async (req, res)=>{
    await read_later.deleteBookmark(req.params.id)
    res.status(200).send()
})

app.get('/api/read_later/my_bookmark/:id', async (req,res)=>{
    const bookmark = await read_later.getUserBookmark(req.params.genre)
    res.send(await bookmark.rows)
})

//===============GAME BACKEND================
app.get('/api/game/:id', async (req,res)=>{
    const game = await permainan.getGameById(req.params.id)
    res.send(await game.rows)
})

app.get('/api/game/', async (req,res)=>{
    const game = await permainan.getAllGame()
    res.send(await game.rows)
})

app.get('/api/game_allthumbnail/:id', async (req,res)=>{
    const game = await permainan.getGameThumbnail(req.params.id)
    res.setHeader('content-type', 'image/jpg')
    res.send(await game.rows[0].thumbnail_game)
})

app.put('/api/game_save/:id', uploadImage.single("thumbnail"), async (req,res)=>{
    const id = req.params.id
    filename = req.file.filename;
    const data = fs.readFileSync(
        __basedir + "/uploads/" + filename
    );
    // var bufs = [];
    // req.on('data', function(d){ bufs.push(d); });
    // req.on('end', function(){
    // var data = Buffer.concat(bufs);
    permainan.updateGameThumbnail(id, data)
    // });
    res.send({
        message: "News was updated successfully."
    });
})

app.post('/api/game/', async (req, res)=>{
    const judul_game = req.body.judul_game
    const genre = req.body.genre
    const publisher = req.body.publisher
    const platform = req.body.platform
    const release_date = req.body.release_date
    const price = req.body.price
    const description = req.body.description
    const system_requirement = req.body.system_requirement

    await permainan.insertGame(judul_game, genre, publisher, platform, release_date, price, description, system_requirement)
    res.status(201).end()
})

app.delete('/api/game/:id', async (req, res)=>{
    await permainan.deleteGame(req.params.id)
    res.status(200).send()
})

app.put('/api/game/:id', async (req, res)=>{
    const id = req.params.id
    const judul_game = req.body.judul_game
    const genre = req.body.genre
    const publisher = req.body.publisher
    const platform = req.body.platform
    const release_date = req.body.release_date
    const price = req.body.price
    const description = req.body.description
    const system_requirement = req.body.system_requirement

    await permainan.updateGame(id, judul_game, genre, publisher, platform, release_date, price, description, system_requirement)
    res.status(204).end()
})

app.put('/api/game_thumbnail/:id', async (req, res)=>{
    const id = req.params.id
    const thumbnail_game = req.body
    console.log("kepanggil")
    await permainan.updateGameThumbnail(id, thumbnail_game)
    res.status(204).end()
})

app.get('/api/gamesASC', async (req,res)=>{
    const games = await permainan.getAllgamesASC()
    res.send(await games.rows)
})

app.get('/api/home/NewGame', async (req,res)=>{
    const games = await permainan.getFiveGamesASC()
    res.send(await games.rows)
})

app.get('/api/games/search/:judul_game/', async (req,res)=>{
    const games = await permainan.getGamesBySearch(req.params.judul_game)
    res.send(await games.rows)
})

app.get('/api/games/genre/:genre/', async (req,res)=>{
    const games = await permainan.getGamesByGenre(req.params.genre)
    res.send(await games.rows)
})

app.get('/api/games/publisher/:publisher/', async (req,res)=>{
    const games = await permainan.getGamesByPublisher(req.params.publisher)
    res.send(await games.rows)
})

app.get('/api/games/platform/:platform/', async (req,res)=>{
    const games = await permainan.getGamesByPlatform(req.params.platform)
    res.send(await games.rows)
})


//=====================NEWS BACKEND===============
//Mendapatkan semua berita
app.get('/api/news', async (req,res)=>{
    const news = await berita.getAllnews()
    res.send(await news.rows)
    })
    
    app.get('/api/news/:id', async (req,res)=>{
        const news = await berita.getNewsById(req.params.id)
        res.send(await news.rows)
    })

    //Create berita
    app.post('/api/news/', async (req,res)=>{
        const id_game = req.body.id_game
        const judul_berita = req.body.judul_berita
        const kategori =req.body.kategori
        const isi = req.body.isi
    
        await berita.insertNews(id_game,judul_berita,kategori,isi)
        res.status(201).end()
    })
    
    //Delete berita berdasarkan Id
    app.delete ('/api/news/:id', async (req, res)=>{
        await berita.deleteNews(req.params.id)
        res.status(200).send()
    })
    
    app.put ('/api/news_thumbnail/:id', async (req, res)=>{
        await berita.deleteNewsThumbnail(req.params.id)
        res.status(200).send()
    })

    //Update berita berdasarkan Id
    app.put('/api/news/:id', async (req,res)=>{

        const id = req.params.id
        const id_game = req.body.id_game
        const judul_berita = req.body.judul_berita
        const kategori =req.body.kategori
        const isi = req.body.isi
        await berita.updateNews(id,id_game,judul_berita,kategori,isi)
        res.status(204).end()
    })
    
    //GET berita bedasarkan judul (tapi belum sesuai keiinginan)
    app.get('/api/news/search/:judul_berita', async(req,res)=>{
        const news = await berita.getNewsByJudul(req.params.judul_berita)
        res.send(await news.rows)
    })
    
    //GET berita berdasarkan kategori
    app.get('/api/news/kategori/:kategori', async(req,res)=>{
        const news = await berita.getNewsByKategori(req.params.kategori)
        res.send(await news.rows)
    })
    
    //GET berita berdasarkan publish_date secara Ascending
    app.get('/api/newsASC', async(req,res)=>{
        const news = await berita.getAllNewsASC()
        res.send(await news.rows)
    })
    
    //GET berita terbaru berdasarkan hasil sort publish_date
    app.get('/api/home', async(req,res)=>{
        const news = await berita.getAllNew()
        res.send(await news.rows)
    })

    app.get('/api/news_thumbnail/:id', async (req,res)=>{
        const news = await berita.getNewsThumbnail(req.params.id)
        res.setHeader('content-type', 'image/jpg')
        res.send(await news.rows[0].thumbnail)
    })

    app.put('/api/news_pict/:id', uploadImage.single("thumbnail"), async (req,res)=>{
        const id = req.params.id
        filename = req.file.filename;
        const data = fs.readFileSync(
            __basedir + "/uploads/" + filename
        );
        // var bufs = [];
        // req.on('data', function(d){ bufs.push(d); });
        // req.on('end', function(){
        // var data = Buffer.concat(bufs);
        berita.updateNewsThumbnail(id, data)
        // });
        res.send({
            message: "News was updated successfully."
        });
    })