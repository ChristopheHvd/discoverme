/**
 * Script pour peupler la base de donnuées MongoDB avec un grand nombre de profils
 * pour tester les fonctionnalitués de recherche et de recommandation
 */
import mongoose from 'mongoose';
import { faker } from '@faker-js/faker/locale/fr';
import { connectDB, disconnectDB } from '../../config/database.js';
import User from '../../models/User.js';
import Content from '../../models/Content.js';
import Action from '../../models/Action.js';
import { logger } from '../../utils/logger.js';

// Configuration
const NUM_USERS = 100; // Nombre d'utilisateurs u00e0 cruéer
const NUM_CONNECTIONS_PER_USER = 10; // Nombre moyen de connexions par utilisateur
const NUM_CONTENTS_PER_USER = 5; // Nombre moyen de contenus par utilisateur

interface SkillsDomains {
  [key: string]: string[];
}

interface CompaniesSectors {
  [key: string]: string[];
}

interface UserDocument {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  headline?: string;
  openToWork: boolean;
  hiring: boolean;
  skills: Array<{ name: string; level?: string; endorsements?: number }>; 
  experience: Array<{ title: string; company: string; startDate: Date; endDate?: Date; description?: string }>; 
  education: Array<{ institution: string; degree: string; field?: string; startYear: number; endYear?: number }>; 
  contentIds: mongoose.Types.ObjectId[]; 
  profileViews: number; 
  actionPerformed: { calls: number; messages: number } 
  createdAt: Date; 
  updatedAt: Date 
} 

// Liste des compuétences par domaine
const skillsByDomain: SkillsDomains = {
  'Duéveloppement': [
    'JavaScript', 'TypeScript', 'Python', 'Java', 'C#', 'C++', 'Go', 'Rust', 'PHP', 'Ruby',
    'React', 'Angular', 'Vue.js', 'Svelte', 'Node.js', 'Express', 'Django', 'Flask', 'Spring Boot',
    'ASP.NET', 'Laravel', 'Ruby on Rails', 'GraphQL', 'REST API', 'WebSockets', 'Microservices',
    'MongoDB', 'PostgreSQL', 'MySQL', 'SQLite', 'Redis', 'Elasticsearch', 'DynamoDB', 'Cassandra',
    'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'Terraform', 'Ansible', 'CI/CD', 'Git', 'GitHub Actions'
  ],
  'Design': [
    'UI Design', 'UX Design', 'Figma', 'Sketch', 'Adobe XD', 'Photoshop', 'Illustrator', 'InDesign',
    'After Effects', 'Premiere Pro', 'Design Thinking', 'Wireframing', 'Prototyping', 'User Research',
    'Usability Testing', 'Responsive Design', 'Mobile Design', 'Web Design', 'Graphic Design', 'Typography'
  ],
  'Marketing': [
    'SEO', 'SEM', 'Google Ads', 'Facebook Ads', 'Instagram Ads', 'LinkedIn Ads', 'Content Marketing',
    'Email Marketing', 'Social Media Marketing', 'Influencer Marketing', 'Growth Hacking', 'Analytics',
    'Google Analytics', 'A/B Testing', 'CRO', 'Marketing Automation', 'CRM', 'Salesforce', 'HubSpot'
  ],
  'Data': [
    'Data Analysis', 'Data Science', 'Machine Learning', 'Deep Learning', 'NLP', 'Computer Vision',
    'TensorFlow', 'PyTorch', 'Scikit-learn', 'Pandas', 'NumPy', 'R', 'SPSS', 'Tableau', 'Power BI',
    'SQL', 'Big Data', 'Hadoop', 'Spark', 'Data Mining', 'Data Visualization', 'ETL', 'Data Warehousing'
  ],
  'Gestion': [
    'Project Management', 'Agile', 'Scrum', 'Kanban', 'Lean', 'Six Sigma', 'PMP', 'PRINCE2',
    'Product Management', 'JIRA', 'Trello', 'Asana', 'Monday.com', 'MS Project', 'Risk Management',
    'Stakeholder Management', 'Team Leadership', 'Strategic Planning', 'Business Analysis', 'SWOT Analysis'
  ]
};

// Liste des entreprises par secteur
const companiesBySector: CompaniesSectors = {
  'Tech': [
    'Google', 'Microsoft', 'Amazon', 'Apple', 'Facebook', 'Twitter', 'LinkedIn', 'Salesforce',
    'Oracle', 'SAP', 'IBM', 'Intel', 'AMD', 'NVIDIA', 'Cisco', 'Dassault Systu00e8mes', 'Capgemini',
    'Atos', 'Sopra Steria', 'Ubisoft', 'Blablacar', 'OVH', 'Doctolib', 'Criteo', 'Datadog'
  ],
  'Finance': [
    'BNP Paribas', 'Sociuétué Guénuérale', 'Cruédit Agricole', 'BPCE', 'AXA', 'Allianz', 'Generali',
    'HSBC', 'JPMorgan Chase', 'Goldman Sachs', 'Morgan Stanley', 'BlackRock', 'Amundi', 'Natixis'
  ],
  'Consulting': [
    'McKinsey', 'BCG', 'Bain & Company', 'Deloitte', 'PwC', 'EY', 'KPMG', 'Accenture',
    'Oliver Wyman', 'Roland Berger', 'Wavestone', 'Sia Partners', 'Kearney', 'Mazars'
  ],
  'Industrie': [
    'Airbus', 'Safran', 'Thales', 'Renault', 'PSA', 'Stellantis', 'Michelin', 'Air Liquide',
    'Saint-Gobain', 'Schneider Electric', 'Legrand', 'Alstom', 'L\'Oruéal', 'LVMH', 'Kering'
  ],
  'Startup': [
    'Alan', 'Qonto', 'Swile', 'Lydia', 'Back Market', 'Sorare', 'Ledger', 'Mirakl', 'Contentsquare',
    'Shift Technology', 'Payfit', 'Ÿnsect', 'ManoMano', 'Vestiaire Collective', 'Meero', 'Doctolib'
  ]
};

// Liste des uécoles et universitués
const educationInstitutions = [
  'HEC Paris', 'ESSEC', 'ESCP', 'EM Lyon', 'EDHEC', 'Polytechnique', 'CentraleSupuélec', 'Mines ParisTech',
  'Ponts ParisTech', 'Tuéluécom Paris', 'ENSAE', 'ENSAI', 'Sciences Po Paris', 'Universitué Paris-Saclay',
  'Sorbonne Universitué', 'Universitué PSL', 'Universitué de Paris', '42', 'Epitech', 'EPITA', 'Supuérieur',
  'INSA Lyon', 'INSA Toulouse', 'UTC', 'UTBM', 'UTT', 'IAE Paris', 'IAE Aix-Marseille', 'Dauphine'
];

// Liste des diplu00f4mes
const degrees = [
  'Bachelor', 'Master', 'MBA', 'MSc', 'Inguénieur', 'Doctorat', 'PhD', 'DUT', 'BTS', 'Licence', 'DESS', 'DEA'
];

// Liste des domaines d'uétudes
const fields = [
  'Informatique', 'Guénie Logiciel', 'Science des Donnuées', 'Intelligence Artificielle', 'Cybersecuritué',
  'Ruéseaux', 'Systu00e8mes d\'Information', 'Management', 'Finance', 'Marketing', 'Commerce', 'Droit',
  'Ressources Humaines', 'Communication', 'Design', 'Inguénierie', 'Mathuématiques', 'Physique',
  'Biologie', 'Chimie', 'Muédecine', 'Pharmacie', 'Architecture', 'Urbanisme', 'Sciences Politiques'
];

// Liste des villes franu00e7aises
const cities = [
  'Paris', 'Lyon', 'Marseille', 'Toulouse', 'Nice', 'Nantes', 'Strasbourg', 'Montpellier',
  'Bordeaux', 'Lille', 'Rennes', 'Reims', 'Saint-Etienne', 'Toulon', 'Le Havre', 'Grenoble',
  'Dijon', 'Angers', 'Nu00eemes', 'Villeurbanne', 'Aix-en-Provence', 'Le Mans', 'Clermont-Ferrand',
  'Brest', 'Tours', 'Amiens', 'Limoges', 'Annecy', 'Perpignan', 'Besanu00e7on', 'Orluéans'
];

/**
 * Guénu00e8re un profil utilisateur aluéatoire
 */
function generateRandomUser(index: number) {
  // Duéterminer le domaine principal de l'utilisateur
  const domains = Object.keys(skillsByDomain);
  const primaryDomain = domains[Math.floor(Math.random() * domains.length)];
  const secondaryDomain = domains[Math.floor(Math.random() * domains.length)];
  
  // Guénuérer des compuétences aluéatoires
  const primarySkills = faker.helpers.arrayElements(skillsByDomain[primaryDomain], Math.floor(Math.random() * 5) + 3);
  const secondarySkills = faker.helpers.arrayElements(skillsByDomain[secondaryDomain], Math.floor(Math.random() * 3) + 1);
  const allSkills = [...primarySkills, ...secondarySkills];
  
  // Guénuérer des compuétences formatuées avec niveau et recommandations
  const skills = allSkills.map(skill => ({
    name: skill,
    level: faker.helpers.arrayElement(['Beginner', 'Intermediate', 'Advanced', 'Expert']),
    endorsements: Math.floor(Math.random() * 50)
  }));
  
  // Guénuérer des expuériences professionnelles
  const numExperiences = Math.floor(Math.random() * 4) + 1;
  const experiences = [];
  
  // Secteur principal pour les expuériences
  const primarySector = Object.keys(companiesBySector)[Math.floor(Math.random() * Object.keys(companiesBySector).length)];
  
  let currentDate = new Date();
  
  for (let i = 0; i < numExperiences; i++) {
    const durationMonths = Math.floor(Math.random() * 36) + 12; // Entre 1 et 4 ans
    const startDate = new Date(currentDate);
    startDate.setMonth(currentDate.getMonth() - durationMonths);
    
    const endDate = i === 0 ? null : new Date(currentDate); // Le premier est l'emploi actuel
    
    const company = faker.helpers.arrayElement(companiesBySector[primarySector]);
    const title = faker.person.jobTitle();
    
    experiences.push({
      title,
      company,
      startDate,
      endDate,
      description: faker.lorem.paragraph()
    });
    
    currentDate = new Date(startDate);
    currentDate.setMonth(startDate.getMonth() - Math.floor(Math.random() * 6)); // Gap entre les emplois
  }
  
  // Guénuérer des formations
  const numEducations = Math.floor(Math.random() * 2) + 1;
  const educations = [];
  
  currentDate = new Date();
  currentDate.setFullYear(currentDate.getFullYear() - experiences.length * 3); // Commencer apru00e8s les expuériences
  
  for (let i = 0; i < numEducations; i++) {
    const durationYears = Math.floor(Math.random() * 3) + 2; // Entre 2 et 5 ans
    const endYear = currentDate.getFullYear();
    const startYear = endYear - durationYears;
    
    educations.push({
      institution: faker.helpers.arrayElement(educationInstitutions),
      degree: faker.helpers.arrayElement(degrees),
      field: faker.helpers.arrayElement(fields),
      startYear,
      endYear
    });
    
    currentDate.setFullYear(startYear - 1); // Gap entre les formations
  }
  
  // Guénuérer le profil complet
  return {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    avatar: faker.image.avatar(),
    headline: `${faker.person.jobTitle()} | ${primaryDomain} | ${primarySkills[0]} & ${primarySkills[1]}`,
    openToWork: Math.random() > 0.7, // 30% sont ouverts aux opportunitués
    hiring: Math.random() > 0.8, // 20% recrutent
    skills,
    experience: experiences,
    education: educations,
    profileViews: Math.floor(Math.random() * 500), // Nombre de vues du profil
    actionPerformed: {
      calls: Math.floor(Math.random() * 20),
      messages: Math.floor(Math.random() * 50),
      likes: Math.floor(Math.random() * 100),
      shares: Math.floor(Math.random() * 30)
    }
  };
}

/**
 * Guénu00e8re un contenu aluéatoire pour un utilisateur
 */
function generateRandomContent(userId: mongoose.Types.ObjectId | string){
  const contentTypes = ['article', 'post', 'image', 'video', 'document'];
  const contentType = faker.helpers.arrayElement(contentTypes);
  
  return {
    userId,
    title: faker.lorem.sentence(),
    type: contentType,
    description: faker.lorem.paragraph(),
    textContent: contentType === 'article' || contentType === 'post' ? faker.lorem.paragraphs(3) : null,
    tags: faker.helpers.arrayElements(['career', 'technology', 'business', 'development', 'design', 'marketing', 'data', 'ai'], Math.floor(Math.random() * 4) + 1)
  };
}

/**
 * Guénu00e8re une action aluéatoire pour un utilisateur
 */
function generateRandomAction(userId: mongoose.Types.ObjectId | string) {
  // Types d'actions disponibles pour les utilisateurs
  const actionTypes = ['sendMessage', 'connectWith', 'endorseSkill', 'viewProfile', 'shareContent'];
  const actionType = faker.helpers.arrayElement(actionTypes);
  
  // Générer un nom et une description basés sur le type d'action
  let name, description, endpoint;
  
  switch(actionType) {
    case 'sendMessage':
      name = 'Envoyer un message';
      description = 'Envoyer un message à un autre utilisateur';
      endpoint = '/api/messages/send';
      break;
    case 'connectWith':
      name = 'Se connecter';
      description = 'Envoyer une demande de connexion à un autre utilisateur';
      endpoint = '/api/connections/request';
      break;
    case 'endorseSkill':
      name = 'Recommander une compétence';
      description = 'Recommander une compétence d\'un autre utilisateur';
      endpoint = '/api/skills/endorse';
      break;
    case 'viewProfile':
      name = 'Voir un profil';
      description = 'Consulter le profil d\'un autre utilisateur';
      endpoint = '/api/profiles/view';
      break;
    case 'shareContent':
      name = 'Partager du contenu';
      description = 'Partager du contenu avec son réseau';
      endpoint = '/api/content/share';
      break;
  }
  
  // Générer des paramètres en fonction du type d'action
  const parameters = [];
  
  if (actionType === 'sendMessage' || actionType === 'connectWith' || actionType === 'endorseSkill' || actionType === 'viewProfile') {
    parameters.push({
      name: 'targetUserId',
      type: 'string',
      required: true
    });
  }
  
  if (actionType === 'sendMessage') {
    parameters.push({
      name: 'messageContent',
      type: 'string',
      required: true
    });
  }
  
  if (actionType === 'endorseSkill') {
    parameters.push({
      name: 'skillName',
      type: 'string',
      required: true
    });
  }
  
  if (actionType === 'shareContent') {
    parameters.push({
      name: 'contentId',
      type: 'string',
      required: true
    });
    parameters.push({
      name: 'visibility',
      type: 'string',
      required: false
    });
  }
  
  return {
    name,
    description,
    endpoint,
    parameters,
    userId
  };
}

/**
 * Fonction principale pour peupler la base de donnuées
 */
async function seedLargeDatabase() {
  try {
    // Connexion u00e0 la base de donnuées
    await connectDB();
    logger.info('Connexion u00e0 MongoDB uétablie');
    
    // Supprimer toutes les donnuées existantes
    logger.info('Suppression des donnuées existantes...');
    await User.deleteMany({});
    await Content.deleteMany({});
    await Action.deleteMany({});
    
    // Cruéer les utilisateurs
    logger.info(`Cruéation de ${NUM_USERS} utilisateurs...`);
    const userPromises = [];
    
    for (let i = 0; i < NUM_USERS; i++) {
      const userData = generateRandomUser(i);
      userPromises.push(User.create(userData));
    }
    
    const users = await Promise.all(userPromises)as UserDocument[];
    logger.info(`${users.length} utilisateurs cruéués avec succu00e8s`);
    
    // Cruéer des contenus pour chaque utilisateur
    logger.info('Cruéation des contenus...');
    const contentPromises = [];
    
    for (const user of users) {
      const numContents = Math.floor(Math.random() * NUM_CONTENTS_PER_USER) + 1;
      
      for (let i = 0; i < numContents; i++) {
        const contentData = generateRandomContent(user._id);
        contentPromises.push(Content.create(contentData));
      }
    }
    
    const contents = await Promise.all(contentPromises);
    logger.info(`${contents.length} contenus cruéués avec succu00e8s`);
    
    // Cruéer des actions pour chaque utilisateur
    logger.info('Cruéation des actions pour les utilisateurs...');
    const actionPromises = [];
    
    for (const user of users) {
      // Générer plusieurs actions pour chaque utilisateur
      const numActions = Math.floor(Math.random() * NUM_CONNECTIONS_PER_USER) + 1;
      
      for (let i = 0; i < numActions; i++) {
        const actionData = generateRandomAction(user._id);
        actionPromises.push(Action.create(actionData));
      }
    }
    
    const actions = await Promise.all(actionPromises);
    logger.info(`${actions.length} actions cruéuées avec succu00e8s`);
    
    // Mettre u00e0 jour les utilisateurs avec les IDs de contenu
    logger.info('Mise u00e0 jour des utilisateurs avec les IDs de contenu...');
    const userUpdatePromises = [];
    
    for (const user of users) {
      const userContents = contents.filter(c => c.userId.toString() === user._id.toString());
      const contentIds = userContents.map(c => c._id);
      
      userUpdatePromises.push(
        User.findByIdAndUpdate(user._id, { $set: { contentIds } })
      );
    }
    
    await Promise.all(userUpdatePromises);
    logger.info('Utilisateurs mis u00e0 jour avec les IDs de contenu');
    
    logger.info('Seeding terminué avec succu00e8s!');
    
  } catch (error) {
    logger.error('Erreur lors du seeding de la base de donnuées:', error);
  } finally {
    // Fermer la connexion u00e0 la base de donnuées
    await disconnectDB();
    logger.info('Connexion u00e0 MongoDB fermuée');
  }
}

// Exuécuter la fonction de seeding
seedLargeDatabase();
