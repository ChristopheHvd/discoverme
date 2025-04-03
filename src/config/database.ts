import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { logger } from '../utils/logger.js';

// Charger les variables d'environnement
dotenv.config();

// URL de connexion MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/discoverme';

// Déterminer l'environnement d'exécution
const isTestEnvironment = process.env.NODE_ENV === 'test';
const isDevelopment = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;

logger.info(`Environnement: ${process.env.NODE_ENV || 'development'}`);
logger.info(`URI MongoDB: ${MONGODB_URI.includes('password') ? '***URI masquée pour sécurité***' : MONGODB_URI}`);

// Options de connexion
const options = {
  // Ces options sont dépréciées dans les versions récentes de MongoDB mais gardées pour compatibilité
  useNewUrlParser: true,
  useUnifiedTopology: true,
} as mongoose.ConnectOptions;

// Fonction de connexion à la base de données
export const connectDB = async (): Promise<void> => {
  // Si nous sommes en mode test, ne pas se connecter réellement à MongoDB
  if (isTestEnvironment) {
    logger.info('Mode test: pas de connexion à MongoDB');
    return;
  }
  
  try {
    // Vérifier si l'URI est définie
    if (!MONGODB_URI || MONGODB_URI === 'mongodb://localhost:27017/discoverme' && !isDevelopment) {
      logger.warn('Attention: Vous utilisez l\'URI MongoDB par défaut. Si vous souhaitez vous connecter à MongoDB Atlas,');
      logger.warn('créez un fichier .env à la racine du projet avec la ligne suivante:');
      logger.warn('MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/discoverme?retryWrites=true&w=majority');
    }
    
    await mongoose.connect(MONGODB_URI, options);
    logger.info('MongoDB connecté avec succès à:', MONGODB_URI.includes('mongodb+srv') ? 'MongoDB Atlas' : 'MongoDB Local');
    
    // Afficher les collections disponibles
    if (mongoose.connection.db) {
      const collections = await mongoose.connection.db.collections();
      logger.info(`Collections disponibles: ${collections.length > 0 ? collections.map(c => c.collectionName).join(', ') : 'aucune'}`);
    } else {
      logger.info('Connexion établie mais la base de données n\'est pas encore accessible');
    }
  } catch (error) {
    logger.error('Erreur de connexion MongoDB:', error);
    
    if (isDevelopment && MONGODB_URI === 'mongodb://localhost:27017/discoverme') {
      logger.error('\n=== CONSEIL DE DÉPANNAGE ===');
      logger.error('Vous semblez utiliser une connexion MongoDB locale qui n\'est pas disponible.');
      logger.error('Options:');
      logger.error('1. Installez et démarrez MongoDB localement');
      logger.error('2. Créez un fichier .env avec votre chaîne de connexion MongoDB Atlas');
      logger.error('=========================\n');
    }
    
    // Ne pas quitter le processus en mode test ou développement
    if (!isTestEnvironment && !isDevelopment) {
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
