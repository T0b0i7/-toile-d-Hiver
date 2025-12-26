# -toile-d-Hiver

Une expérience interactive de Noël immersive créée avec React, TypeScript et Vite.

## Description

-toile-d-Hiver est une application web festive qui offre une aventure personnalisée de Noël. Les utilisateurs entrent leur nom pour découvrir un voyage poétique à travers des scènes cinématiques, des jeux interactifs et des souhaits magiques.

## Fonctionnalités

### Expérience Utilisateur
- **Accueil personnalisé** : Saisie du nom avec validation
- **Cinématique d'introduction** : Scènes animées avec particules et musique
- **Révélation poétique** : Génération automatique de poèmes personnalisés
- **Défi de Noël** : Jeu de tic-tac-toe contre l'IA avec thème festif
- **Création de vœux** : Interface magique pour écrire et lancer des souhaits
- **Conclusion mémorable** : Sauvegarde des souvenirs avec codes uniques

### Expérience Spéciale
Pour certains noms spéciaux (Isabelle, Corache), une expérience personnalisée avec :
- Confirmation du nom de famille
- Animation séquentielle des messages personnels
- Galerie d'images avec effets spéciaux
- Vidéo souvenir en arrière-plan
- Poème dédié et vœux de Noël

### Jeu Tic-Tac-Toe
- IA adaptative avec difficulté variable
- Animations et effets visuels
- Possibilité de rejouer en cas d'égalité
- Thème Père Noël vs Rudolph

### Système Audio
- Musique d'ambiance adaptative
- Sons spéciaux pour l'expérience personnalisée
- Contrôles de volume

## Technologies Utilisées

- **React 18** : Framework principal
- **TypeScript** : Typage statique
- **Vite** : Outil de build rapide
- **Tailwind CSS** : Framework CSS utilitaire
- **Lucide React** : Icônes
- **HTML5 Canvas** : Effets visuels avancés

## Installation

1. Cloner le repository :
```bash
git clone <repository-url>
cd -toile-d-Hiver
```

2. Installer les dépendances :
```bash
npm install
```

3. Ajouter les assets multimédias dans `public/assets/` :
   - `s1.mpeg`, `s2.mpeg`, `s3.mpeg` : Fichiers audio
   - `I1 (1).jpeg`, `I1 (2).jpeg` : Images souvenirs
   - `V.mp4` : Vidéo souvenir

4. Lancer le serveur de développement :
```bash
npm run dev
```

5. Ouvrir `http://localhost:5173` dans le navigateur

## Structure du Projet

```
-toile-d-Hiver/
├── public/
│   ├── assets/          # Médias (audio, images, vidéos)
│   └── index.html
├── src/
│   ├── components/      # Composants React
│   │   ├── ChristmasTicTacToe.tsx
│   │   ├── CinematicIntro.tsx
│   │   ├── NameReveal3D.tsx
│   │   ├── SpecialCoracheIntro.tsx
│   │   ├── WishMaker.tsx
│   │   └── ...
│   ├── services/        # Services externes
│   ├── themes.ts        # Configuration des thèmes
│   ├── utils/           # Utilitaires
│   └── App.tsx          # Composant principal
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Configuration

### Thèmes Émotionnels
Les thèmes sont définis dans `themes.ts` et associent des couleurs et particules basées sur l'analyse du nom.

### Musique
- Utilisateurs normaux : Rotation aléatoire entre s1.mpeg et s2.mpeg
- Utilisateur spécial : s3.mpeg

### Assets Requis
Placer dans `public/assets/` :
- **Audio** : s1.mpeg, s2.mpeg, s3.mpeg
- **Images** : I1 (1).jpeg, I1 (2).jpeg
- **Vidéo** : V.mp4

## Déploiement

1. Build de production :
```bash
npm run build
```

2. Les fichiers sont générés dans `dist/`

3. Déployer le contenu de `dist/` sur un serveur web

## Fonctionnalités Avancées

### Système de Mémoire
- Sauvegarde locale des expériences
- Génération de codes de retour uniques
- Partage de souvenirs

### IA du Jeu
- Algorithme stratégique pour le tic-tac-toe
- Mode "perdant" pour utilisateurs spéciaux
- Erreurs occasionnelles pour accessibilité

### Effets Visuels
- Particules animées
- Transitions fluides
- Canvas pour effets magiques

## Contribution

1. Fork le projet
2. Créer une branche feature
3. Commiter les changements
4. Push et créer une Pull Request

## Licence

Ce projet est sous licence MIT.

## Crédits

Créé par Eucher ABATTI +229 0157002427

Développé avec ❤️ pour une expérience de Noël inoubliable.
