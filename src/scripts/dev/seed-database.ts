/**
 * Script pour peupler la base de données MongoDB avec des données fictives
 */
import mongoose from 'mongoose';
import { connectDB, disconnectDB } from '../../config/database.js';
import User from '../../models/User.js';
import Content, { IContent } from '../../models/Content.js';
import Action from '../../models/Action.js';

// Données fictives pour les utilisateurs
const users = [
  {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+33 6 12 34 56 78',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    headline: 'Développeur Full Stack | Expert JavaScript | React & Node.js',
    openToWork: true,
    hiring: false,
    skills: [
      { name: 'JavaScript', level: 'Expert', endorsements: 28 },
      { name: 'TypeScript', level: 'Expert', endorsements: 22 },
      { name: 'React', level: 'Expert', endorsements: 25 },
      { name: 'Node.js', level: 'Expert', endorsements: 20 },
      { name: 'GraphQL', level: 'Advanced', endorsements: 15 },
      { name: 'MongoDB', level: 'Advanced', endorsements: 12 },
      { name: 'AWS', level: 'Intermediate', endorsements: 8 },
    ],
    experience: [
      {
        title: 'Senior Developer',
        company: 'Tech Innovators',
        startDate: new Date('2020-01-01'),
        endDate: null, // Emploi actuel
        description: 'Développement d\'applications web modernes utilisant React, Node.js et GraphQL. Lead technique sur plusieurs projets majeurs.'
      },
      {
        title: 'Développeur Frontend',
        company: 'Startup Vision',
        startDate: new Date('2018-03-01'),
        endDate: new Date('2019-12-31'),
        description: 'Création d\'interfaces utilisateur réactives avec React et Redux. Implémentation de tests automatisés.'
      },
      {
        title: 'Développeur Web Junior',
        company: 'Digital Solutions',
        startDate: new Date('2016-06-01'),
        endDate: new Date('2018-02-28'),
        description: 'Développement frontend avec HTML, CSS et JavaScript. Maintenance de sites web existants.'
      }
    ],
    education: [
      {
        institution: 'Université de Technologie',
        degree: 'Master en Informatique',
        field: 'Développement Web et Mobile',
        startYear: 2014,
        endYear: 2016
      },
      {
        institution: 'Institut Supérieur d\'Informatique',
        degree: 'Licence en Informatique',
        field: 'Programmation et Algorithmes',
        startYear: 2011,
        endYear: 2014
      }
    ],
    contentIds: [], // Sera rempli après la création des contenus
    profileViews: 245,
    actionPerformed: {
      calls: 12,
      messages: 35,
      availability_checks: 28
    }
  },
  {
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '+33 6 98 76 54 32',
    avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
    headline: 'UX/UI Designer | Expert en Design Thinking | 8 ans d\'expérience',
    openToWork: false,
    hiring: true,
    skills: [
      { name: 'UI Design', level: 'Expert', endorsements: 32 },
      { name: 'UX Research', level: 'Expert', endorsements: 28 },
      { name: 'Figma', level: 'Expert', endorsements: 30 },
      { name: 'Adobe XD', level: 'Advanced', endorsements: 25 },
      { name: 'Sketch', level: 'Advanced', endorsements: 22 },
      { name: 'Prototyping', level: 'Expert', endorsements: 26 },
      { name: 'HTML/CSS', level: 'Intermediate', endorsements: 15 },
    ],
    experience: [
      {
        title: 'Lead UX/UI Designer',
        company: 'Creative Agency',
        startDate: new Date('2019-04-01'),
        endDate: null, // Emploi actuel
        description: 'Direction de l\'équipe design sur des projets majeurs. Création d\'expériences utilisateur innovantes pour des clients internationaux.'
      },
      {
        title: 'UX Designer',
        company: 'Digital Products',
        startDate: new Date('2017-02-01'),
        endDate: new Date('2019-03-31'),
        description: 'Conception d\'interfaces utilisateur et réalisation de tests d\'utilisabilité. Collaboration étroite avec les équipes de développement.'
      },
      {
        title: 'Web Designer',
        company: 'Web Studio',
        startDate: new Date('2015-05-01'),
        endDate: new Date('2017-01-31'),
        description: 'Création de maquettes de sites web et d\'applications mobiles. Intégration HTML/CSS.'
      }
    ],
    education: [
      {
        institution: 'École de Design',
        degree: 'Master en Design Numérique',
        field: 'UX/UI Design',
        startYear: 2013,
        endYear: 2015
      },
      {
        institution: 'Université des Arts',
        degree: 'Licence en Arts Appliqués',
        field: 'Design Graphique',
        startYear: 2010,
        endYear: 2013
      }
    ],
    contentIds: [], // Sera rempli après la création des contenus
    profileViews: 312,
    actionPerformed: {
      calls: 8,
      messages: 42,
      availability_checks: 15
    }
  },
  {
    name: 'Marc Dubois',
    email: 'marc.dubois@example.com',
    phone: '+33 6 45 67 89 10',
    avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
    headline: 'Data Scientist | IA & Machine Learning | PhD en Mathématiques Appliquées',
    openToWork: true,
    hiring: false,
    skills: [
      { name: 'Python', level: 'Expert', endorsements: 35 },
      { name: 'Machine Learning', level: 'Expert', endorsements: 30 },
      { name: 'Deep Learning', level: 'Advanced', endorsements: 25 },
      { name: 'TensorFlow', level: 'Expert', endorsements: 28 },
      { name: 'PyTorch', level: 'Advanced', endorsements: 22 },
      { name: 'SQL', level: 'Advanced', endorsements: 20 },
      { name: 'Data Visualization', level: 'Advanced', endorsements: 18 },
    ],
    experience: [
      {
        title: 'Data Scientist Senior',
        company: 'AI Solutions',
        startDate: new Date('2020-06-01'),
        endDate: new Date('2023-12-31'),
        description: 'Développement d\'algorithmes de machine learning pour des applications de recommandation. Optimisation de modèles prédictifs.'
      },
      {
        title: 'Data Scientist',
        company: 'Data Insights',
        startDate: new Date('2018-09-01'),
        endDate: new Date('2020-05-31'),
        description: 'Analyse de données et création de modèles prédictifs. Implémentation de solutions de data mining.'
      },
      {
        title: 'Chercheur en IA',
        company: 'Université de Recherche',
        startDate: new Date('2016-01-01'),
        endDate: new Date('2018-08-31'),
        description: 'Recherche sur les algorithmes d\'apprentissage profond. Publication d\'articles scientifiques.'
      }
    ],
    education: [
      {
        institution: 'Université de Sciences',
        degree: 'Doctorat en Mathématiques Appliquées',
        field: 'Intelligence Artificielle',
        startYear: 2013,
        endYear: 2016
      },
      {
        institution: 'École d\'Ingénieurs',
        degree: 'Master en Informatique',
        field: 'Science des Données',
        startYear: 2011,
        endYear: 2013
      },
      {
        institution: 'Université de Mathématiques',
        degree: 'Licence en Mathématiques',
        field: 'Statistiques et Probabilités',
        startYear: 2008,
        endYear: 2011
      }
    ],
    contentIds: [], // Sera rempli après la création des contenus
    profileViews: 178,
    actionPerformed: {
      calls: 5,
      messages: 22,
      availability_checks: 10
    }
  }
];

// Données fictives pour les contenus
const contents = [
  {
    title: 'Guide complet du développement React en 2025',
    type: 'article',
    description: 'Un guide détaillé sur les meilleures pratiques de développement React en 2025, incluant les hooks, les patterns et l\'optimisation.',
    textContent: 'Le développement React a considérablement évolué depuis ses débuts. Aujourd\'hui, en 2025, les hooks sont devenus la norme...',
    tags: ['React', 'JavaScript', 'Frontend', 'Web Development']
  },
  {
    title: 'Introduction à GraphQL pour les développeurs REST',
    type: 'tutorial',
    description: 'Apprenez à passer de REST à GraphQL avec ce tutoriel complet pour les développeurs habitués aux API REST.',
    textContent: 'GraphQL offre une alternative puissante aux API REST traditionnelles. Dans ce tutoriel, nous allons explorer...',
    tags: ['GraphQL', 'API', 'Backend', 'Web Development']
  },
  {
    title: 'Portfolio de design UX/UI',
    type: 'portfolio',
    description: 'Une collection de mes meilleurs projets de design UX/UI réalisés pour divers clients et industries.',
    textContent: 'Ce portfolio présente une sélection de mes travaux en design d\'interface et d\'expérience utilisateur...',
    tags: ['UX', 'UI', 'Design', 'Portfolio']
  },
  {
    title: 'Principes de Design Thinking appliqués aux produits numériques',
    type: 'article',
    description: 'Comment appliquer les principes du Design Thinking pour créer des produits numériques centrés sur l\'utilisateur.',
    textContent: 'Le Design Thinking est une approche centrée sur l\'humain qui peut transformer la façon dont vous concevez des produits...',
    tags: ['Design Thinking', 'UX', 'Product Design']
  },
  {
    title: 'Analyse prédictive des comportements utilisateurs avec Python',
    type: 'research',
    description: 'Étude de cas sur l\'utilisation du machine learning pour prédire les comportements des utilisateurs sur une plateforme e-commerce.',
    textContent: 'Dans cette étude, nous avons utilisé des algorithmes de machine learning pour analyser et prédire les comportements d\'achat...',
    tags: ['Machine Learning', 'Python', 'Data Science', 'E-commerce']
  },
  {
    title: 'Implémentation de réseaux de neurones avec TensorFlow',
    type: 'tutorial',
    description: 'Guide pratique pour implémenter différents types de réseaux de neurones avec TensorFlow et Python.',
    textContent: 'Les réseaux de neurones sont au cœur des avancées récentes en intelligence artificielle. Dans ce tutoriel...',
    tags: ['Deep Learning', 'TensorFlow', 'Python', 'AI']
  }
];

// Données fictives pour les actions
const actions = [
  {
    name: 'Planifier un appel',
    description: 'Planifier un appel téléphonique ou une visioconférence avec le professionnel',
    endpoint: '/api/schedule-call',
    parameters: [
      { name: 'date', type: 'string', required: true },
      { name: 'time', type: 'string', required: true },
      { name: 'duration', type: 'number', required: false },
      { name: 'topic', type: 'string', required: true }
    ]
  },
  {
    name: 'Envoyer un message',
    description: 'Envoyer un message direct au professionnel',
    endpoint: '/api/send-message',
    parameters: [
      { name: 'content', type: 'string', required: true },
      { name: 'priority', type: 'string', required: false }
    ]
  },
  {
    name: 'Demander un devis',
    description: 'Demander un devis pour un projet spécifique',
    endpoint: '/api/request-quote',
    parameters: [
      { name: 'projectDescription', type: 'string', required: true },
      { name: 'budget', type: 'number', required: false },
      { name: 'deadline', type: 'string', required: false }
    ]
  }
];

/**
 * Fonction principale pour peupler la base de données
 */
async function seedDatabase() {
  try {
    // Connexion à la base de données
    await connectDB();
    console.log('Connexion à MongoDB établie');

    // Supprimer toutes les données existantes
    await User.deleteMany({});
    await Content.deleteMany({});
    await Action.deleteMany({});
    console.log('Données existantes supprimées');

    // Créer les utilisateurs
    const createdUsers = await User.insertMany(users);
    console.log(`${createdUsers.length} utilisateurs créés`);

    // Créer les contenus et les associer aux utilisateurs
    const contentPromises = [];
    
    // Répartir les contenus entre les utilisateurs
    for (let i = 0; i < contents.length; i++) {
      const userIndex = i % createdUsers.length;
      const content = {
        ...contents[i],
        userId: createdUsers[userIndex]._id
      };
      contentPromises.push(Content.create(content));
    }
    
    const createdContents = await Promise.all(contentPromises);
    console.log(`${createdContents.length} contenus créés`);

    // Mettre à jour les utilisateurs avec les IDs des contenus
    const userContentMap = new Map<string, mongoose.Types.ObjectId[]>();
    
    createdContents.forEach((content) => {
      const userId = content.userId.toString();
      if (!userContentMap.has(userId)) {
        userContentMap.set(userId, []);
      }
      const contentArray = userContentMap.get(userId);
      if (contentArray) {
        contentArray.push(content._id as mongoose.Types.ObjectId);
      }
    });
    
    const userUpdatePromises: Promise<any>[] = [];
    
    userContentMap.forEach((contentIds, userId) => {
      userUpdatePromises.push(
        User.findByIdAndUpdate(
          userId,
          { $set: { contentIds } }
        )
      );
    });
    
    await Promise.all(userUpdatePromises);
    console.log('Utilisateurs mis à jour avec les IDs des contenus');

    // Créer les actions et les associer aux utilisateurs
    const actionPromises = [];
    
    // Répartir les actions entre les utilisateurs
    for (let i = 0; i < actions.length; i++) {
      const userIndex = i % createdUsers.length;
      const action = {
        ...actions[i],
        userId: createdUsers[userIndex]._id
      };
      actionPromises.push(Action.create(action));
    }
    
    const createdActions = await Promise.all(actionPromises);
    console.log(`${createdActions.length} actions créées`);

    console.log('Base de données peuplée avec succès!');
  } catch (error) {
    console.error('Erreur lors du peuplement de la base de données:', error);
  } finally {
    // Déconnexion de la base de données
    await disconnectDB();
    console.log('Déconnexion de MongoDB');
  }
}

// Exécuter la fonction de seeding
seedDatabase();
