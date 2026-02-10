import { prisma } from './lib/prisma.js';
import { AuthService } from './services/auth.service.js';
import { MenuService } from './services/menu.service.js';
import { RoleService } from './services/role.service.js';
async function main() {
    const authService = new AuthService();
    const menuService = new MenuService();
    const roleService = new RoleService();
    console.log('--- STARTING VERIFICATION ---');
    // 1. Login as admin
    console.log('\n1. Logging in as admin...');
    const loginResult = await authService.login('admin', 'password');
    console.log('Login successful. User ID:', loginResult.userId);
    console.log('Roles:', loginResult.roles.map(r => r.name));
    const adminRole = loginResult.roles.find(r => r.name === 'ADMIN');
    if (!adminRole)
        throw new Error('ADMIN role not found for admin user');
    // 2. Select ADMIN role
    console.log('\n2. Selecting ADMIN role...');
    const adminSession = await authService.selectRole(loginResult.userId, adminRole.id);
    console.log('Role selected. Token generated:', !!adminSession.accessToken);
    // 3. Get Menus for ADMIN
    console.log('\n3. Fetching menus for ADMIN role...');
    const adminMenus = await menuService.getRoleMenus(adminRole.id);
    console.log('Admin Menus Count (Roots):', adminMenus.length);
    // Expect full tree.
    // 4. Create MANAGER Role
    console.log('\n4. Creating MANAGER role...');
    // Check if exists first to avoid duplicate error if re-run
    let managerRole = (await roleService.getAllRoles()).find(r => r.name === 'MANAGER');
    if (!managerRole) {
        managerRole = await roleService.createRole('MANAGER');
        console.log('MANAGER role created:', managerRole.id);
    }
    else {
        console.log('MANAGER role already exists:', managerRole.id);
    }
    // 5. Assign "Menu 1" to MANAGER
    console.log('\n5. Assigning "Menu 1" to MANAGER...');
    const allMenus = await menuService.getAllMenus();
    // Flatten to find "Menu 1"
    // Actually getAllMenus returns tree.
    // Let's use repository or just find in tree.
    // Assuming "Menu 1" is at root.
    const menu1 = allMenus.find(m => m.name === 'Menu 1');
    if (!menu1)
        throw new Error('Menu 1 not found');
    await roleService.assignMenuToRole(managerRole.id, menu1.id);
    console.log('Menu 1 assigned to MANAGER');
    // 6. Assign admin user to MANAGER role
    console.log('\n6. Assigning admin user to MANAGER role...');
    await roleService.assignUserToRole(loginResult.userId, managerRole.id);
    console.log('User assigned to MANAGER role');
    // 7. Login again to refresh roles
    console.log('\n7. Logging in again as admin...');
    const loginResult2 = await authService.login('admin', 'password');
    console.log('Roles:', loginResult2.roles.map(r => r.name));
    const hasManager = loginResult2.roles.some(r => r.name === 'MANAGER');
    if (!hasManager)
        throw new Error('MANAGER role not found in login result');
    // 8. Select MANAGER role
    console.log('\n8. Selecting MANAGER role...');
    const managerSession = await authService.selectRole(loginResult.userId, managerRole.id);
    // 9. Get Menus for MANAGER
    console.log('\n9. Fetching menus for MANAGER role...');
    const managerMenus = await menuService.getRoleMenus(managerRole.id);
    console.log('Manager Menus Count (Roots):', managerMenus.length);
    console.log('Manager Menus Names:', managerMenus.map(m => m.name));
    if (managerMenus.length === 1 && managerMenus[0].name === 'Menu 1') {
        console.log('\nSUCCESS: Manager sees only Menu 1!');
    }
    else {
        console.error('\nFAILURE: Unexpected menu list for Manager');
    }
    console.log('\n--- VERIFICATION COMPLETE ---');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
