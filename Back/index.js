const express = require("express");
const fs = require("fs");
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;
const cors = require("cors");

app.use(cors())

// Connexion à la base de données SQLite
const db = new sqlite3.Database('./Pokemon.db', (err) => {
  if (err) {
    console.error('Erreur de connexion à la base de données:', err);
  } else {
    console.log('Connexion à la base de données SQLite établie');
  }
});

// Middleware pour parser du JSON en POST
app.use(express.json());

// GET all pokemons
app.get("/pokemons", (req, res) => {
  db.all("SELECT * FROM pokemons", [], (err, rows) => {
    if (err) {
      res.status(500).json({ err });
      return; 
    }
    res.json(rows);
  });
});

// GET un seul Pokémon par ID
app.get("/pokemons/:id", (req, res) => {
  const id = parseInt(req.params.id);
  db.get("SELECT * FROM pokemon WHERE id = ?", [id], (err, pokemon) => {
    if (err) {
      res.status(500).json({ error: "Erreur lors de la récupération du pokémon" });
      return;
    }
    
    if (pokemon) {
      res.json(pokemon);
    } else {
      res.status(404).json({ error: "Pokémon non trouvé" });
    }
  });
});

// POST : ajouter un nouveau Pokémon
app.post("/pokemons", (req, res) => {
  const newPokemon = req.body;

  if (!newPokemon.id || !newPokemon.name || !newPokemon.type) {
    return res.status(400).json({ error: "Données invalides" });
  }

  // Vérifier qu'il n'existe pas déjà
  if (pokedex.pokemons.find(p => p.id === newPokemon.id)) {
    return res.status(409).json({ error: "ID déjà existant" });
  }

  pokedex.pokemons.push(newPokemon);
  fs.writeFileSync("./pokedex.json", JSON.stringify(pokedex, null, 2));
  res.status(201).json(newPokemon);
});

// DELETE : supprimer un Pokémon
app.delete("/pokemons/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = pokedex.pokemons.findIndex(p => p.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Pokémon non trouvé" });
  }

  const deleted = pokedex.pokemons.splice(index, 1);
  fs.writeFileSync("./pokedex.json", JSON.stringify(pokedex, null, 2));
  res.json({ deleted });
});

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});

// Gérer la fermeture propre de la connexion à la base de données
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error('Erreur lors de la fermeture de la base de données:', err);
    } else {
      console.log('Connexion à la base de données fermée');
    }
    process.exit(0);
  });
});
