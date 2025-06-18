const express = require("express");
const fs = require("fs");
const app = express();
const port = 3000;

// Middleware pour parser du JSON en POST
app.use(express.json());

// Charger les données du Pokédex
let pokedex = require("./data/pokedex.json");

// GET all pokemons
app.get("/pokemons", (req, res) => {
  res.json(pokedex.pokemons);
});

// GET un seul Pokémon par ID
app.get("/pokemons/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const pokemon = pokedex.pokemons.find(p => p.id === id);

  if (pokemon) {
    res.json(pokemon);
  } else {
    res.status(404).json({ error: "Pokémon non trouvé" });
  }
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

app.listen(port, () => {
  console.log(`📚 Pokédex API en ligne sur http://localhost:${port}`);
});
