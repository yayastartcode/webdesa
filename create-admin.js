const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    // Check if admin already exists
    const existingAdmin = await prisma.user.findFirst({
      where: {
        role: 'ADMIN'
      }
    });

    if (existingAdmin) {
      console.log('Admin user already exists:', existingAdmin.email);
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('admin123', 12);

    // Create admin user
    const admin = await prisma.user.create({
      data: {
        name: 'Administrator',
        email: 'admin@desasa.com',
        password: hashedPassword,
        role: 'ADMIN'
      }
    });

    console.log('Admin user created successfully:');
    console.log('Email:', admin.email);
    console.log('Name:', admin.name);
    console.log('Role:', admin.role);
    console.log('ID:', admin.id);
    
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();