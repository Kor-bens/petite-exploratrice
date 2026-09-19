const DATA = {
  espace: {
    title: "L’espace",
    welcome: "Bienvenue dans l’espace ! On va voir le Soleil, la Lune et les planètes.",
    items: [
      { e:"☀️", n:"Soleil", t:"Le Soleil est une grande étoile. Il nous donne de la lumière et de la chaleur." },
      { e:"🌙", n:"Lune", t:"La Lune tourne autour de la Terre. La nuit, elle brille dans le ciel." },
      { e:"🌍", n:"Terre", t:"La Terre est notre planète. C’est là que nous habitons." },
      { e:"🔴", n:"Mars", t:"Mars est une planète rouge. On l’appelle la planète rouge." },
      { e:"🪐", n:"Saturne", t:"Saturne a de beaux anneaux autour d’elle." },
      { e:"🚀", n:"Fusée", t:"Une fusée s’envole très haut pour aller dans l’espace." },
      { e:"👨‍🚀", n:"Astronaute", t:"Un astronaute voyage dans l’espace avec une combinaison spéciale." },
      { e:"⭐", n:"Étoile", t:"Les étoiles sont des soleils très, très loin. Elles scintillent." }
    ],
    quiz: [
      { q:"Qu’est-ce qui nous donne de la lumière le jour ?", e:"☀️", ok:"Le Soleil", opts:["Le Soleil","Un frigo","Un bateau"], oe:["☀️","🧊","⛵"] },
      { q:"Qui voyage dans l’espace ?", e:"👨‍🚀", ok:"L’astronaute", opts:["L’astronaute","Le poisson","Le nuage"], oe:["👨‍🚀","🐟","☁️"] },
      { q:"Quelle planète a des anneaux ?", e:"🪐", ok:"Saturne", opts:["Saturne","Une pomme","Un train"], oe:["🪐","🍎","🚂"] },
      { q:"Où habitons-nous ?", e:"🌍", ok:"La Terre", opts:["La Terre","La Lune","Une étoile"], oe:["🌍","🌙","⭐"] },
      { q:"Avec quoi on va dans l’espace ?", e:"🚀", ok:"Une fusée", opts:["Une fusée","Un vélo","Une cuillère"], oe:["🚀","🚲","🥄"] }
    ]
  },
  science: {
    title: "Les sciences",
    welcome: "On découvre les animaux, les plantes, l’eau et le temps qu’il fait.",
    items: [
      { e:"🌧️", n:"Pluie", t:"La pluie, c’est de l’eau qui tombe des nuages." },
      { e:"🌈", n:"Arc-en-ciel", t:"L’arc-en-ciel apparaît quand le soleil brille pendant la pluie." },
      { e:"🌱", n:"Plante", t:"Une plante a besoin d’eau, de terre et de soleil pour grandir." },
      { e:"🦋", n:"Papillon", t:"Le papillon était d’abord une chenille. Puis il a des ailes." },
      { e:"🧊", n:"Glace", t:"Quand l’eau a très froid, elle devient de la glace." },
      { e:"💨", n:"Vent", t:"Le vent, c’est de l’air qui bouge. Il fait danser les feuilles." },
      { e:"🧲", n:"Aimant", t:"Un aimant attire le métal. Comme par magie !" },
      { e:"🫧", n:"Bulles", t:"Les bulles sont remplies d’air. Elles sont rondes et légères." }
    ],
    quiz: [
      { q:"De quoi a besoin une plante pour grandir ?", e:"🌱", ok:"D’eau et de soleil", opts:["D’eau et de soleil","De bonbons","D’une télé"], oe:["☀️","🍬","📺"] },
      { q:"Quand l’eau est très froide, elle devient…", e:"🧊", ok:"De la glace", opts:["De la glace","Du feu","Du sable"], oe:["🧊","🔥","🏖️"] },
      { q:"Qu’est-ce qui tombe des nuages ?", e:"🌧️", ok:"La pluie", opts:["La pluie","Des chaussettes","Des vélos"], oe:["🌧️","🧦","🚲"] },
      { q:"Le papillon était d’abord…", e:"🦋", ok:"Une chenille", opts:["Une chenille","Un lion","Un avion"], oe:["🐛","🦁","✈️"] },
      { q:"Le vent, c’est…", e:"💨", ok:"De l’air qui bouge", opts:["De l’air qui bouge","Du chocolat","Une chaise"], oe:["💨","🍫","🪑"] }
    ]
  },
  metiers: {
    title: "Les métiers",
    welcome: "Les métiers, ce sont les travaux des grandes personnes. Chacun aide les autres.",
    items: [
      { e:"👩‍⚕️", n:"Docteur", t:"Le docteur soigne les gens quand ils sont malades." },
      { e:"👩‍🚒", n:"Pompier", t:"Le pompier éteint le feu et aide les personnes en danger." },
      { e:"👩‍🏫", n:"Maîtresse", t:"La maîtresse apprend à lire, à compter et à jouer à l’école." },
      { e:"👨‍🍳", n:"Cuisinier", t:"Le cuisinier prépare de bons plats à manger." },
      { e:"👷", n:"Maçon", t:"Le maçon construit les maisons avec des briques." },
      { e:"👩‍🌾", n:"Agricultrice", t:"L’agricultrice fait pousser les fruits, les légumes et le blé." },
      { e:"👩‍✈️", n:"Pilote", t:"Le pilote conduit l’avion dans le ciel." },
      { e:"👮", n:"Policier", t:"Le policier aide à ce que tout le monde soit en sécurité." }
    ],
    quiz: [
      { q:"Qui soigne les malades ?", e:"👩‍⚕️", ok:"Le docteur", opts:["Le docteur","Le nuage","Le crayon"], oe:["👩‍⚕️","☁️","✏️"] },
      { q:"Qui éteint le feu ?", e:"👩‍🚒", ok:"Le pompier", opts:["Le pompier","Le chat","Le gâteau"], oe:["👩‍🚒","🐱","🎂"] },
      { q:"Qui prépare les repas ?", e:"👨‍🍳", ok:"Le cuisinier", opts:["Le cuisinier","La lune","Le ballon"], oe:["👨‍🍳","🌙","⚽"] },
      { q:"Qui conduit l’avion ?", e:"👩‍✈️", ok:"Le pilote", opts:["Le pilote","Le poisson","Le lit"], oe:["👩‍✈️","🐠","🛏️"] },
      { q:"Qui construit les maisons ?", e:"👷", ok:"Le maçon", opts:["Le maçon","La fraise","Le piano"], oe:["👷","🍓","🎹"] }
    ]
  },
  histoire: {
    title: "L’histoire",
    welcome: "Il y a très longtemps, les gens vivaient autrement. On va voir des châteaux et des dinosaures.",
    items: [
      { e:"🦕", n:"Dinosaure", t:"Il y a très, très longtemps, la Terre était un grand jardin. Des dinosaures marchaient, mangeaient des plantes ou chassaient. Regarde : ils bougent dans leur monde." },
      { e:"🏰", n:"Château", t:"Le château est une grande maison en pierre, avec des tours. Le drapeau flotte. Dedans vivaient le roi, la reine et les chevaliers." },
      { e:"👑", n:"Roi et reine", t:"Le roi et la reine habitaient au château. Ils décidaient des règles du pays et recevaient les habitants." },
      { e:"⚔️", n:"Chevalier", t:"Le chevalier protège le château. Il porte une armure et voyage à cheval pour aider les gens." },
      { e:"🏺", n:"Pot ancien", t:"Avec de la terre, on fabriquait des pots. On y gardait l’eau, le grain et la nourriture." },
      { e:"🗿", n:"Statue", t:"Les statues sont des sculptures en pierre. Elles racontent des histoires des gens d’avant." },
      { e:"🛶", n:"Bateau ancien", t:"Avant les voitures, on traversait la mer en bateau. Le vent et les rames faisaient avancer." },
      { e:"🔥", n:"Feu", t:"Le feu réchauffait, cuisait les aliments et éclairait la nuit. On faisait très attention." }
    ],
    quiz: [
      { q:"Qui vivait il y a très, très longtemps ?", e:"🦕", ok:"Les dinosaures", opts:["Les dinosaures","Les tablettes","Les frigos"], oe:["🦕","📱","🧊"] },
      { q:"Où habitaient les rois ?", e:"🏰", ok:"Dans un château", opts:["Dans un château","Dans un nuage","Dans une chaussette"], oe:["🏰","☁️","🧦"] },
      { q:"Qui protégeait le château ?", e:"⚔️", ok:"Le chevalier", opts:["Le chevalier","Le bonbon","Le canapé"], oe:["⚔️","🍬","🛋️"] },
      { q:"Avant les voitures, on voyageait…", e:"🛶", ok:"En bateau ou à cheval", opts:["En bateau ou à cheval","En fusée rose","En robot"], oe:["🐴","🚀","🤖"] },
      { q:"À quoi servait le feu autrefois ?", e:"🔥", ok:"Se chauffer et cuisiner", opts:["Se chauffer et cuisiner","Jouer au foot","Regarder la télé"], oe:["🔥","⚽","📺"] }
    ]
  },
  geo: {
    title: "La géographie",
    welcome: "La géographie, c’est la Terre : les pays, la mer, les montagnes et les forêts.",
    items: [
      { e:"🗺️", n:"Carte", t:"Une carte montre les pays, les mers et les chemins." },
      { e:"🇫🇷", n:"France", t:"La France est notre pays. Sa capitale est Paris." },
      { e:"🗼", n:"Paris", t:"Paris a la tour Eiffel. Elle est très haute et très connue." },
      { e:"🏔️", n:"Montagne", t:"Les montagnes sont très hautes. En haut, il y a souvent de la neige." },
      { e:"🌊", n:"Mer", t:"La mer est une grande étendue d’eau salée. On peut y nager." },
      { e:"🌲", n:"Forêt", t:"Dans la forêt, il y a beaucoup d’arbres, d’oiseaux et de petits animaux." },
      { e:"🏜️", n:"Désert", t:"Le désert est un endroit très sec, avec beaucoup de sable." },
      { e:"🌋", n:"Volcan", t:"Un volcan est une montagne qui peut laisser sortir de la lave très chaude." }
    ],
    quiz: [
      { q:"Quel est notre pays ?", e:"🇫🇷", ok:"La France", opts:["La France","La Lune","Le frigo"], oe:["🇫🇷","🌙","🧊"] },
      { q:"Où est la tour Eiffel ?", e:"🗼", ok:"À Paris", opts:["À Paris","Dans l’assiette","Sous le lit"], oe:["🗼","🍽️","🛏️"] },
      { q:"Qu’est-ce qui est très haut avec de la neige ?", e:"🏔️", ok:"La montagne", opts:["La montagne","Le savon","Le chapeau"], oe:["🏔️","🧼","🎩"] },
      { q:"L’eau salée, c’est…", e:"🌊", ok:"La mer", opts:["La mer","Le lait","Le jus"], oe:["🌊","🥛","🧃"] },
      { q:"Où y a-t-il beaucoup d’arbres ?", e:"🌲", ok:"Dans la forêt", opts:["Dans la forêt","Dans le four","Dans la chaussure"], oe:["🌲","🍞","👟"] }
    ]
  }
};

const PLANETS = {
  soleil: { n:"Soleil", t:"Le Soleil est une étoile. Il est au milieu. Toutes les planètes tournent autour de lui." },
  mercure: { n:"Mercure", t:"Mercure est la planète la plus proche du Soleil. Elle tourne très vite." },
  venus: { n:"Vénus", t:"Vénus est toute proche du Soleil. Elle brille très fort dans le ciel." },
  terre: { n:"Terre", t:"La Terre, c’est notre maison. La petite Lune tourne autour d’elle." },
  lune: { n:"Lune", t:"La Lune tourne autour de la Terre. La nuit, elle éclaire le ciel." },
  mars: { n:"Mars", t:"Mars est la planète rouge. Elle est juste après la Terre." },
  jupiter: { n:"Jupiter", t:"Jupiter est la plus grosse planète. Elle est énorme !" },
  saturne: { n:"Saturne", t:"Saturne a de beaux anneaux autour d’elle, comme un cerceau." },
  uranus: { n:"Uranus", t:"Uranus est une planète bleue-verte, très loin du Soleil." },
  neptune: { n:"Neptune", t:"Neptune est la dernière grande planète. Elle est bleu foncé." },
  proxima: { n:"Proxima", t:"Proxima est une autre étoile, très loin. Elle a aussi des planètes." },
  exo1: { n:"Petite planète", t:"Autour d’autres étoiles, il y a aussi des planètes. On les appelle des exoplanètes." },
  "voie-lactee": { n:"Voie lactée", t:"Notre galaxie s’appelle la Voie lactée. Elle contient des milliards d’étoiles." },
  andromede: { n:"Andromède", t:"Andromède est une autre galaxie, encore plus loin. On peut voyager avec les boutons." }
};

const GEO = {
  "amerique-n": { n:"Amérique du Nord", t:"Ici il y a le Canada, les États-Unis et le Mexique." },
  "amerique-s": { n:"Amérique du Sud", t:"Ici il y a le Brésil, avec la grande forêt amazonienne." },
  europe: { n:"Europe", t:"L’Europe, c’est notre continent. La France est ici." },
  afrique: { n:"Afrique", t:"L’Afrique est un grand continent. Il y a le désert et beaucoup d’animaux." },
  asie: { n:"Asie", t:"L’Asie est le plus grand continent. Il y a la Chine, l’Inde et le Japon." },
  oceanie: { n:"Océanie", t:"L’Océanie, c’est l’Australie et des îles dans le grand océan." },
  antarctique: { n:"Antarctique", t:"Tout en bas de la carte, il fait très froid. Il y a des pingouins." },
  france: { n:"France", t:"La France, c’est notre pays, en Europe. Sa capitale est Paris." },
  espagne: { n:"Espagne", t:"L’Espagne est au sud de la France. On y parle l’espagnol." },
  italie: { n:"Italie", t:"L’Italie est en Europe. Sur la carte, elle ressemble à une botte." },
  allemagne: { n:"Allemagne", t:"L’Allemagne est à côté de la France, en Europe." },
  uk: { n:"Royaume-Uni", t:"Le Royaume-Uni est une île près de la France. Il y a Londres." },
  usa: { n:"États-Unis", t:"Les États-Unis sont en Amérique du Nord. Un très grand pays." },
  canada: { n:"Canada", t:"Le Canada est au-dessus des États-Unis. Il y a beaucoup de forêts." },
  mexique: { n:"Mexique", t:"Le Mexique est sous les États-Unis. On y parle l’espagnol." },
  bresil: { n:"Brésil", t:"Le Brésil est le plus grand pays d’Amérique du Sud. Il y a la forêt amazonienne." },
  egypte: { n:"Égypte", t:"L’Égypte est en Afrique. Il y a le désert et les pyramides." },
  kenya: { n:"Kenya", t:"Le Kenya est en Afrique. On y voit des lions et des éléphants." },
  chine: { n:"Chine", t:"La Chine est un très grand pays en Asie." },
  inde: { n:"Inde", t:"L’Inde est en Asie. C’est un grand triangle sous la Chine." },
  japon: { n:"Japon", t:"Le Japon est un pays d’îles à l’est de l’Asie." },
  australie: { n:"Australie", t:"L’Australie est en Océanie. Il y a des kangourous." }
};

