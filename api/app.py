from flask import Flask, request, render_template, url_for, jsonify
from flask_cors import CORS
import psycopg2 
import datetime
import jwt
import os
import hashlib

app = Flask(__name__)
app.config.from_object('config.Config')
CORS(app)

@app.route("/api")
def index():
    query = "SELECT user_name, post_id, title FROM post ORDER BY post_id desc"
    resp = db_query(query, None, resp=True)
    if resp:
        return jsonify(resp)
    print("No sql post data")
    return jsonify(list())

@app.route("/api/user/<username>")
def user(username):
    query = """
            SELECT user_name, post_id, title
            FROM post
            WHERE user_name = %(username)s
            ORDER BY post_id desc
            """
    mapping = {"username": username}
    resp = db_query(query,mapping,resp=True)
    if resp:
        return jsonify(resp)
    return jsonify(list())

@app.route("/api/posts/<post_id>", methods=["GET"])
def get_post(post_id):
    query = "SELECT post_id, title, content, user_name FROM post WHERE post_id = %(post_id)s"
    mapping = {"post_id": post_id}
    resp = db_query(query, mapping, resp=True)
    if resp:
        dpost = {"post_id": resp[0][0], "title": resp[0][1], "content": resp[0][2], "user_name": resp[0][3]}
        return dpost
    print("SQL request returned empty")
    return {"post_id": -1, "title": -1, "content": -1}

@app.route("/api/update/<post_id>", methods=["POST"])
def update_post(post_id):
    title = request.form['title']
    content = request.form['content']
    token = request.headers['Authorization'] 
    mapping = {'title': title, 'content': content, 'post_id': post_id}

    payload = decode_token(token)
    if not payload:
        return ("", 401)
    user_name = payload['sub'] 
    query = "SELECT user_name FROM post WHERE post_id=%(post_id)s"
    resp = db_query(query,mapping,resp=True)
    if not resp:
        return ("", 404)
    if resp[0][0] != user_name:
        return ("", 401)

    query = """
            UPDATE post 
            SET title=%(title)s, content=%(content)s
            WHERE post_id=%(post_id)s
            """
    db_query(query,mapping)
    return ("", 204)

@app.route("/api/delete/<post_id>", methods=["POST"])
def delete_post(post_id):
    token = request.headers['Authorization'] 
    mapping = {'post_id': post_id}

    payload = decode_token(token)
    if not payload:
        return ("", 401)
    user_name = payload['sub'] 
    query = "SELECT user_name FROM post WHERE post_id=%(post_id)s"
    resp = db_query(query,mapping,resp=True)
    if not resp:
        return ("", 404)
    if resp[0][0] != user_name:
        return ("", 401)

    query = "DELETE FROM post WHERE post_id = %(post_id)s"
    db_query(query,mapping)
    return ("", 204)

@app.route("/api/post-article", methods=['POST'])
def post_article():
    title = request.form['title']
    content = request.form['content']
    if title == "undefined":
        return ("", 401)
    if content == "undefined":
        content = ""

    token = request.headers['Authorization']
    payload = decode_token(token)
    if not payload:
        return ("", 401)
    user_name = payload['sub']

    query = "INSERT INTO post(user_name, title, content) VALUES(%(username)s, %(title)s, %(content)s)"
    mapping = {"username": user_name, "title": title, "content": content}
    db_query(query,mapping)
    return ("", 201)

@app.route("/api/register", methods=["POST"])
def register():
    username = request.form['username']
    password = request.form['password']

    salt = os.urandom(50)
    passhash = hashlib.pbkdf2_hmac('sha256', password.encode(), salt, 100000)

    query = """
            INSERT INTO users VALUES(%(username)s, %(passwordhash)s, %(salt)s)
            """
    mapping = {"username": username, "passwordhash": passhash, "salt": salt}
    resp = db_query(query,mapping)
    if resp == None:
        return ("", 201)
    # 409 = Conflit. Username in use (or some other error)
    return ("", 409)

@app.route("/api/login", methods=["POST"])
def login():
    username = request.form['username']
    password = request.form['password']
    query = """
            SELECT password, salt
            FROM users
            WHERE user_name = %(username)s
            """
    mapping = {"username": username}
    resp = db_query(query,mapping,resp=True)
    if resp:
        passhash = bytes(resp[0][0])
        salt = bytes(resp[0][1])
        submithash = hashlib.pbkdf2_hmac('sha256', password.encode(), salt, 100000) 
        if passhash == submithash:
            return (jsonify({"token": encode_token(username).decode()}), 200)
    return ("", 404)

@app.route("/api/auth", methods=['POST'])
def check_token():
    token = request.headers['Authorization']
    payload = decode_token(token)
    if payload:
        return ("", 200)
    return ("", 401)

def db_query(query,mapping,resp=False):
    try: 
        con = psycopg2.connect(app.config['CONNECTION_STRING'])
        cur = con.cursor()
        if mapping == None:
            cur.execute(query)
        else:
            cur.execute(query,mapping)
        if resp:
            return cur.fetchall()
        con.commit()
    except (Exception, psycopg2.Error) as error:
        print("Could not connect to db", error)
        return error
    finally:
        if(con):
            cur.close()
            con.close()

def encode_token(user_id):
    payload = {
        "exp": datetime.datetime.utcnow() + datetime.timedelta(weeks=1),
        "iat": datetime.datetime.utcnow(),
        "sub": user_id
    }
    return jwt.encode(
        payload,
        app.config['JWT_KEY'],
        algorithm="HS256"
    )

def decode_token(token):
    try:
        #payload = jwt.decode(token, "abc")
        payload = jwt.decode(token, app.config['JWT_KEY'])
        return payload
    except jwt.ExpiredSignatureError:
        return False
    except jwt.InvalidTokenError:
        return False


if __name__ == "__main__":
    app.run(debug=True)