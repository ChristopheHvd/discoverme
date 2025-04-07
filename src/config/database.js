"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnectDB = exports.connectDB = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
var dotenv_1 = __importDefault(require("dotenv"));
var logger_js_1 = require("../utils/logger.js");
// Charger les variables d'environnement
dotenv_1.default.config();
// URL de connexion MongoDB
var MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/discoverme';
// Déterminer l'environnement d'exécution
var isTestEnvironment = process.env.NODE_ENV === 'test';
var isDevelopment = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;
logger_js_1.logger.info("Environnement: ".concat(process.env.NODE_ENV || 'development'));
logger_js_1.logger.info("URI MongoDB: ".concat(MONGODB_URI.includes('password') ? '***URI masquée pour sécurité***' : MONGODB_URI));
// Options de connexion
var options = {
    // Ces options sont dépréciées dans les versions récentes de MongoDB mais gardées pour compatibilité
    useNewUrlParser: true,
    useUnifiedTopology: true,
};
// Fonction de connexion à la base de données
var connectDB = function () { return __awaiter(void 0, void 0, void 0, function () {
    var collections, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                // Si nous sommes en mode test, ne pas se connecter réellement à MongoDB
                if (isTestEnvironment) {
                    logger_js_1.logger.info('Mode test: pas de connexion à MongoDB');
                    return [2 /*return*/];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 6, , 7]);
                // Vérifier si l'URI est définie
                if (!MONGODB_URI || MONGODB_URI === 'mongodb://localhost:27017/discoverme' && !isDevelopment) {
                    logger_js_1.logger.warn('Attention: Vous utilisez l\'URI MongoDB par défaut. Si vous souhaitez vous connecter à MongoDB Atlas,');
                    logger_js_1.logger.warn('créez un fichier .env à la racine du projet avec la ligne suivante:');
                    logger_js_1.logger.warn('MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/discoverme?retryWrites=true&w=majority');
                }
                return [4 /*yield*/, mongoose_1.default.connect(MONGODB_URI, options)];
            case 2:
                _a.sent();
                logger_js_1.logger.info('MongoDB connecté avec succès à:', MONGODB_URI.includes('mongodb+srv') ? 'MongoDB Atlas' : 'MongoDB Local');
                if (!mongoose_1.default.connection.db) return [3 /*break*/, 4];
                return [4 /*yield*/, mongoose_1.default.connection.db.collections()];
            case 3:
                collections = _a.sent();
                logger_js_1.logger.info("Collections disponibles: ".concat(collections.length > 0 ? collections.map(function (c) { return c.collectionName; }).join(', ') : 'aucune'));
                return [3 /*break*/, 5];
            case 4:
                logger_js_1.logger.info('Connexion établie mais la base de données n\'est pas encore accessible');
                _a.label = 5;
            case 5: return [3 /*break*/, 7];
            case 6:
                error_1 = _a.sent();
                logger_js_1.logger.error('Erreur de connexion MongoDB:', error_1);
                if (isDevelopment && MONGODB_URI === 'mongodb://localhost:27017/discoverme') {
                    logger_js_1.logger.error('\n=== CONSEIL DE DÉPANNAGE ===');
                    logger_js_1.logger.error('Vous semblez utiliser une connexion MongoDB locale qui n\'est pas disponible.');
                    logger_js_1.logger.error('Options:');
                    logger_js_1.logger.error('1. Installez et démarrez MongoDB localement');
                    logger_js_1.logger.error('2. Créez un fichier .env avec votre chaîne de connexion MongoDB Atlas');
                    logger_js_1.logger.error('=========================\n');
                }
                // Ne pas quitter le processus en mode test ou développement
                if (!isTestEnvironment && !isDevelopment) {
                    process.exit(1);
                }
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.connectDB = connectDB;
// Fonction de déconnexion
var disconnectDB = function () { return __awaiter(void 0, void 0, void 0, function () {
    var error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, mongoose_1.default.disconnect()];
            case 1:
                _a.sent();
                console.log('MongoDB déconnecté avec succès');
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                console.error('Erreur lors de la déconnexion MongoDB:', error_2);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.disconnectDB = disconnectDB;
// Exporter l'instance mongoose pour l'utiliser ailleurs
exports.default = mongoose_1.default;
