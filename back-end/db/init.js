const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

// PostgreSQL 연결 설정 (본인 환경에 맞게 수정)
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'petplace',
  password: '1111',
  port: 5432,
});

// SQL 스키마 파일 경로 (예: sql/postgresql_schema.sql)
const schemaPath = path.resolve(__dirname, 'sql/postgresql_schema.sql');
const sql = fs.readFileSync(schemaPath, 'utf8');

// 실행
async function initializeDatabase() {
  try {
    await pool.query(sql);
    console.log('✅ Database schema executed successfully');
  } catch (err) {
    console.error('❌ Error executing schema:', err);
  } finally {
    await pool.end();
  }
}

initializeDatabase();