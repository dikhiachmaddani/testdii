import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import '../config/env.config.js';
import { envClient } from '../config/env.config.js';
import { PrismaClient } from '../generated/prisma/client.js';
const { Pool } = pg;
const pool = new Pool({ connectionString: envClient.databaseUrl });
const adapter = new PrismaPg(pool);
export const prisma = new PrismaClient({ adapter });
