import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔧 Fixing Designer table migration...\n');

  try {
    // Get all designers without userId using raw query
    const designers = await prisma.$queryRaw<Array<{ id: string; email: string; name: string }>>`
      SELECT id, email, name FROM Designer
    `;

    console.log(`Found ${designers.length} designer(s) in database:\n`);

    for (const designer of designers) {
      console.log(`Processing: ${designer.name} (${designer.email})`);

      // Try to find a user with matching email
      const user = await prisma.user.findUnique({
        where: { email: designer.email },
      });

      if (user) {
        // Check if designer already has userId
        const designerRecord = await prisma.designer.findUnique({
          where: { id: designer.id },
          select: { userId: true },
        });

        if (!designerRecord?.userId) {
          // Link designer to existing user
          try {
            await prisma.designer.update({
              where: { id: designer.id },
              data: { userId: user.id },
            });
            console.log(`  ✅ Linked to existing user: ${user.id}`);
          } catch (error: any) {
            console.error(`  ❌ Error linking: ${error.message}`);
            
            // If linking fails (e.g., userId already exists for another designer), delete the orphaned designer
            if (error.code === 'P2002' || error.message?.includes('UNIQUE constraint')) {
              console.log(`  🗑️  Deleting orphaned designer record...`);
              await prisma.designer.delete({
                where: { id: designer.id },
              });
              console.log(`  ✅ Deleted orphaned designer`);
            }
          }
        } else {
          console.log(`  ✅ Already linked to user: ${designerRecord.userId}`);
        }
      } else {
        // No user exists, delete the orphaned designer
        console.log(`  ⚠️  No user found with email ${designer.email}`);
        console.log(`  🗑️  Deleting orphaned designer record (no matching user)...`);
        
        await prisma.designer.delete({
          where: { id: designer.id },
        });
        console.log(`  ✅ Deleted orphaned designer`);
      }
    }

    // Verify all designers now have userId
    const allDesigners = await prisma.designer.findMany({
      select: { id: true, userId: true, email: true },
    });

    const withoutUserId = allDesigners.filter(d => !d.userId);
    
    if (withoutUserId.length > 0) {
      console.log(`\n⚠️  Warning: ${withoutUserId.length} designer(s) still without userId:`);
      withoutUserId.forEach(d => console.log(`  - ${d.email}`));
      console.log('You may need to manually fix these or delete them.');
    } else {
      console.log('\n✅ All designers are now properly linked to users!');
      console.log('You can now run: npm run db:push');
    }
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('❌ Error fixing migration:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
