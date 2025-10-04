import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create test properties with different profiles
  const properties = [
    { name: 'テスト物件1', kind: 'land', zone: '市街化区域', address: '東京都渋谷区' },
    { name: 'テスト物件2', kind: 'house', zone: '市街化区域', address: '神奈川県横浜市' },
    { name: 'テスト物件3', kind: 'land', zone: '市街化調整区域', address: '千葉県千葉市' },
    { name: 'テスト物件4', kind: 'apartment', zone: '市街化区域', address: '埼玉県さいたま市' },
  ];

  for (const prop of properties) {
    await prisma.property.upsert({
      where: { id: `test-property-${properties.indexOf(prop) + 1}` },
      update: {},
      create: {
        id: `test-property-${properties.indexOf(prop) + 1}`,
        ...prop,
      },
    });
  }

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
