/**
 * Script pour compiler et exu00e9cuter le script de seeding
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

// Exu00e9cuter la compilation TypeScript
exec('npm run build', (error, stdout, stderr) => {
  if (error) {
    console.error(`Erreur de compilation: ${error.message}`);
    return;
  }
  
  if (stderr) {
    console.error(`Erreur standard: ${stderr}`);
    return;
  }
  
  console.log('Compilation terminu00e9e avec succu00e8s');
  console.log('Exu00e9cution du script de seeding...');
  
  // Exu00e9cuter le script compilu00e9
  exec(`node ${scriptPath}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Erreur d'exu00e9cution: ${error.message}`);
      return;
    }
    
    if (stderr) {
      console.error(`Erreur standard: ${stderr}`);
    }
    
    console.log(stdout);
    console.log('Script de seeding exu00e9cutu00e9 avec succu00e8s');
  });
});
