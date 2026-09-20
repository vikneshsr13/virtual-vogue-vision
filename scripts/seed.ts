import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clear existing products
  await prisma.product.deleteMany({});
  
  // Create 20 products with DIFFERENT categories and images
  const products = [
    {
      title: 'Elegant Black Evening Dress',
      description: 'A stunning floor-length evening dress with elegant silhouette, perfect for formal events, galas, and special occasions. Features a flattering A-line cut with delicate details.',
      price: 129.99,
      priceINR: 10899,
      imageUrl: 'https://images.unsplash.com/photo-1566479179817-7bff9f5c8e8a?w=800&h=1200&fit=crop',
      tagline: 'Dress to impress',
      category: 'Dress',
      brand: 'Vogue Elegance',
      color: 'Black',
      stock: 15,
    },
    {
      title: 'Summer Floral Maxi Dress',
      description: 'Light and breezy floral maxi dress perfect for warm weather. Features beautiful floral patterns, comfortable fabric, and a flowing silhouette that moves with you.',
      price: 59.99,
      priceINR: 4999,
      imageUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&h=1200&fit=crop',
      tagline: 'Embrace the sunshine',
      category: 'Dress',
      brand: 'Summer Breeze',
      color: 'Pink',
      stock: 20,
    },
    {
      title: 'Classic White Business Shirt',
      description: 'Professional white business shirt perfect for office and corporate environments. Crisp, tailored fit with modern details and premium fabric.',
      price: 49.99,
      priceINR: 4199,
      imageUrl: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&h=1200&fit=crop',
      tagline: 'Professional elegance',
      category: 'Shirt',
      brand: 'Professional Style',
      color: 'White',
      stock: 25,
    },
    {
      title: 'Slim Fit Black Trousers',
      description: 'Classic black slim-fit trousers perfect for business and formal occasions. Tailored fit with modern cut and premium fabric.',
      price: 79.99,
      priceINR: 6699,
      imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&h=1200&fit=crop',
      tagline: 'Timeless sophistication',
      category: 'Trousers',
      brand: 'Classic Collection',
      color: 'Black',
      stock: 18,
    },
    {
      title: 'High-Waisted A-Line Skirt',
      description: 'Flattering high-waisted A-line skirt perfect for office and casual occasions. Comfortable fit with elegant silhouette.',
      price: 54.99,
      priceINR: 4599,
      imageUrl: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=800&h=1200&fit=crop',
      tagline: 'Feminine charm',
      category: 'Skirt',
      brand: 'Feminine Style',
      color: 'Navy',
      stock: 22,
    },
    {
      title: 'Professional Navy Business Dress',
      description: 'Classic business dress in navy blue, perfect for office and professional meetings. Tailored fit with modern details, suitable for corporate environments.',
      price: 89.99,
      priceINR: 7499,
      imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&h=1200&fit=crop',
      tagline: 'Power dressing redefined',
      category: 'Dress',
      brand: 'Professional Style',
      color: 'Navy',
      stock: 12,
    },
    {
      title: 'Vibrant Red Party Dress',
      description: 'Bold and stylish red dress perfect for parties, celebrations, and nightlife. Eye-catching color with a flattering fit that makes you stand out.',
      price: 79.99,
      priceINR: 6699,
      imageUrl: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&h=1200&fit=crop',
      tagline: 'Party ready',
      category: 'Dress',
      brand: 'Night Life',
      color: 'Red',
      stock: 18,
    },
    {
      title: 'Casual Denim Pants',
      description: 'Comfortable casual denim pants perfect for everyday wear. Classic fit with modern styling and premium denim fabric.',
      price: 64.99,
      priceINR: 5499,
      imageUrl: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=1200&fit=crop',
      tagline: 'Everyday comfort',
      category: 'Pants',
      brand: 'Casual Wear',
      color: 'Blue',
      stock: 30,
    },
    {
      title: 'Silk Blouse Top',
      description: 'Elegant silk blouse perfect for office and evening occasions. Luxurious fabric with sophisticated design details.',
      price: 89.99,
      priceINR: 7499,
      imageUrl: 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=800&h=1200&fit=crop',
      tagline: 'Luxury defined',
      category: 'Top',
      brand: 'Luxury Collection',
      color: 'Ivory',
      stock: 15,
    },
    {
      title: 'Classic Black Blazer',
      description: 'Timeless black blazer perfect for business and formal occasions. Tailored fit with structured shoulders and premium fabric.',
      price: 119.99,
      priceINR: 9999,
      imageUrl: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&h=1200&fit=crop&q=80',
      tagline: 'Professional power',
      category: 'Blazer',
      brand: 'Professional Style',
      color: 'Black',
      stock: 14,
    },
    {
      title: 'Floral Print Midi Skirt',
      description: 'Beautiful floral print midi skirt perfect for spring and summer. Flowing fabric with feminine silhouette.',
      price: 59.99,
      priceINR: 4999,
      imageUrl: 'https://images.unsplash.com/photo-1566479179817-7bff9f5c8e8a?w=800&h=1200&fit=crop&q=80',
      tagline: 'Spring vibes',
      category: 'Skirt',
      brand: 'Floral Dreams',
      color: 'Multi-color',
      stock: 20,
    },
    {
      title: 'Vintage Green Retro Dress',
      description: 'Retro-inspired dress with modern comfort. Features vintage-style details, comfortable fit, and timeless elegance that never goes out of style.',
      price: 69.99,
      priceINR: 5899,
      imageUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&h=1200&fit=crop&q=80',
      tagline: 'Timeless elegance',
      category: 'Dress',
      brand: 'Vintage Charm',
      color: 'Green',
      stock: 10,
    },
    {
      title: 'White Lace Wedding Guest Dress',
      description: 'Beautiful white lace dress perfect for weddings, garden parties, and formal daytime events. Delicate lace details with a romantic, feminine silhouette.',
      price: 99.99,
      priceINR: 8399,
      imageUrl: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&h=1200&fit=crop',
      tagline: 'Elegance redefined',
      category: 'Dress',
      brand: 'Bridal Collection',
      color: 'White',
      stock: 14,
    },
    {
      title: 'Blue Floral Summer Dress',
      description: 'Charming blue floral dress with vibrant patterns. Perfect for summer outings, brunches, and casual elegant occasions. Lightweight and comfortable.',
      price: 54.99,
      priceINR: 4599,
      imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&h=1200&fit=crop',
      tagline: 'Summer vibes',
      category: 'Dress',
      brand: 'Floral Dreams',
      color: 'Blue',
      stock: 22,
    },
    {
      title: 'Tailored Navy Trousers',
      description: 'Professional navy trousers with perfect tailoring. Ideal for business and formal occasions with modern fit.',
      price: 84.99,
      priceINR: 7099,
      imageUrl: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&h=1200&fit=crop&q=80',
      tagline: 'Perfect fit',
      category: 'Trousers',
      brand: 'Tailored Collection',
      color: 'Navy',
      stock: 16,
    },
    {
      title: 'Casual Cotton Shirt',
      description: 'Comfortable casual cotton shirt perfect for everyday wear. Relaxed fit with modern styling.',
      price: 44.99,
      priceINR: 3799,
      imageUrl: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=1200&fit=crop&q=80',
      tagline: 'Everyday style',
      category: 'Shirt',
      brand: 'Casual Wear',
      color: 'White',
      stock: 28,
    },
    {
      title: 'Leather Jacket',
      description: 'Stylish leather jacket perfect for cool weather. Classic design with modern details and premium leather.',
      price: 149.99,
      priceINR: 12499,
      imageUrl: 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=800&h=1200&fit=crop&q=80',
      tagline: 'Edgy elegance',
      category: 'Jacket',
      brand: 'Leather Collection',
      color: 'Black',
      stock: 8,
    },
    {
      title: 'Pleated Midi Skirt',
      description: 'Elegant pleated midi skirt perfect for office and formal occasions. Classic design with modern twist.',
      price: 69.99,
      priceINR: 5899,
      imageUrl: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&h=1200&fit=crop&q=80',
      tagline: 'Sophisticated style',
      category: 'Skirt',
      brand: 'Classic Collection',
      color: 'Gray',
      stock: 17,
    },
    {
      title: 'Wide Leg Pants',
      description: 'Comfortable wide leg pants perfect for casual and office wear. Modern silhouette with comfortable fit.',
      price: 74.99,
      priceINR: 6299,
      imageUrl: 'https://images.unsplash.com/photo-1566479179817-7bff9f5c8e8a?w=800&h=1200&fit=crop&q=80',
      tagline: 'Comfort meets style',
      category: 'Pants',
      brand: 'Comfort Wear',
      color: 'Beige',
      stock: 19,
    },
    {
      title: 'Elegant Purple Cocktail Dress',
      description: 'Sophisticated purple cocktail dress perfect for evening events, dinners, and semi-formal occasions. Rich color with elegant design details.',
      price: 94.99,
      priceINR: 7999,
      imageUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&h=1200&fit=crop&q=80',
      tagline: 'Evening elegance',
      category: 'Dress',
      brand: 'Cocktail Hour',
      color: 'Purple',
      stock: 11,
    },
  ];

  console.log('Creating products...');
  for (const product of products) {
    await prisma.product.create({
      data: product,
    });
    console.log(`Created: ${product.title} (${product.category})`);
  }

  // Create sample designer if not exists
  const existingDesigner = await prisma.designer.findFirst({
    where: { email: 'sarah@designer.com' },
  });

  if (!existingDesigner) {
    await prisma.designer.create({
      data: {
        name: 'Sarah Fashion Design',
        email: 'sarah@designer.com',
        phone: '+1-555-0123',
        address: '123 Fashion Street, New York',
        specialization: 'Dress Customization',
        rating: 4.8,
        isAvailable: true,
      },
    });
    console.log('Created designer: Sarah Fashion Design');
  }

  console.log(`\n✅ Successfully created ${products.length} products with various categories!`);
  console.log('Categories included: Dress, Shirt, Pants, Trousers, Skirt, Top, Blazer, Jacket');
  console.log('Seed data completed!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
