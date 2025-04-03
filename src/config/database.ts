import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config();

// URL de connexion MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/discoverme';

// Déterminer si nous sommes en mode test
const isTestEnvironment = process.env.NODE_ENV === 'test';

// Options de connexion
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
} as mongoose.ConnectOptions;

// Fonction de connexion à la base de données
export const connectDB = async (): Promise<void> => {
  // Si nous sommes en mode test, ne pas se connecter réellement à MongoDB
  if (isTestEnvironment) {
    console.log('Mode test: pas de connexion à MongoDB');
    return;
  }
  
  try {
    await mongoose.connect(MONGODB_URI, options);
    console.log('MongoDB connecté avec succès');
  } catch (error) {
    console.error('Erreur de connexion MongoDB:', error);
    // Ne pas quitter le processus en mode test
    if (!isTestEnvironment) {
      process.exit(1);
    }
  }
};

// Fonction de déconnexion
export const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    console.log('MongoDB déconnecté avec succès');
  } catch (error) {
    console.error('Erreur lors de la déconnexion MongoDB:', error);
  }
};

// Exporter l'instance mongoose pour l'utiliser ailleurs
export default mongoose;
