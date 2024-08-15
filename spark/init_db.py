import sqlite3

def init_db():
    conn = sqlite3.connect('supply_chain.db')
    c = conn.cursor()

    # Create a table for shipments
    c.execute('''CREATE TABLE IF NOT EXISTS shipments (
        id INTEGER PRIMARY KEY,
        shipment_id TEXT NOT NULL,
        origin TEXT NOT NULL,
        destination TEXT NOT NULL,
        current_location TEXT,
        status TEXT NOT NULL,
        eta TEXT
    )''')

    # Create a table for users
    c.execute('''
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
    )
    ''')

    conn.commit()
    conn.close()

if __name__ == '__main__':
    init_db()
    print("Database initialized!")
