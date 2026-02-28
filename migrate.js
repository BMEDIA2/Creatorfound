import pg from 'pg';
import fs from 'fs';

const { Client } = pg;

// Using the pooler URL from environment with the new password
const connectionString = "postgres://postgres.ergzrhoqdglaardhaqzv:gBiZ39Dl84TorOzN@aws-1-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true";

async function runMigration() {
    const client = new Client({
        connectionString,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        console.log("Connected to Supabase DB successfully!");

        // Read the SQL schema we generated earlier
        const sql = fs.readFileSync('supabase_schema.sql', 'utf8');

        console.log("Executing SQL schema...");
        await client.query(sql);

        console.log("Migration successful! Tables have been created.");
    } catch (err) {
        console.error("Migration failed:", err);
    } finally {
        await client.end();
    }
}

runMigration();
