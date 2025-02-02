import express from "express";
import jwt from "jsonwebtoken";
import { expressjwt } from "express-jwt";
import passport from "passport";
import LocalStrategy from "passport-local";
import users from './data/users.json' assert { type: "json" };
import bcrypt from "bcrypt"; 
import fs from "fs";
import path from "path";
import { urlencoded } from "express";
import { authRouter } from "./routes/auth.js";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url); 
const __dirname = path.dirname(__filename); 

const app = express();

app.use(express.json());
app.use(urlencoded());
app.use(passport.initialize());

app.use(express.static('public'))

app.use('/', authRouter);

passport.use(new LocalStrategy(function verify(username, password, cb){
  
}))

const cardsPath = path.join(__dirname, 'data', 'cards.json')

const getUserById = (userId) => {
  const filePath = path.join(__dirname, 'data', 'users.json');
  try {
    const jsonData = fs.readFileSync(filePath, 'utf-8'); // Synchronous file read for simplicity
    const users = JSON.parse(jsonData).users; // Parse the JSON content
    return users.find((currUser) => currUser.userId === userId); // Search for the user by ID
  } catch (error) {
    console.error('Error reading or parsing users.json:', error);
    return null;
  }
};

app.post('/getToken', (req, res) => {
  const { userId, password } = req.body;

  const user = getUserById(userId);

  if (!user || user.password !== password) {
    return res.status(401).json({ errorMessage: 'Invalid Credentials' });
  }

  // Generate the token
  const token = jwt.sign({ userId: user.userId }, process.env.SECRET, {
    algorithm: 'HS256',
    expiresIn: '30s',
  });

  res.json({ token: token });
});

app.get("/cards", (req, res)=>{
  fs.readFile(cardsPath, 'utf8', (err, jsonString) => {
    if (err) {
      console.error("Error reading file:", err);
      return res.status(500).json({ error: "Failed to read data file" });
    }
    try {
      const jsonObject = JSON.parse(jsonString);
      const data = jsonObject.cards;
      const { set, type, rarity } = req.query;

      const filteredCards = data.filter(card => {
        return (
          (!set || card.set === set) && 
          (!type || card.type === type) && 
          (!rarity || card.rarity === rarity)
        );
      })
      res.json(filteredCards);  
      
    } catch (err) {
      console.error("Error parsing JSON:", err);
      res.status(500).json({ error: "Invalid JSON format" });
    }
  });
});

app.get("/cards/:id", (req, res)=>{
  const id = req.params.id
  fs.readFile(cardsPath, "utf8", (err, jsonString)=>{
    if (err){
      console.error("Error reading file:", err);
      return res.status(500).json({ error: "Failed to read data file" });
    }
    try {
      const jsonObject = JSON.parse(jsonString);
      const data = jsonObject.cards;
      const card = data.find(card => card.id.toString() === id);
      if (!card) {
        return res.status(404).json({ error: "Card not found" });
      }
      res.json(card)
    } catch (err) {
      console.error("Error parsing JSON:", err);
      res.status(500).json({ error: "Invalid JSON format" });
    }
  })
})

app.post("/cards/create", expressjwt({ secret: process.env.SECRET, algorithms: ["HS256"] }),(req, res)=>{
  let nextId;

  fs.readFile(cardsPath, "utf8", (err, jsonString)=>{
    let lastIndex = jsonString.lastIndexOf();
    console.log(lastIndex);
  })
  
  let newCard = {
    id: 1,
    name: "Fireball Magus",
    set: "Base Set",
    cardNumber: 1,
    type: "Creature",
    power: 3000,
    toughness: 2500,
    rarity: "Common",
    cost: 3
  }
})

app.post("/cards/:id/update", expressjwt({ secret: process.env.SECRET, algorithms: ["HS256"] }),(req, res)=>{
  const id = req.params.id
  
})

app.post("/cards/:id/delete", expressjwt({ secret: process.env.SECRET, algorithms: ["HS256"] }),(req, res)=>{
  const id = req.params.id

})

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));