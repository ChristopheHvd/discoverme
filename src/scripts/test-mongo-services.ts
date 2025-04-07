/**
 * Script de test pour vuérifier le bon fonctionnement des services MongoDB
 */

import { connectDB, disconnectDB } from '../config/database.js';
import { profileServiceMongo } from '../services/profileServiceMongo.js';
import UserModel from '../models/User.js';
import ContentModel from '../models/Content.js';
import ActionModel from '../models/Action.js';

async function main() {
  try {
    console.log('Connexion u00e0 MongoDB...');
    await connectDB();
    console.log('Connexion uétablie avec succu00e8s');

    // Test 1: Vuérifier que des utilisateurs existent dans la base de donnuées
    console.log('\n--- Test 1: Vuérification des utilisateurs ---');
    const users = await UserModel.find().lean();
    console.log(`Nombre d'utilisateurs: ${users.length}`);
    if (users.length > 0) {
      console.log('Premier utilisateur:', JSON.stringify(users[0], null, 2));
    }

    // Test 2: Vuérifier que des contenus existent dans la base de donnuées
    console.log('\n--- Test 2: Vuérification des contenus ---');
    const contents = await ContentModel.find().lean();
    console.log(`Nombre de contenus: ${contents.length}`);
    if (contents.length > 0) {
      console.log('Premier contenu:', JSON.stringify(contents[0], null, 2));
    }

    // Test 3: Vuérifier que des actions existent dans la base de donnuées
    console.log('\n--- Test 3: Vuérification des actions ---');
    const actions = await ActionModel.find().lean();
    console.log(`Nombre d'actions: ${actions.length}`);
    if (actions.length > 0) {
      console.log('Premiu00e8re action:', JSON.stringify(actions[0], null, 2));
    }

    // Test 4: Tester le service de profil MongoDB
    console.log('\n--- Test 4: Test du service de profil MongoDB ---');
    const profile = await profileServiceMongo.getProfile();
    console.log('Profil ruécupuérué:', JSON.stringify(profile, null, 2));

    // Test 5: Tester la ruécupuération d'une section spuécifique du profil
    console.log('\n--- Test 5: Test de ruécupuération des compuétences ---');
    const skills = await profileServiceMongo.getProfileSection('skills');
    console.log('Compuétences ruécupuéruées:', JSON.stringify(skills, null, 2));

    // Test 6: Tester la vuérification de disponibilitué
    console.log('\n--- Test 6: Test de vuérification de disponibilitué ---');
    const availability = await profileServiceMongo.checkAvailability('2025-04-15', '14:00');
    console.log('Disponibilitué:', JSON.stringify(availability, null, 2));

    // Test 7: Tester la demande de contact
    console.log('\n--- Test 7: Test de demande de contact ---');
    const contactRequest = await profileServiceMongo.requestContact('Test de fonctionnalitué', 'email');
    console.log('Ruésultat de la demande:', JSON.stringify(contactRequest, null, 2));

    console.log('\nTous les tests ont uétué exuécutués avec succu00e8s!');
  } catch (error) {
    console.error('Erreur lors des tests:', error);
  } finally {
    // Fermer la connexion MongoDB
    await disconnectDB();
    console.log('Test terminué');
  }
}

main().catch(console.error);
