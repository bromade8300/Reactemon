"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Heart, Edit, Save, X } from "lucide-react"

interface Pokemon {
  id: number
  name: string
  types: string[]
  image: string
  height: number
  weight: number
  stats?: {
    hp: number
    attack: number
    defense: number
    specialAttack: number
    specialDefense: number
    speed: number
  }
  abilities?: string[]
  description?: string
}

export default function PokemonDetailPage() {
  const params = useParams()
  const router = useRouter()
  const pokemonId = Number.parseInt(params.id as string)

  const [pokemon, setPokemon] = useState<Pokemon | null>(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editedPokemon, setEditedPokemon] = useState<Pokemon | null>(null)
  const [favorites, setFavorites] = useState<number[]>([])

  useEffect(() => {
    if (pokemonId) {
      fetchPokemonDetails()
      loadFavorites()
    }
  }, [pokemonId])

  const fetchPokemonDetails = async () => {
    try {
      setLoading(true)
      const [pokemonResponse, speciesResponse] = await Promise.all([
        fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`),
        fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`),
      ])

      const pokemonData = await pokemonResponse.json()
      const speciesData = await speciesResponse.json()

      const englishEntry = speciesData.flavor_text_entries.find((entry: any) => entry.language.name === "en")

      const detailedPokemon: Pokemon = {
        id: pokemonData.id,
        name: pokemonData.name,
        types: pokemonData.types.map((type: any) => type.type.name),
        image: pokemonData.sprites.front_default,
        height: pokemonData.height,
        weight: pokemonData.weight,
        stats: {
          hp: pokemonData.stats[0].base_stat,
          attack: pokemonData.stats[1].base_stat,
          defense: pokemonData.stats[2].base_stat,
          specialAttack: pokemonData.stats[3].base_stat,
          specialDefense: pokemonData.stats[4].base_stat,
          speed: pokemonData.stats[5].base_stat,
        },
        abilities: pokemonData.abilities.map((ability: any) => ability.ability.name),
        description: englishEntry?.flavor_text.replace(/\f/g, " ") || "No description available.",
      }

      setPokemon(detailedPokemon)
      setEditedPokemon(detailedPokemon)
    } catch (error) {
      console.error("Error fetching Pokemon details:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadFavorites = () => {
    const saved = localStorage.getItem("pokemon-favorites")
    if (saved) {
      setFavorites(JSON.parse(saved))
    }
  }

  const toggleFavorite = () => {
    const newFavorites = favorites.includes(pokemonId)
      ? favorites.filter((id) => id !== pokemonId)
      : [...favorites, pokemonId]
    setFavorites(newFavorites)
    localStorage.setItem("pokemon-favorites", JSON.stringify(newFavorites))
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSave = () => {
    if (editedPokemon) {
      setPokemon(editedPokemon)
      setIsEditing(false)
      // Here you would typically save to a backend
      console.log("Saving pokemon:", editedPokemon)
    }
  }

  const handleCancel = () => {
    setEditedPokemon(pokemon)
    setIsEditing(false)
  }

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

  if (loading) {
    return (
      <div className="min-h-screen pixel-bg flex items-center justify-center">
        <div className="text-center">
          <div className="pixel-loading">CHARGEMENT...</div>
        </div>
      </div>
    )
  }

  if (!pokemon) {
    return (
      <div className="min-h-screen pixel-bg flex items-center justify-center">
        <div className="text-center">
          <div className="pixel-error">POKÉMON NON TROUVÉ</div>
          <Link href="/pokemon">
            <Button className="pixel-button mt-4">RETOUR À LA LISTE</Button>
          </Link>
        </div>
      </div>
    )
  }

  const currentPokemon = isEditing ? editedPokemon! : pokemon

  return (
    <div className="min-h-screen pixel-bg">
      {/* Header */}
      <header className="pixel-header">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/pokemon" className="flex items-center space-x-2">
              <ArrowLeft className="w-5 h-5" />
              <span className="pixel-nav-text">RETOUR</span>
            </Link>

            <div className="flex items-center space-x-4">
              <Button
                onClick={toggleFavorite}
                className={`pixel-button ${favorites.includes(pokemonId) ? "pixel-button-active" : ""}`}
              >
                <Heart className={`w-4 h-4 mr-2 ${favorites.includes(pokemonId) ? "fill-current" : ""}`} />
                {favorites.includes(pokemonId) ? "RETIRÉ" : "FAVORI"}
              </Button>

              {!isEditing ? (
                <Button onClick={handleEdit} className="pixel-button">
                  <Edit className="w-4 h-4 mr-2" />
                  ÉDITER
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button onClick={handleSave} className="pixel-button pixel-button-success">
                    <Save className="w-4 h-4 mr-2" />
                    SAUVER
                  </Button>
                  <Button onClick={handleCancel} className="pixel-button pixel-button-danger">
                    <X className="w-4 h-4 mr-2" />
                    ANNULER
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Title */}
          <div className="text-center mb-8">
            <div className="pixel-detail-header">
              {isEditing ? (
                <Input
                  value={currentPokemon.name}
                  onChange={(e) => setEditedPokemon((prev) => (prev ? { ...prev, name: e.target.value } : null))}
                  className="pixel-input-large text-center"
                />
              ) : (
                <h1 className="pixel-detail-title">{currentPokemon.name.toUpperCase()}</h1>
              )}
              <div className="pixel-detail-number">#{currentPokemon.id.toString().padStart(3, "0")}</div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Left Column - Image and Basic Info */}
            <div className="space-y-6">
              <Card className="pixel-detail-card">
                <CardContent className="p-6">
                  <div className="pixel-detail-sprite-container">
                    <Image
                      src={currentPokemon.image || "/placeholder.svg"}
                      alt={currentPokemon.name}
                      width={192}
                      height={192}
                      className="pixel-detail-sprite"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="pixel-detail-card">
                <CardContent className="p-6">
                  <h3 className="pixel-section-title mb-4">INFORMATIONS</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="pixel-label">TYPES</label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {currentPokemon.types.map((type) => (
                          <Badge key={type} className={`pixel-type-large ${getTypeColor(type)}`}>
                            {type.toUpperCase()}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="pixel-label">TAILLE</label>
                        {isEditing ? (
                          <Input
                            type="number"
                            value={currentPokemon.height}
                            onChange={(e) =>
                              setEditedPokemon((prev) =>
                                prev ? { ...prev, height: Number.parseInt(e.target.value) } : null,
                              )
                            }
                            className="pixel-input mt-2"
                          />
                        ) : (
                          <div className="pixel-value">{(currentPokemon.height / 10).toFixed(1)}M</div>
                        )}
                      </div>
                      <div>
                        <label className="pixel-label">POIDS</label>
                        {isEditing ? (
                          <Input
                            type="number"
                            value={currentPokemon.weight}
                            onChange={(e) =>
                              setEditedPokemon((prev) =>
                                prev ? { ...prev, weight: Number.parseInt(e.target.value) } : null,
                              )
                            }
                            className="pixel-input mt-2"
                          />
                        ) : (
                          <div className="pixel-value">{(currentPokemon.weight / 10).toFixed(1)}KG</div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Details */}
            <div className="space-y-6">
              {currentPokemon.description && (
                <Card className="pixel-detail-card">
                  <CardContent className="p-6">
                    <h3 className="pixel-section-title mb-4">DESCRIPTION</h3>
                    {isEditing ? (
                      <textarea
                        value={currentPokemon.description}
                        onChange={(e) =>
                          setEditedPokemon((prev) => (prev ? { ...prev, description: e.target.value } : null))
                        }
                        className="pixel-textarea w-full"
                        rows={4}
                      />
                    ) : (
                      <p className="pixel-description-text">{currentPokemon.description}</p>
                    )}
                  </CardContent>
                </Card>
              )}

              {currentPokemon.abilities && (
                <Card className="pixel-detail-card">
                  <CardContent className="p-6">
                    <h3 className="pixel-section-title mb-4">CAPACITÉS</h3>
                    <div className="flex flex-wrap gap-2">
                      {currentPokemon.abilities.map((ability) => (
                        <Badge key={ability} className="pixel-ability">
                          {ability.replace("-", " ").toUpperCase()}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {currentPokemon.stats && (
                <Card className="pixel-detail-card">
                  <CardContent className="p-6">
                    <h3 className="pixel-section-title mb-4">STATISTIQUES</h3>
                    <div className="space-y-3">
                      {[
                        { name: "PV", key: "hp" as keyof typeof currentPokemon.stats },
                        { name: "ATTAQUE", key: "attack" as keyof typeof currentPokemon.stats },
                        { name: "DÉFENSE", key: "defense" as keyof typeof currentPokemon.stats },
                        { name: "ATQ. SPÉ", key: "specialAttack" as keyof typeof currentPokemon.stats },
                        { name: "DÉF. SPÉ", key: "specialDefense" as keyof typeof currentPokemon.stats },
                        { name: "VITESSE", key: "speed" as keyof typeof currentPokemon.stats },
                      ].map((stat) => (
                        <div key={stat.name} className="pixel-stat-row">
                          <div className="pixel-stat-name">{stat.name}</div>
                          {isEditing ? (
                            <Input
                              type="number"
                              value={currentPokemon.stats![stat.key]}
                              onChange={(e) =>
                                setEditedPokemon((prev) =>
                                  prev
                                    ? {
                                        ...prev,
                                        stats: prev.stats
                                          ? { ...prev.stats, [stat.key]: Number.parseInt(e.target.value) }
                                          : undefined,
                                      }
                                    : null,
                                )
                              }
                              className="pixel-input-small"
                              min="1"
                              max="255"
                            />
                          ) : (
                            <>
                              <div className="pixel-stat-bar-container">
                                <div
                                  className="pixel-stat-bar"
                                  style={{ width: `${(currentPokemon.stats![stat.key] / 255) * 100}%` }}
                                ></div>
                              </div>
                              <div className="pixel-stat-value">{currentPokemon.stats![stat.key]}</div>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
