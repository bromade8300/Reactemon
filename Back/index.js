const express = require("express");
const fs = require("fs");
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3001;
const cors = require("cors");

app.use(cors())

// Connexion à la base de données SQLite
const db = new sqlite3.Database('./Pokemon.db', (err) => {
  if (err) {
    console.error(err, err);
  } else {
    console.log('Connexion à la base de données SQLite établie');
  }
});

// Middleware pour parser du JSON en POST
app.use(express.json());

// GET all pokemons
app.get("/pokemons", (req, res) => {
  db.all("SELECT * FROM pokemon", [], (err, rows) => {
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
      res.status(500).json({ err });
      return;
    }
    
    if (pokemon) {
      // Transformer le type en format attendu par le frontend
      const formattedPokemon = {
        ...pokemon,
        types: [{ type: { name: pokemon.type } }], // Convertir le type en format attendu
      };
      res.json(formattedPokemon);
    } else {
      res.status(404).json({ error: "Pokémon non trouvé" });
    }
  });
});

// POST : ajouter un nouveau Pokémon
app.post("/pokemons", (req, res) => {
  const newPokemon = req.body;

  if (!newPokemon.id || !newPokemon.name || !newPokemon.type_1) {
    return res.status(400).json({ error: "Données invalides" });
  }

  db.get("SELECT id FROM pokemon WHERE id = ?", [newPokemon.id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: "Erreur lors de la vérification de l'ID" });
    }
    if (row) {
      return res.status(409).json({ error: "ID déjà existant" });
    }
    db.run(
      `INSERT INTO pokemon (id, name, national_number, type_1, type_2, height, weight, description, hp, attack, defense, sp_attack, sp_defense, speed)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        newPokemon.id,
        newPokemon.name,
        newPokemon.id, // national_number = id (par défaut)
        newPokemon.type_1,
        newPokemon.type_2 || null,
        newPokemon.height,
        newPokemon.weight,
        newPokemon.description,
        newPokemon.hp,
        newPokemon.attack,
        newPokemon.defense,
        newPokemon.sp_attack,
        newPokemon.sp_defense,
        newPokemon.speed
      ],
      function (err) {
        if (err) {
          res.status(500).json({ error: "Erreur lors de l'insertion", details: err });
        } else {
          res.status(201).json({ success: true, id: newPokemon.id });
        }
      }
    );
  });
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

// PUT : éditer un Pokémon
app.put('/pokemons/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const {
    name,
    type_1,
    type_2,
    height,
    weight,
    description,
    hp,
    attack,
    defense,
    sp_attack,
    sp_defense,
    speed
  } = req.body;
  console.log(req.body);
  db.run(
    `UPDATE pokemon SET
      name = ?,
      type_1 = ?,
      type_2 = ?,
      height = ?,
      weight = ?,
      description = ?,
      hp = ?,
      attack = ?,
      defense = ?,
      sp_attack = ?,
      sp_defense = ?,
      speed = ?
    WHERE id = ?`,
    [
      name,
      type_1,
      type_2,
      height,
      weight,
      description,
      hp,
      attack,
      defense,
      sp_attack,
      sp_defense,
      speed,
      id
    ],
    function (err) {
      if (err) {
        res.status(500).json({ error: 'Erreur lors de la mise à jour du Pokémon', details: err });
      } else if (this.changes === 0) {
        res.status(404).json({ error: 'Pokémon non trouvé' });
      } else {
        res.json({ success: true });
      }
    }
  );
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
