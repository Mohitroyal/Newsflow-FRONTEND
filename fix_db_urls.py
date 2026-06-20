import sqlite3
import os

db_path = os.path.join(os.path.dirname(__file__), "backend", "newscraft.db")
conn = sqlite3.connect(db_path)
c = conn.cursor()
c.execute("UPDATE clippings SET png_url = REPLACE(png_url, 'localhost:8001', 'localhost:7860'), pdf_url = REPLACE(pdf_url, 'localhost:8001', 'localhost:7860')")
conn.commit()
print(f"Fixed {c.rowcount} clipping URL(s) from port 8001 to 7860")
conn.close()
