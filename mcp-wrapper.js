#!/usr/bin/env node

/**
 * Script wrapper pour lancer l'application avec l'inspecteur MCP
 * tout en redirigeant les logs vers un fichier
 */

import { spawn } from 'child_process';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

// Obtenir le chemin du répertoire actuel
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Commande pour lancer l'inspecteur MCP
const inspectorCommand = 'npx';
const inspectorArgs = [
  '@modelcontextprotocol/inspector',
  'node',
  '--',
  join(__dirname, 'dist', 'index.js'),
  '--mcp-mode'
];

console.log('Démarrage de DiscoverMe avec l\'inspecteur MCP...');
console.log('Les logs de l\'application sont redirigés vers le fichier ./logs/app.log');
console.log('Vous pouvez suivre les logs en temps réel avec: tail -f ./logs/app.log');

// Lancer l'inspecteur MCP
const inspector = spawn(inspectorCommand, inspectorArgs, {
  stdio: 'inherit',
  shell: true
});

// Gérer les événements du processus
inspector.on('error', (error) => {
  console.error('Erreur lors du lancement de l\'inspecteur MCP:', error);
  process.exit(1);
});

inspector.on('close', (code) => {
  console.log(`L'inspecteur MCP s'est arrêté avec le code: ${code}`);
  process.exit(code || 0);
});

// Gérer les signaux pour arrêter proprement l'application
process.on('SIGINT', () => {
  console.log('\nArrêt de l\'application...');
  inspector.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log('\nArrêt de l\'application...');
  inspector.kill('SIGTERM');
});
