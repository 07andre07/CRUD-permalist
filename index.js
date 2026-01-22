import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();

app.set('view engine', 'ejs');
app.use(express.json()); 
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

const db = new pg.Pool({
  user: "postgres",
  host: "localhost",
  database: "permalist",
  password: "Luis2010#4571",
  port: 5432,
});
let items = []
const port = 3000;

db.connect();

app.get("/", async (req, res) => {

  try {
    items = []
    const response = await db.query("SELECT * FROM items")
    items = response.rows
    res.render("index.ejs", {
      listTitle : "Today",
      listItems : items
    })
  } catch (err) {
    res.redirect("/")
  }
});

app.post("/add",async (req, res) => {
  const item = req.body.newItem;
  try {
    const newTask = await db.query("INSERT INTO items (title) VALUES ($1)", [ item,
    ])
    res.redirect("/")
  } catch (err) {
    res.redirect("/")
  }
});

app.post("/edit", async (req, res) => { 
  // { updatedItemId: '1', updatedItemTitle: 'texto2043dsa' }
  try {
    const editedText = await db.query("UPDATE items SET title = ($1) WHERE id = ($2) ", [req.body.updatedItemTitle, req.body.updatedItemId])
    res.redirect("/")
  } catch (error) {
    console.log(error)
    res.redirect("/")
  }
});

app.post("/delete", async (req, res) => {
  console.log(req.body)
  try {
    const deletedText = await db.query("DELETE FROM items WHERE id = ($1) ", [req.body.deleteItemId])
    res.redirect("/")
  } catch (error) {
    console.log(error)
    res.redirect("/")
  }
});


app.listen(port, () => {
    console.log('Server running on port ' + port)
    
});