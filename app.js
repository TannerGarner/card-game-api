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
    expiresIn: '1h',
  });

  res.json({ token: token });
});

app.post("/verifyToken", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]; 

  if (!token) {
      return res.status(401).json({ errorMessage: "Access Denied" });
  }

  jwt.verify(token, process.env.SECRET, (err, decoded) => {
      if (err) {
          return res.status(403).json({ errorMessage: "Invalid or Expired Token" });
      }
      res.json({ message: "Token is valid", userId: decoded.userId });
  });
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
  fs.readFile(cardsPath, "utf8", (err, jsonString) => {
    if (err) {
      console.error("Error reading file:", err);
      return res.status(500).json({ error: "Failed to read data file" });
    }

    try {
      const jsonObject = JSON.parse(jsonString); 
      const cards = jsonObject.cards; 

      let nextId = cards.length > 0 ? cards[cards.length - 1].id + 1 : 1;

      const { name, set, cardNumber, type, rarity } = req.body;

      let newCard = {
        id: nextId,
        name,
        set,
        cardNumber,
        type,
        rarity,
      };

      // Add the new card to the array
      cards.push(newCard);

      // Write updated array back to cards.json
      fs.writeFile(cardsPath, JSON.stringify(jsonObject, null, 2), (writeErr) => {
        if (writeErr) {
          console.error("Error writing file:", writeErr);
          return res.status(500).json({ error: "Failed to save card" });
        }
        res.json({ message: "Card created successfully", card: newCard });
      });

    } catch (parseErr) {
      console.error("Error parsing JSON:", parseErr);
      res.status(500).json({ error: "Invalid JSON format" });
    }
  });
});

app.put("/cards/:id", expressjwt({ secret: process.env.SECRET, algorithms: ["HS256"] }),(req, res)=>{
  const id = req.params.id
  
})

app.delete("/cards/:id", expressjwt({ secret: process.env.SECRET, algorithms: ["HS256"] }),(req, res)=>{
  const id = req.params.id

})

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));