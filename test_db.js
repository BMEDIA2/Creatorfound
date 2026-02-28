import pg from 'pg';

const { Client } = pg;
const connectionString = "postgresql://postgres:gBiZ39Dl84TorOzN@db.ergzrhoqdglaardhaqzv.supabase.co:5432/postgres";

async function testConnection() {
    const client = new Client({
        connectionString,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        console.log("SUCCESS");
    } catch (err) {
        console.log("ERROR_MESSAGE:", err.message);
        console.log("ERROR_CODE:", err.code);
    } finally {
        await client.end();
    }
}

testConnection();
