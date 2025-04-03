# DiscoverMe - Serveur MCP

Ce projet implémente un serveur MCP (Model Context Protocol) qui permet aux utilisateurs de partager leurs informations professionnelles avec des agents IA. Les agents IA peuvent découvrir les compétences de l'utilisateur et effectuer des actions en son nom (par exemple, "prendre rendez-vous avec moi" ou "me poser une question").

## Qu'est-ce que MCP?

Le Model Context Protocol (MCP) est un protocole standardisé qui permet aux applications de partager des informations contextuelles avec des modèles de langage, d'exposer des outils et des capacités aux systèmes d'IA, et de construire des intégrations et des flux de travail composables.

## Installation

```bash
npm install
```

## Compilation

```bash
npm run build
```

## Démarrage du serveur

```bash
npm start
```

Pour le développement :

```bash
npm run dev
```

## Configuration avec un client MCP

Pour utiliser ce serveur avec un client MCP comme Claude Desktop, vous devez configurer le client pour qu'il reconnaisse ce serveur. Consultez la documentation du client MCP pour plus d'informations sur la façon de configurer les serveurs MCP.

## Fonctionnalités prévues

- Téléchargement et stockage d'informations professionnelles (compétences, expérience, etc.)
- Exposition de ces informations aux agents IA via le protocole MCP
- Permettre aux agents IA d'effectuer des actions au nom de l'utilisateur
