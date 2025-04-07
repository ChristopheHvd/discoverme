"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importStar(require("mongoose"));
// Schéma pour les compétences
var SkillSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    level: { type: String },
    endorsements: { type: Number, default: 0 }
});
// Schéma pour les expériences professionnelles
var ExperienceSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    company: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    description: { type: String }
});
// Schéma pour les formations
var EducationSchema = new mongoose_1.Schema({
    institution: { type: String, required: true },
    degree: { type: String, required: true },
    field: { type: String },
    startYear: { type: Number, required: true },
    endYear: { type: Number }
});
// Schéma pour les actions effectuées
var ActionPerformedSchema = new mongoose_1.Schema({
    calls: { type: Number, default: 0 },
    messages: { type: Number, default: 0 }
}, { _id: false, strict: false });
// Schéma principal pour l'utilisateur
var UserSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    avatar: { type: String },
    headline: { type: String },
    openToWork: { type: Boolean, default: false },
    hiring: { type: Boolean, default: false },
    skills: [SkillSchema],
    experience: [ExperienceSchema],
    education: [EducationSchema],
    contentIds: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Content' }],
    profileViews: { type: Number, default: 0 },
    actionPerformed: { type: ActionPerformedSchema, default: {} },
}, { timestamps: true });
// Création et export du modèle
exports.default = mongoose_1.default.model('User', UserSchema);
