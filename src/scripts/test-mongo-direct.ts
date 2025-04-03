/**
 * Script de test pour vu00e9rifier le bon fonctionnement des services MongoDB
 * Cette version n'utilise pas le SDK MCP client qui cause des probu00e8mes d'importation
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
    console.log('Connexion u00e9tablie avec succu00e8s');

    // Test 1: Vu00e9rifier que des utilisateurs existent dans la base de donnu00e9es
    console.log('\n--- Test 1: Vu00e9rification des utilisateurs ---');
    const users = await UserModel.find().lean();
    console.log(`Nombre d'utilisateurs: ${users.length}`);
    if (users.length > 0) {
      console.log('Premier utilisateur:', JSON.stringify(users[0], null, 2));
    }

    // Test 2: Vu00e9rifier que des contenus existent dans la base de donnu00e9es
    console.log('\n--- Test 2: Vu00e9rification des contenus ---');
    const contents = await ContentModel.find().lean();
    console.log(`Nombre de contenus: ${contents.length}`);
    if (contents.length > 0) {
      console.log('Premier contenu:', JSON.stringify(contents[0], null, 2));
    }

    // Test 3: Vu00e9rifier que des actions existent dans la base de donnu00e9es
    console.log('\n--- Test 3: Vu00e9rification des actions ---');
    const actions = await ActionModel.find().lean();
    console.log(`Nombre d'actions: ${actions.length}`);
    if (actions.length > 0) {
      console.log('Premiu00e8re action:', JSON.stringify(actions[0], null, 2));
    }

    // Test 4: Tester le service de profil MongoDB
    console.log('\n--- Test 4: Test du service de profil MongoDB ---');
    const profile = await profileServiceMongo.getProfile();
    console.log('Profil ru00e9cupu00e9ru00e9:', JSON.stringify(profile, null, 2));

    // Test 5: Tester la ru00e9cupu00e9ration d'une section spu00e9cifique du profil
    console.log('\n--- Test 5: Test de ru00e9cupu00e9ration des compu00e9tences ---');
    const skills = await profileServiceMongo.getProfileSection('skills');
    console.log('Compu00e9tences ru00e9cupu00e9ru00e9es:', JSON.stringify(skills, null, 2));

    // Test 6: Tester la vu00e9rification de disponibilitu00e9
    console.log('\n--- Test 6: Test de vu00e9rification de disponibilitu00e9 ---');
    const availability = await profileServiceMongo.checkAvailability('2025-04-15', '14:00');
    console.log('Disponibilitu00e9:', JSON.stringify(availability, null, 2));

    // Test 7: Tester la demande de contact
    console.log('\n--- Test 7: Test de demande de contact ---');
    const contactRequest = await profileServiceMongo.requestContact('Test de fonctionnalitu00e9', 'email');
    console.log('Ru00e9sultat de la demande:', JSON.stringify(contactRequest, null, 2));

    console.log('\nTous les tests ont u00e9tu00e9 exu00e9cutu00e9s avec succu00e8s!');
  } catch (error) {
    console.error('Erreur lors des tests:', error);
  } finally {
    // Fermer la connexion MongoDB
    await disconnectDB();
    console.log('Test terminu00e9');
  }
}

main().catch(console.error);
