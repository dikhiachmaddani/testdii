import type { Menu } from "@/utils/prisma/generated/prisma/client.js";

export type MenuTree = Menu & { children: MenuTree[] };
