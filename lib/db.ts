import mysql from "mysql2/promise"

// Database connection pool
let pool: mysql.Pool

function getPool() {
  if (!pool) {
    // Get individual connection parameters from environment variables
    const host = process.env.DB_HOST
    const user = process.env.DB_USER
    const password = process.env.DB_PASS || "Manila99!!" // Use the specified password
    const database = process.env.DB_NAME

    // Validate required environment variables
    if (!host || !user || !database) {
      throw new Error("Database configuration environment variables are not set properly")
    }

    // Create a connection pool with individual parameters
    pool = mysql.createPool({
      host,
      user,
      password, // Using the password from env or the default "Manila99!!"
      database,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    })
  }

  return pool
}

// Execute a query with parameters
export async function query(text: string, params?: any[]) {
  const pool = getPool()
  try {
    const start = Date.now()
    const [rows, fields] = await pool.execute(text, params)
    const duration = Date.now() - start
    console.log("Executed query", { text, duration, rows: Array.isArray(rows) ? rows.length : 1 })
    return { rows, fields }
  } catch (error) {
    console.error("Error executing query", { text, error })
    throw error
  }
}

// Create users table if it doesn't exist
export async function initializeDatabase() {
  try {
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY unique_email (email)
      )
    `)
    console.log("Database initialized successfully")
  } catch (error) {
    console.error("Failed to initialize database", error)
    throw error
  }
}

