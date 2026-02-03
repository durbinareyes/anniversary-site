from flask import Flask, render_template, request, redirect
import sqlite3
from datetime import datetime

app = Flask(__name__)

# ---- EASY EDIT SECTION ----
data = {
    "title": "Happy 4 Months ❤️",
    "name_a": "Diego",
    "name_b": "Heyzel",
    "start_date": "2025-10-02",  # YYYY-MM-DD

    # Spotify embeds
    "our_song": "https://open.spotify.com/embed/track/5bQLsyTrUaMQRfr6whwGe5",
    "playlist": "https://open.spotify.com/embed/playlist/7de87yLIUK1um8GDJGcwsP",

    # Cover photo (top "Us" polaroid)
    "cover_photo": "photo4.jpg",

    # Gallery photos
    "photos": [
        "photo4.jpg",
        "IMG_4230.jpeg",
        "IMG_9166.png",
        "unnamed.jpg"
    ],

    "letter": (
        "Hey Heyzel,\n\n"
        "Four months in and somehow it still feels like just the beginning. Being with you has been so amazing "
        "and perfect in a way I didn't think existed\n\n"
        "Thank you for loving me even when I'm not the best boyfriend or sometimes do the wrong things\n\n"
        "I’m grateful for the laughs, the little moments, and the way we show up for each other. "
        "I am so proud of us and I wouldn’t trade what we have for anything.\n\n"
        "Happy 4 months my love. I’m excited for everything that is to come"
    ),

    "timeline": [
        {"label": "Month 1", "text": "We started something special and it felt so good right from the start."},
        {"label": "Month 2", "text": "More time together, more laughs, and the moment I realized I loved you"},
        {"label": "Month 3", "text": "Decemeber 18th we said we loved each othere and our first christmas together!"},
        {"label": "Month 4", "text": "Still strong together, still laughing, and still building something real."}
    ]
}
# --------------------------

DB = "guestbook.db"

def init_db():
    conn = sqlite3.connect(DB)
    cur = conn.cursor()
    cur.execute(
        "CREATE TABLE IF NOT EXISTS notes (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, msg TEXT, ts TEXT)"
    )
    conn.commit()
    conn.close()

def read_notes():
    conn = sqlite3.connect(DB)
    cur = conn.cursor()
    cur.execute("SELECT name, msg, ts FROM notes ORDER BY id DESC LIMIT 30")
    rows = cur.fetchall()
    conn.close()
    return rows

@app.route("/", methods=["GET"])
def home():
    init_db()
    notes = read_notes()
    return render_template("index.html", data=data, notes=notes)

@app.route("/sign", methods=["POST"])
def sign():
    init_db()
    name = request.form.get("name", "").strip()
    msg = request.form.get("msg", "").strip()

    if len(name) == 0:
        name = "Anonymous"
    if len(msg) == 0:
        return redirect("/")

    ts = datetime.now().strftime("%Y-%m-%d %H:%M")

    conn = sqlite3.connect(DB)
    cur = conn.cursor()
    cur.execute("INSERT INTO notes (name, msg, ts) VALUES (?, ?, ?)", (name, msg, ts))
    conn.commit()
    conn.close()

    return redirect("/")

if __name__ == "__main__":
    app.run(debug=True)
