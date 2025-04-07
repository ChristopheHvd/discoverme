/**
 * Script pour compiler et exuécuter le script de seeding
 */

// Compiler le script TypeScript
import { exec } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtenir le chemin du répertoire actuel en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Chemin vers le fichier de compilation
const scriptPath = path.join(__dirname, '..', '..', 'dist', 'scripts', 'seed-database.js');

console.log('Compilation du script de seeding...');

// Exuécuter la compilation TypeScript
exec('npm run build', (error, stdout, stderr) => {
  if (error) {
    console.error(`Erreur de compilation: ${error.message}`);
    return;
  }
  
  if (stderr) {
    console.error(`Erreur standard: ${stderr}`);
    return;
  }
  
  console.log('Compilation terminuée avec succu00e8s');
  console.log('Exuécution du script de seeding...');
  
  // Exuécuter le script compilué
  exec(`node ${scriptPath}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Erreur d'exuécution: ${error.message}`);
      return;
    }
    
    if (stderr) {
      console.error(`Erreur standard: ${stderr}`);
    }
    
    console.log(stdout);
    console.log('Script de seeding exuécutué avec succu00e8s');
  });
});
