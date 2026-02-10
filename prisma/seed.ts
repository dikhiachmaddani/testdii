import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';
import pg from 'pg';
import { PrismaClient } from '../src/utils/prisma/generated/prisma/client.js';

const { Pool } = pg;
const connectionString = process.env.DATABASE_URL;

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('Seeding database...');

    // 1. Create Roles
    const roleAdmin = await prisma.role.upsert({
        where: { name: 'ADMIN' },
        update: {},
        create: { name: 'ADMIN' },
    });

    const roleUser = await prisma.role.upsert({
        where: { name: 'USER' },
        update: {},
        create: { name: 'USER' },
    });

    console.log('Roles created.');

    // 2. Create User
    const hashedPassword = await bcrypt.hash('password', 10);
    const user = await prisma.user.upsert({
        where: { username: 'admin' },
        update: {},
        create: {
            username: 'admin',
            password: hashedPassword,
        },
    });

    console.log('User created.');

    // 3. Assign Roles to User
    await prisma.userRole.upsert({
        where: {
            userId_roleId: {
                userId: user.id,
                roleId: roleAdmin.id,
            },
        },
        update: {},
        create: {
            userId: user.id,
            roleId: roleAdmin.id,
        },
    });

    await prisma.userRole.upsert({
        where: {
            userId_roleId: {
                userId: user.id,
                roleId: roleUser.id,
            },
        },
        update: {},
        create: {
            userId: user.id,
            roleId: roleUser.id,
        },
    });

    console.log('Roles assigned to user.');

    // 4. Create Menus

    const createMenu = async (name: string, parentId: string | null = null) => {
        let menu = await prisma.menu.findFirst({
            where: { name, parentId },
        });

        if (!menu) {
            menu = await prisma.menu.create({
                data: { name, parentId },
            });
        }
        return menu;
    }

    // Structure:
    // Menu 1
    // ├── Menu 1.1
    // ├── Menu 1.2
    // │   ├── Menu 1.2.1
    // │   └── Menu 1.2.2
    // │       ├── Menu 1.2.2.1
    // │       └── Menu 1.2.2.2
    // └── Menu 1.3
    //     └── Menu 1.3.1
    //         └── Menu 1.3.1.1

    const m1 = await createMenu('Menu 1', null);
    await createMenu('Menu 1.1', m1.id);
    const m1_2 = await createMenu('Menu 1.2', m1.id);
    await createMenu('Menu 1.2.1', m1_2.id);
    const m1_2_2 = await createMenu('Menu 1.2.2', m1_2.id);
    await createMenu('Menu 1.2.2.1', m1_2_2.id);
    await createMenu('Menu 1.2.2.2', m1_2_2.id);
    const m1_3 = await createMenu('Menu 1.3', m1.id);
    const m1_3_1 = await createMenu('Menu 1.3.1', m1_3.id);
    await createMenu('Menu 1.3.1.1', m1_3_1.id);

    // Menu 2
    // ├── Menu 2.1
    // └── Menu 2.2
    //     ├── Menu 2.2.1
    //     ├── Menu 2.2.2
    //     │   ├── Menu 2.2.2.1
    //     │   └── Menu 2.2.2.2
    //     └── Menu 2.2.3
    //         └── Menu 2.2.3.1
    // └── Menu 2.3

    const m2 = await createMenu('Menu 2', null);
    await createMenu('Menu 2.1', m2.id);
    const m2_2 = await createMenu('Menu 2.2', m2.id);
    await createMenu('Menu 2.2.1', m2_2.id);
    const m2_2_2 = await createMenu('Menu 2.2.2', m2_2.id);
    await createMenu('Menu 2.2.2.1', m2_2_2.id);
    await createMenu('Menu 2.2.2.2', m2_2_2.id);
    const m2_2_3 = await createMenu('Menu 2.2.3', m2_2.id);
    await createMenu('Menu 2.2.3.1', m2_2_3.id);
    await createMenu('Menu 2.3', m2.id);

    // Menu 3
    // ├── Menu 3.1
    // └── Menu 3.2
    //     └── Menu 3.2.1

    const m3 = await createMenu('Menu 3', null);
    await createMenu('Menu 3.1', m3.id);
    const m3_2 = await createMenu('Menu 3.2', m3.id);
    await createMenu('Menu 3.2.1', m3_2.id);

    console.log('Menus created.');

    // 5. Assign Menus to Roles
    // Give ADMIN access to everything
    const allMenus = await prisma.menu.findMany();
    for (const menu of allMenus) {
        await prisma.roleMenu.upsert({
            where: {
                roleId_menuId: {
                    roleId: roleAdmin.id,
                    menuId: menu.id,
                },
            },
            update: {},
            create: {
                roleId: roleAdmin.id,
                menuId: menu.id,
            },
        });
    }

    const userMenus = allMenus.filter(m => m.name.startsWith('Menu 1'));

    for (const menu of userMenus) {
        await prisma.roleMenu.upsert({
            where: {
                roleId_menuId: {
                    roleId: roleUser.id,
                    menuId: menu.id,
                },
            },
            update: {},
            create: {
                roleId: roleUser.id,
                menuId: menu.id,
            },
        });
    }

    console.log('Menus assigned to roles.');
    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
