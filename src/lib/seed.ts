import { deckRepo, cardRepo } from './data';

export async function seedDemoData() {
  try {
    // Check if data already exists
    const existingDecks = await deckRepo.list();
    if (existingDecks.length > 0) {
      console.log('Demo data already exists, skipping seed');
      return;
    }

    // Create demo deck
    const demoDeck = await deckRepo.create({
      title: 'Enzymes — Quick Start',
      description: 'Essential enzyme concepts for biology students',
    });

    // Create demo cards
    const demoCards = [
      {
        front: 'What is an enzyme?',
        back: 'An enzyme is a biological catalyst that speeds up chemical reactions without being consumed in the process.',
        tags: ['definition', 'basics']
      },
      {
        front: 'What is the active site of an enzyme?',
        back: 'The active site is the specific region of an enzyme where the substrate binds and the chemical reaction occurs.',
        tags: ['structure', 'active-site']
      },
      {
        front: 'What is enzyme specificity?',
        back: 'Enzyme specificity refers to the ability of an enzyme to bind only to specific substrates due to the unique shape of its active site.',
        tags: ['specificity', 'binding']
      },
      {
        front: 'What factors affect enzyme activity?',
        back: 'Temperature, pH, substrate concentration, enzyme concentration, and the presence of inhibitors or activators.',
        tags: ['factors', 'conditions']
      },
      {
        front: 'What is the lock and key model?',
        back: 'A model that describes enzyme-substrate binding where the enzyme (lock) has a specific shape that perfectly fits the substrate (key).',
        tags: ['models', 'binding-mechanism']
      },
      {
        front: 'What is the induced fit model?',
        back: 'A model where the enzyme changes shape slightly when the substrate binds, creating a better fit and more effective catalysis.',
        tags: ['models', 'binding-mechanism']
      },
      {
        front: 'What is enzyme denaturation?',
        back: 'The process where an enzyme loses its three-dimensional structure due to extreme conditions (high temperature, extreme pH), making it non-functional.',
        tags: ['denaturation', 'structure']
      },
      {
        front: 'What is the optimal temperature for most human enzymes?',
        back: 'Around 37°C (98.6°F), which is normal human body temperature.',
        tags: ['temperature', 'optimal-conditions']
      },
      {
        front: 'What is competitive inhibition?',
        back: 'A type of enzyme inhibition where the inhibitor competes with the substrate for binding to the active site.',
        tags: ['inhibition', 'competitive']
      },
      {
        front: 'What is non-competitive inhibition?',
        back: 'A type of enzyme inhibition where the inhibitor binds to a different site on the enzyme, changing its shape and reducing activity.',
        tags: ['inhibition', 'non-competitive']
      },
      {
        front: 'What is the Michaelis-Menten equation?',
        back: 'V = (Vmax × [S]) / (Km + [S]), where V is reaction velocity, Vmax is maximum velocity, [S] is substrate concentration, and Km is the Michaelis constant.',
        tags: ['kinetics', 'equation']
      },
      {
        front: 'What does Km represent in enzyme kinetics?',
        back: 'Km (Michaelis constant) is the substrate concentration at which the reaction velocity is half of Vmax. It indicates enzyme affinity for substrate.',
        tags: ['kinetics', 'km-constant']
      },
      {
        front: 'What is a coenzyme?',
        back: 'A non-protein organic molecule that helps enzymes function by binding to the enzyme and participating in the catalytic process.',
        tags: ['cofactors', 'organic']
      },
      {
        front: 'What is a cofactor?',
        back: 'A non-protein chemical compound that is required for an enzyme\'s activity. It can be organic (coenzyme) or inorganic (metal ions).',
        tags: ['cofactors', 'inorganic']
      },
      {
        front: 'What is feedback inhibition?',
        back: 'A regulatory mechanism where the end product of a metabolic pathway inhibits an earlier enzyme in the pathway, controlling the overall rate.',
        tags: ['regulation', 'feedback']
      }
    ];

    // Create all demo cards
    for (const cardData of demoCards) {
      await cardRepo.create({
        deckId: demoDeck._id,
        front: cardData.front,
        back: cardData.back,
        tags: cardData.tags,
      });
    }

    console.log('Demo data seeded successfully!');
    console.log(`Created deck: ${demoDeck.title}`);
    console.log(`Created ${demoCards.length} cards`);
  } catch (error) {
    console.error('Failed to seed demo data:', error);
  }
}
