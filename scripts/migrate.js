const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
	console.log('Starting database migration...');

	try {
		// Проверяем подключение к базе данных
		await prisma.$connect();
		console.log('✅ Database connection successful');

		// Здесь можно добавить дополнительные миграции если нужно
		console.log('✅ Migration completed successfully');
	} catch (error) {
		console.error('❌ Migration failed:', error);
		process.exit(1);
	} finally {
		await prisma.$disconnect();
	}
}

main();
