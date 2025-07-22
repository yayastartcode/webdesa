const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedApbDesa() {
  try {
    const currentYear = new Date().getFullYear();
    
    // Check if data already exists for current year
    const existingData = await prisma.apbDesa.findUnique({
      where: { year: currentYear }
    });
    
    if (existingData) {
      console.log(`APB Desa data for year ${currentYear} already exists`);
      return;
    }
    
    // Create sample APB Desa data for current year
    const apbData = await prisma.apbDesa.create({
      data: {
        year: currentYear,
        pendapatanDesa: 4802205800.00, // Sample amount from the image
        belanjaDesa: 4888222678.00,    // Sample amount from the image
        isActive: true
      }
    });
    
    console.log('APB Desa data created successfully:', apbData);
  } catch (error) {
    console.error('Error seeding APB Desa data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedApbDesa();