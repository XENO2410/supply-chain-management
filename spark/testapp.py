import psycopg2

try:
    conn = psycopg2.connect(
        host="aws-0-ap-south-1.pooler.supabase.com",
        database="postgres",
        user="postgres.mmnmntijjtvnuqrkbcof",
        password="vva9cem4cc***",
        port="6543"
    )
    print("Connection successful")
except Exception as e:
    print(f"Error: {e}")
