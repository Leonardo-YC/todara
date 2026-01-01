import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create a test user
  const user = await prisma.user.upsert({
    where: { email: 'test@todoperfect.app' },
    update: {},
    create: {
      email: 'test@todoperfect.app',
      name: 'Test User',
      emailVerified: new Date(),
    },
  });

  console.log('✅ Created test user:', user.email);

  // Create sample todos
  const todos = [
    {
      text: 'Buy groceries',
      completed: false,
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      userId: user.id,
    },
    {
      text: 'Finish project documentation',
      completed: false,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
      userId: user.id,
    },
    {
      text: 'Call dentist',
      completed: true,
      dueDate: null,
      userId: user.id,
    },
    {
      text: 'Review pull requests',
      completed: false,
      dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // Tomorrow
      userId: user.id,
    },
    {
      text: 'Plan weekend trip',
      completed: false,
      dueDate: null,
      userId: user.id,
    },
    {
      text: 'Read tech article',
      completed: true,
      dueDate: null,
      userId: user.id,
    },
  ];

  for (const todo of todos) {
    await prisma.todo.create({
      data: todo,
    });
  }

  console.log(`✅ Created ${todos.length} sample todos`);
  console.log('🎉 Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });