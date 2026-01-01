import bcrypt from 'bcrypt';
import sequelize from './src/config/db.config.js';
import User from './src/models/User.js';
import dotenv from 'dotenv';

dotenv.config();

async function createAdmin() {
    try {
        console.log('🔗 Connecting to database...');
        await sequelize.authenticate();
        console.log('✅ Database connected successfully\n');

        // Sync the User model with database
        await User.sync();

        // Prompt for admin details (or use defaults)
        const adminData = {
            name: 'System Admin',
            email: 'admin@erp.com',
            password: 'admin123', // Change this!
            role: 'admin'
        };

        console.log('👤 Creating admin user with:');
        console.log(`   Name: ${adminData.name}`);
        console.log(`   Email: ${adminData.email}`);
        console.log(`   Role: ${adminData.role}`);
        console.log(`   Password: ${adminData.password}\n`);

        // Hash the password
        console.log('🔐 Hashing password...');
        const hashedPassword = await bcrypt.hash(adminData.password, 10);
        console.log('✅ Password hashed\n');

        // Create admin user
        console.log('💾 Creating user in database...');
        const admin = await User.findOrCreate({
            where: { email: adminData.email },
            defaults: {
                name: adminData.name,
                password: hashedPassword,
                role: adminData.role
            }
        });

        if (admin[1]) {
            console.log('✅ Admin user created successfully!');
        } else {
            console.log('ℹ️  Admin user already exists!');
        }

        console.log('\n📧 Login Credentials:');
        console.log(`   Email: ${adminData.email}`);
        console.log(`   Password: ${adminData.password}`);
        console.log('\n⚠️  IMPORTANT: Change the default password after first login!\n');

        await sequelize.close();
        process.exit(0);
    } catch (error) {
        console.error('\n❌ Error creating admin user:');
        console.error(error.message);
        console.error('\nTroubleshooting:');
        console.error('1. Check your .env file has correct database credentials');
        console.error('2. Verify Supabase database is accessible');
        console.error('3. Ensure users table exists (run schema.sql first)');
        console.error('4. Check network connection\n');

        await sequelize.close();
        process.exit(1);
    }
}

console.log('=========================================');
console.log('  ERP Admin User Creation Script');
console.log('=========================================\n');

createAdmin();
