import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, List, Search, Heart, Edit, Trash2 } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen pixel-bg">
      {/* Hero Section */}
      <section className="pixel-hero">
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="pixel-pokeball-large mb-8">
            <div className="pokeball-top"></div>
            <div className="pokeball-middle"></div>
            <div className="pokeball-bottom"></div>
            <div className="pokeball-center"></div>
          </div>

          <h1 className="pixel-hero-title mb-4">POKÉDEX RÉTRO</h1>
          <p className="pixel-hero-subtitle mb-8">
            DÉCOUVREZ LES 151 POKÉMON ORIGINAUX
            <br />
            DANS UN STYLE PIXEL ART AUTHENTIQUE
          </p>

          <Link href="/pokemon">
            <Button className="pixel-button-large">COMMENCER L'AVENTURE</Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="pixel-section-title text-center mb-12">FONCTIONNALITÉS</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="pixel-feature-card">
              <CardContent className="p-6 text-center">
                <List className="w-12 h-12 mx-auto mb-4 pixel-icon" />
                <h3 className="pixel-feature-title">LISTE COMPLÈTE</h3>
                <p className="pixel-feature-text">Parcourez tous les Pokémon avec pagination et filtres avancés</p>
              </CardContent>
            </Card>

            <Card className="pixel-feature-card">
              <CardContent className="p-6 text-center">
                <Search className="w-12 h-12 mx-auto mb-4 pixel-icon" />
                <h3 className="pixel-feature-title">RECHERCHE</h3>
                <p className="pixel-feature-text">Trouvez vos Pokémon par nom ou type instantanément</p>
              </CardContent>
            </Card>

            <Card className="pixel-feature-card">
              <CardContent className="p-6 text-center">
                <Heart className="w-12 h-12 mx-auto mb-4 pixel-icon" />
                <h3 className="pixel-feature-title">FAVORIS</h3>
                <p className="pixel-feature-text">Sauvegardez vos Pokémon préférés dans votre collection</p>
              </CardContent>
            </Card>

            <Card className="pixel-feature-card">
              <CardContent className="p-6 text-center">
                <Edit className="w-12 h-12 mx-auto mb-4 pixel-icon" />
                <h3 className="pixel-feature-title">ÉDITION</h3>
                <p className="pixel-feature-text">Modifiez les informations de vos Pokémon</p>
              </CardContent>
            </Card>

            <Card className="pixel-feature-card">
              <CardContent className="p-6 text-center">
                <Trash2 className="w-12 h-12 mx-auto mb-4 pixel-icon" />
                <h3 className="pixel-feature-title">GESTION</h3>
                <p className="pixel-feature-text">Supprimez les Pokémon de votre liste</p>
              </CardContent>
            </Card>

            <Card className="pixel-feature-card">
              <CardContent className="p-6 text-center">
                <Users className="w-12 h-12 mx-auto mb-4 pixel-icon" />
                <h3 className="pixel-feature-title">DÉTAILS</h3>
                <p className="pixel-feature-text">Consultez toutes les statistiques détaillées</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 pixel-team-section">
        <div className="container mx-auto px-4">
          <h2 className="pixel-section-title text-center mb-12">ÉQUIPE DE DÉVELOPPEMENT</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto center">
            <Card className="pixel-team-card">
              <CardContent className="p-6 text-center">
                <div className="pixel-avatar mb-4">
                  <div className="pixel-trainer-sprite">
                      <img src="https://media.discordapp.net/attachments/1328744086902935552/1374691352977080490/file_00000000f08461f4bfafa69850eb3890.png?ex=6853e297&is=68529117&hm=cd7f6db56b117e4045b01a13e98f34e5636b0e4faa79cd71c6e12bf357b2c822&=&format=webp&quality=lossless&width=823&height=823"/>
                  </div>
                </div>
                <h3 className="pixel-team-name">DÉVELOPPEUR PRINCIPAL</h3>
                <p className="pixel-team-role">MAÎTRE POKÉMON</p>
                <div className="flex justify-center gap-2 mt-4">
                  <Badge className="pixel-skill">REACT</Badge>
                  <Badge className="pixel-skill">NEXT.JS</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="pixel-team-card">
              <CardContent className="p-6 text-center">
                <div className="pixel-avatar mb-4">
                  <div className="pixel-trainer-sprite">
                  <img src="https://media.discordapp.net/attachments/1328744086902935552/1356967278557659298/assets2Ftask_01jqv75ev0enes5m6swddms3mm2Fimg_0.png?ex=68540142&is=6852afc2&hm=2b171aac0d06d6989bc880b81100a3c46dd1d2ff4bbf9ce8a8b08c0fa6bb57b8&=&format=webp&quality=lossless&width=1234&height=823"/>
                  </div>
                </div>
                <h3 className="pixel-team-name">DÉVELOPPEUR API</h3>
                <p className="pixel-team-role">EXPERT DONNÉES</p>
                <div className="flex justify-center gap-2 mt-4">
                  <Badge className="pixel-skill">API</Badge>
                  <Badge className="pixel-skill">DATABASE</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 text-center">
        <div className="container mx-auto px-4">
          <h2 className="pixel-cta-title mb-4">PRÊT À DEVENIR UN MAÎTRE POKÉMON ?</h2>
          <p className="pixel-cta-text mb-8">Explorez le monde des Pokémon avec notre Pokédex rétro</p>
          <Link href="/pokemon">
            <Button className="pixel-button-large">VOIR TOUS LES POKÉMON</Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
