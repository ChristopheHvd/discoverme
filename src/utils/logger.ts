import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtenir le chemin du répertoire actuel
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Chemin du fichier de log
const logDir = path.join(__dirname, '..', '..', 'logs');
const logFile = path.join(logDir, 'app.log');

// Créer le répertoire de logs s'il n'existe pas
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Niveaux de log
enum LogLevel {
  ERROR = 'ERROR',
  WARN = 'WARN',
  INFO = 'INFO',
  DEBUG = 'DEBUG'
}

// Configuration du logger
const loggerConfig = {
  // Niveau de log pour la console
  consoleLevel: process.env.NODE_ENV === 'production' ? LogLevel.ERROR : LogLevel.DEBUG,
  // Niveau de log pour le fichier - toujours actif avec niveau maximum
  fileLevel: LogLevel.DEBUG,
  // Désactiver les logs console uniquement en mode MCP pour éviter les interférences
  // mais garder les logs console actifs par défaut
  disableConsole: process.env.MCP_MODE === 'true'
};

/**
 * Écrit un message dans le fichier de log
 */
const logToFile = (level: LogLevel, message: string): void => {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [${level}] ${message}\n`;
  
  // Écriture asynchrone dans le fichier
  fs.appendFile(logFile, logMessage, (err) => {
    if (err && !loggerConfig.disableConsole) {
      console.error('Erreur lors de l\'écriture dans le fichier de log:', err);
    }
  });
};

/**
 * Formate un objet en chaîne de caractères pour le logging
 */
const formatObject = (obj: unknown): string => {
  try {
    if (obj instanceof Error) {
      return `${obj.message}\n${obj.stack || ''}`;
    }
    return typeof obj === 'object' ? JSON.stringify(obj, null, 2) : String(obj);
  } catch (error) {
    return '[Objet non sérialisable]';
  }
};

/**
 * Logger principal
 */
export const logger = {
  error: (message: unknown, ...args: unknown[]): void => {
    const formattedMessage = `${formatObject(message)} ${args.map(formatObject).join(' ')}`;
    logToFile(LogLevel.ERROR, formattedMessage);
    
    if (!loggerConfig.disableConsole && LogLevel.ERROR <= loggerConfig.consoleLevel) {
      console.error(`[ERROR] ${formattedMessage}`);
    }
  },
  
  warn: (message: unknown, ...args: unknown[]): void => {
    const formattedMessage = `${formatObject(message)} ${args.map(formatObject).join(' ')}`;
    logToFile(LogLevel.WARN, formattedMessage);
    
    if (!loggerConfig.disableConsole && LogLevel.WARN <= loggerConfig.consoleLevel) {
      console.warn(`[WARN] ${formattedMessage}`);
    }
  },
  
  info: (message: unknown, ...args: unknown[]): void => {
    const formattedMessage = `${formatObject(message)} ${args.map(formatObject).join(' ')}`;
    logToFile(LogLevel.INFO, formattedMessage);
    
    if (!loggerConfig.disableConsole && LogLevel.INFO <= loggerConfig.consoleLevel) {
      console.info(`[INFO] ${formattedMessage}`);
    }
  },
  
  debug: (message: unknown, ...args: unknown[]): void => {
    const formattedMessage = `${formatObject(message)} ${args.map(formatObject).join(' ')}`;
    logToFile(LogLevel.DEBUG, formattedMessage);
    
    if (!loggerConfig.disableConsole && LogLevel.DEBUG <= loggerConfig.consoleLevel) {
      console.debug(`[DEBUG] ${formattedMessage}`);
    }
  }
};

// Remplacer les fonctions console par défaut pour capturer tous les logs
export const setupGlobalLogger = (): void => {
  // Sauvegarder les fonctions console originales
  const originalConsole = {
    log: console.log,
    info: console.info,
    warn: console.warn,
    error: console.error,
    debug: console.debug
  };

  // Remplacer les fonctions console
  console.log = (...args: unknown[]) => {
    // Utiliser le premier argument comme message et le reste comme arguments supplémentaires
    if (args.length > 0) {
      const [message, ...rest] = args;
      logger.info(message, ...rest);
    }
    if (!loggerConfig.disableConsole) {
      originalConsole.log.apply(console, args);
    }
  };

  console.info = (...args: unknown[]) => {
    if (args.length > 0) {
      const [message, ...rest] = args;
      logger.info(message, ...rest);
    }
    if (!loggerConfig.disableConsole) {
      originalConsole.info.apply(console, args);
    }
  };

  console.warn = (...args: unknown[]) => {
    if (args.length > 0) {
      const [message, ...rest] = args;
      logger.warn(message, ...rest);
    }
    if (!loggerConfig.disableConsole) {
      originalConsole.warn.apply(console, args);
    }
  };

  console.error = (...args: unknown[]) => {
    if (args.length > 0) {
      const [message, ...rest] = args;
      logger.error(message, ...rest);
    }
    if (!loggerConfig.disableConsole) {
      originalConsole.error.apply(console, args);
    }
  };

  console.debug = (...args: unknown[]) => {
    if (args.length > 0) {
      const [message, ...rest] = args;
      logger.debug(message, ...rest);
    }
    if (!loggerConfig.disableConsole) {
      originalConsole.debug.apply(console, args);
    }
  };
};
