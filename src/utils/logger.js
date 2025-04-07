"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupGlobalLogger = exports.logger = void 0;
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var url_1 = require("url");
// Obtenir le chemin du répertoire actuel
var __filename = (0, url_1.fileURLToPath)(import.meta.url);
var __dirname = path_1.default.dirname(__filename);
// Chemin du fichier de log
var logDir = path_1.default.join(__dirname, '..', '..', 'logs');
var logFile = path_1.default.join(logDir, 'app.log');
// Créer le répertoire de logs s'il n'existe pas
if (!fs_1.default.existsSync(logDir)) {
    fs_1.default.mkdirSync(logDir, { recursive: true });
}
// Niveaux de log
var LogLevel;
(function (LogLevel) {
    LogLevel["ERROR"] = "ERROR";
    LogLevel["WARN"] = "WARN";
    LogLevel["INFO"] = "INFO";
    LogLevel["DEBUG"] = "DEBUG";
})(LogLevel || (LogLevel = {}));
// Configuration du logger
var loggerConfig = {
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
var logToFile = function (level, message) {
    var timestamp = new Date().toISOString();
    var logMessage = "[".concat(timestamp, "] [").concat(level, "] ").concat(message, "\n");
    // Écriture asynchrone dans le fichier
    fs_1.default.appendFile(logFile, logMessage, function (err) {
        if (err && !loggerConfig.disableConsole) {
            console.error('Erreur lors de l\'écriture dans le fichier de log:', err);
        }
    });
};
/**
 * Formate un objet en chaîne de caractères pour le logging
 */
var formatObject = function (obj) {
    try {
        if (obj instanceof Error) {
            return "".concat(obj.message, "\n").concat(obj.stack || '');
        }
        return typeof obj === 'object' ? JSON.stringify(obj, null, 2) : String(obj);
    }
    catch (error) {
        return '[Objet non sérialisable]';
    }
};
/**
 * Logger principal
 */
exports.logger = {
    error: function (message) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var formattedMessage = "".concat(formatObject(message), " ").concat(args.map(formatObject).join(' '));
        logToFile(LogLevel.ERROR, formattedMessage);
        if (!loggerConfig.disableConsole && LogLevel.ERROR <= loggerConfig.consoleLevel) {
            console.error("[ERROR] ".concat(formattedMessage));
        }
    },
    warn: function (message) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var formattedMessage = "".concat(formatObject(message), " ").concat(args.map(formatObject).join(' '));
        logToFile(LogLevel.WARN, formattedMessage);
        if (!loggerConfig.disableConsole && LogLevel.WARN <= loggerConfig.consoleLevel) {
            console.warn("[WARN] ".concat(formattedMessage));
        }
    },
    info: function (message) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var formattedMessage = "".concat(formatObject(message), " ").concat(args.map(formatObject).join(' '));
        logToFile(LogLevel.INFO, formattedMessage);
        if (!loggerConfig.disableConsole && LogLevel.INFO <= loggerConfig.consoleLevel) {
            console.info("[INFO] ".concat(formattedMessage));
        }
    },
    debug: function (message) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var formattedMessage = "".concat(formatObject(message), " ").concat(args.map(formatObject).join(' '));
        logToFile(LogLevel.DEBUG, formattedMessage);
        if (!loggerConfig.disableConsole && LogLevel.DEBUG <= loggerConfig.consoleLevel) {
            console.debug("[DEBUG] ".concat(formattedMessage));
        }
    }
};
// Remplacer les fonctions console par défaut pour capturer tous les logs
var setupGlobalLogger = function () {
    // Sauvegarder les fonctions console originales
    var originalConsole = {
        log: console.log,
        info: console.info,
        warn: console.warn,
        error: console.error,
        debug: console.debug
    };
    // Remplacer les fonctions console
    console.log = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        // Utiliser le premier argument comme message et le reste comme arguments supplémentaires
        if (args.length > 0) {
            var message = args[0], rest = args.slice(1);
            exports.logger.info.apply(exports.logger, __spreadArray([message], rest, false));
        }
        if (!loggerConfig.disableConsole) {
            originalConsole.log.apply(console, args);
        }
    };
    console.info = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (args.length > 0) {
            var message = args[0], rest = args.slice(1);
            exports.logger.info.apply(exports.logger, __spreadArray([message], rest, false));
        }
        if (!loggerConfig.disableConsole) {
            originalConsole.info.apply(console, args);
        }
    };
    console.warn = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (args.length > 0) {
            var message = args[0], rest = args.slice(1);
            exports.logger.warn.apply(exports.logger, __spreadArray([message], rest, false));
        }
        if (!loggerConfig.disableConsole) {
            originalConsole.warn.apply(console, args);
        }
    };
    console.error = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (args.length > 0) {
            var message = args[0], rest = args.slice(1);
            exports.logger.error.apply(exports.logger, __spreadArray([message], rest, false));
        }
        if (!loggerConfig.disableConsole) {
            originalConsole.error.apply(console, args);
        }
    };
    console.debug = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (args.length > 0) {
            var message = args[0], rest = args.slice(1);
            exports.logger.debug.apply(exports.logger, __spreadArray([message], rest, false));
        }
        if (!loggerConfig.disableConsole) {
            originalConsole.debug.apply(console, args);
        }
    };
};
exports.setupGlobalLogger = setupGlobalLogger;
