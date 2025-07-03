"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Heart, Trash2, ChevronLeft, ChevronRight, Home } from "lucide-react"

interface Pokemon {
  id: number
  name: string
  types: string[]
  image: string
  height: number
  weight: number
}

export default function PokemonListPage() {
  const [allPokemon, setAllPokemon] = useState<Pokemon[]>([])
  const [displayedPokemon, setDisplayedPokemon] = useState<Pokemon[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  const [favorites, setFavorites] = useState<number[]>([])
  const [itemsPerPage, setItemsPerPage] = useState(20)
  const [currentPage, setCurrentPage] = useState(1)
  const [allTypes, setAllTypes] = useState<string[]>([])

  // État pour le formulaire de création
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPokemon, setNewPokemon] = useState({
    id: '',
    name: '',
    type_1: '',
    type_2: '',
    height: '',
    weight: '',
    description: '',
    hp: '',
    attack: '',
    defense: '',
    sp_attack: '',
    sp_defense: '',
    speed: ''
  });

  useEffect(() => {
    fetchPokemon()
    loadFavorites()
  }, [])

  useEffect(() => {
    filterAndPaginatePokemon()
  }, [allPokemon, searchTerm, typeFilter, showFavoritesOnly, itemsPerPage, currentPage, favorites])

  const fetchPokemon = async () => {
    try {
      setLoading(true)
      const pokemonData: Pokemon[] = []
      const typesSet = new Set<string>()

      for (let i = 1; i <= 151; i++) {
        const response = await fetch(`http://localhost:3001/pokemons/${i}`)
        const data = await response.json()

        // Extraction robuste des types
        let types: string[] = [];
        if (data.types && Array.isArray(data.types)) {
          types = data.types.map((t: any) => {
            if (typeof t === 'string') return t;
            if (t.type && typeof t.type.name === 'string') return t.type.name;
            if (t.name) return t.name;
            return String(t);
          });
        } else if (data.type_1 || data.type) {
          // type_1 (backend) ou type (ancien format)
          types = [data.type_1 || data.type];
          if (data.type_2) types.push(data.type_2);
        }

        const pokemon: Pokemon = {
          id: data.id,
          name: data.name,
          types: types,
          image: `/sprites/${data.id.toString().padStart(3, "0")}.png`,
          height: data.height,
          weight: data.weight,
        }

        pokemonData.push(pokemon)
        types.forEach((type) => {
          if (typeof type === 'string') typesSet.add(type)
        })
      }

      setAllPokemon(pokemonData)
      setAllTypes(Array.from(typesSet).sort())
    } catch (error) {
      console.error("Error fetching Pokemon:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterAndPaginatePokemon = () => {
    let filtered = allPokemon

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((pokemon) => pokemon.name.toLowerCase().includes(searchTerm.toLowerCase()))
    }

    // Filter by type
    if (typeFilter !== "all") {
      filtered = filtered.filter((pokemon) => pokemon.types.includes(typeFilter))
    }

    // Filter by favorites
    if (showFavoritesOnly) {
      filtered = filtered.filter((pokemon) => favorites.includes(pokemon.id))
    }

    // Pagination
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = itemsPerPage === -1 ? filtered.length : startIndex + itemsPerPage
    const paginated = filtered.slice(startIndex, endIndex)

    setDisplayedPokemon(paginated)
  }

  const loadFavorites = () => {
    const saved = localStorage.getItem("pokemon-favorites")
    if (saved) {
      setFavorites(JSON.parse(saved))
    }
  }

  const saveFavorites = (newFavorites: number[]) => {
    setFavorites(newFavorites)
    localStorage.setItem("pokemon-favorites", JSON.stringify(newFavorites))
  }

  const toggleFavorite = (pokemonId: number) => {
    const newFavorites = favorites.includes(pokemonId)
      ? favorites.filter((id) => id !== pokemonId)
      : [...favorites, pokemonId]
    saveFavorites(newFavorites)
  }

  const deletePokemon = (pokemonId: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce Pokémon ?")) {
      setAllPokemon((prev) => prev.filter((p) => p.id !== pokemonId))
    }
  }

  const handleCreatePokemon = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const body = {
        id: Number(newPokemon.id),
        name: newPokemon.name,
        type_1: newPokemon.type_1,
        type_2: newPokemon.type_2,
        height: newPokemon.height + ' m',
        weight: newPokemon.weight + ' kg',
        description: newPokemon.description,
        hp: Number(newPokemon.hp),
        attack: Number(newPokemon.attack),
        defense: Number(newPokemon.defense),
        sp_attack: Number(newPokemon.sp_attack),
        sp_defense: Number(newPokemon.sp_defense),
        speed: Number(newPokemon.speed)
      };
      const response = await fetch('http://localhost:3001/pokemons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (!response.ok) throw new Error('Erreur lors de la création');
      setShowCreateForm(false);
      setNewPokemon({
        id: '', name: '', type_1: '', type_2: '', height: '', weight: '', description: '',
        hp: '', attack: '', defense: '', sp_attack: '', sp_defense: '', speed: ''
      });
      fetchPokemon();
    } catch (err) {
      alert('Erreur lors de la création du Pokémon');
      console.error(err);
    }
  };

  const getTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      normal: "bg-gray-500",
      fire: "bg-red-600",
      water: "bg-blue-600",
      electric: "bg-yellow-500",
      grass: "bg-green-600",
      ice: "bg-cyan-400",
      fighting: "bg-red-800",
      poison: "bg-purple-600",
      ground: "bg-yellow-700",
      flying: "bg-indigo-500",
      psychic: "bg-pink-600",
      bug: "bg-green-500",
      rock: "bg-yellow-800",
      ghost: "bg-purple-800",
      dragon: "bg-indigo-800",
      dark: "bg-gray-900",
      steel: "bg-gray-600",
      fairy: "bg-pink-400",
    }
    return colors[type] || "bg-gray-500"
  }

  const totalFiltered = () => {
    let filtered = allPokemon
    if (searchTerm) {
      filtered = filtered.filter((pokemon) => pokemon.name.toLowerCase().includes(searchTerm.toLowerCase()))
    }
    if (typeFilter !== "all") {
      filtered = filtered.filter((pokemon) => pokemon.types.includes(typeFilter))
    }
    if (showFavoritesOnly) {
      filtered = filtered.filter((pokemon) => favorites.includes(pokemon.id))
    }
    return filtered.length
  }

  const totalPages = itemsPerPage === -1 ? 1 : Math.ceil(totalFiltered() / itemsPerPage)

  if (loading) {
    return (
      <div className="min-h-screen pixel-bg flex items-center justify-center">
        <div className="text-center">
          <div className="pixel-loading">CHARGEMENT DES POKÉMON...</div>
          <div className="pixel-dots">...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pixel-bg">
      {/* Header */}
      <header className="pixel-header sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-4">
              <div className="pixel-pokeball">
                <div className="pokeball-top"></div>
                <div className="pokeball-middle"></div>
                <div className="pokeball-bottom"></div>
                <div className="pokeball-center"></div>
              </div>
              <h1 className="pixel-title">POKÉDEX</h1>
            </Link>
            <div className="flex gap-2">
              <Button className="pixel-button-small" onClick={() => setShowCreateForm(true)}>
                + AJOUTER UN POKÉMON
              </Button>
              <Link href="/">
                <Button className="pixel-button-small">
                  <Home className="w-4 h-4 mr-2" />
                  ACCUEIL
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Formulaire de création */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <form onSubmit={handleCreatePokemon} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md space-y-4">
            <h2 className="text-xl font-bold mb-4">Ajouter un Pokémon</h2>
            <div className="grid grid-cols-2 gap-2">
              <input required type="number" placeholder="ID" value={newPokemon.id} onChange={e => setNewPokemon({ ...newPokemon, id: e.target.value })} className="pixel-input" />
              <input required type="text" placeholder="Nom" value={newPokemon.name} onChange={e => setNewPokemon({ ...newPokemon, name: e.target.value })} className="pixel-input" />
              <input required type="text" placeholder="Type 1" value={newPokemon.type_1} onChange={e => setNewPokemon({ ...newPokemon, type_1: e.target.value })} className="pixel-input" />
              <input type="text" placeholder="Type 2" value={newPokemon.type_2} onChange={e => setNewPokemon({ ...newPokemon, type_2: e.target.value })} className="pixel-input" />
              <input required type="number" step="0.1" placeholder="Taille (m)" value={newPokemon.height} onChange={e => setNewPokemon({ ...newPokemon, height: e.target.value })} className="pixel-input" />
              <input required type="number" step="0.1" placeholder="Poids (kg)" value={newPokemon.weight} onChange={e => setNewPokemon({ ...newPokemon, weight: e.target.value })} className="pixel-input" />
              <input required type="number" placeholder="HP" value={newPokemon.hp} onChange={e => setNewPokemon({ ...newPokemon, hp: e.target.value })} className="pixel-input" />
              <input required type="number" placeholder="Attaque" value={newPokemon.attack} onChange={e => setNewPokemon({ ...newPokemon, attack: e.target.value })} className="pixel-input" />
              <input required type="number" placeholder="Défense" value={newPokemon.defense} onChange={e => setNewPokemon({ ...newPokemon, defense: e.target.value })} className="pixel-input" />
              <input required type="number" placeholder="Atq. Spé" value={newPokemon.sp_attack} onChange={e => setNewPokemon({ ...newPokemon, sp_attack: e.target.value })} className="pixel-input" />
              <input required type="number" placeholder="Déf. Spé" value={newPokemon.sp_defense} onChange={e => setNewPokemon({ ...newPokemon, sp_defense: e.target.value })} className="pixel-input" />
              <input required type="number" placeholder="Vitesse" value={newPokemon.speed} onChange={e => setNewPokemon({ ...newPokemon, speed: e.target.value })} className="pixel-input" />
            </div>
            <textarea placeholder="Description" value={newPokemon.description} onChange={e => setNewPokemon({ ...newPokemon, description: e.target.value })} className="pixel-input w-full" />
            <div className="flex gap-2 justify-end">
              <Button type="button" className="pixel-button-danger" onClick={() => setShowCreateForm(false)}>Annuler</Button>
              <Button type="submit" className="pixel-button-success">Créer</Button>
            </div>
          </form>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="pixel-filters-container mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 w-4 h-4" />
              <Input
                type="text"
                placeholder="RECHERCHER..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setCurrentPage(1)
                }}
                className="pixel-input pl-10"
              />
            </div>

            {/* Type Filter */}
            <Select
              value={typeFilter}
              onValueChange={(value) => {
                setTypeFilter(value)
                setCurrentPage(1)
              }}
            >
              <SelectTrigger className="pixel-select">
                <SelectValue placeholder="TYPE" />
              </SelectTrigger>
              <SelectContent className="pixel-select-content">
                <SelectItem value="all">TOUS LES TYPES</SelectItem>
                {allTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {(type || '').toString().toUpperCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Items per page */}
            <Select
              value={itemsPerPage.toString()}
              onValueChange={(value) => {
                setItemsPerPage(value === "all" ? -1 : Number.parseInt(value))
                setCurrentPage(1)
              }}
            >
              <SelectTrigger className="pixel-select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="pixel-select-content">
                <SelectItem value="10">10 PAR PAGE</SelectItem>
                <SelectItem value="20">20 PAR PAGE</SelectItem>
                <SelectItem value="50">50 PAR PAGE</SelectItem>
                <SelectItem value="100">100 PAR PAGE</SelectItem>
                <SelectItem value="all">TOUS</SelectItem>
              </SelectContent>
            </Select>

            {/* Favorites toggle */}
            <Button
              onClick={() => {
                setShowFavoritesOnly(!showFavoritesOnly)
                setCurrentPage(1)
              }}
              className={`pixel-button ${showFavoritesOnly ? "pixel-button-active" : ""}`}
            >
              <Heart className={`w-4 h-4 mr-2 ${showFavoritesOnly ? "fill-current" : ""}`} />
              {showFavoritesOnly ? "TOUS" : "FAVORIS"}
            </Button>
          </div>
        </div>

        {/* Results info */}
        <div className="pixel-results-info mb-6">
          <span>
            {displayedPokemon.length} / {totalFiltered()} POKÉMON
            {showFavoritesOnly && ` (${favorites.length} FAVORIS)`}
          </span>
        </div>

        {/* Pokemon Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
          {displayedPokemon.map((pokemon) => (
            <Card key={pokemon.id} className="pixel-card">
              <CardContent className="p-3">
                <div className="text-center space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="pixel-number">#{pokemon.id.toString().padStart(3, "0")}</div>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.preventDefault()
                          toggleFavorite(pokemon.id)
                        }}
                        className="pixel-button-tiny"
                      >
                        <Heart
                          className={`w-3 h-3 ${favorites.includes(pokemon.id) ? "fill-current text-red-500" : ""}`}
                        />
                      </Button>
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.preventDefault()
                          deletePokemon(pokemon.id)
                        }}
                        className="pixel-button-tiny pixel-button-danger"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>

                  <Link href={`/pokemon/${pokemon.id}`}>
                    <div className="pixel-sprite-container cursor-pointer">
                      <Image
                        src={pokemon.image || "/placeholder.svg"}
                        alt={pokemon.name}
                        width={96}
                        height={96}
                        className="pixel-sprite"
                      />
                    </div>

                    <h3 className="pixel-name cursor-pointer">{pokemon.name.toUpperCase()}</h3>

                    <div className="flex flex-wrap gap-1 justify-center">                      {pokemon.types.map((type) => (
                        <Badge key={type} className={`pixel-type ${getTypeColor(type)}`}>
                          {(type || '').toString().toUpperCase()}
                        </Badge>
                      ))}
                    </div>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4">
            <Button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="pixel-button"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              PRÉCÉDENT
            </Button>

            <div className="pixel-page-info">
              PAGE {currentPage} / {totalPages}
            </div>

            <Button
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="pixel-button"
            >
              SUIVANT
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
