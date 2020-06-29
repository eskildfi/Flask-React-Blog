from flask import Flask, request, render_template, url_for, jsonify
from flask_cors import CORS
import psycopg2 

app = Flask(__name__)
app.config.from_object('config.Config')
CORS(app)


@app.route("/")
def index():
    query = "SELECT post_id, title FROM post ORDER BY post_id"
    resp = db_query(query, None, resp=True)
    if resp:
        return jsonify(resp)
    print("No sql post data")
    return jsonify(list())

@app.route("/posts/<post_id>", methods=["GET"])
def get_post(post_id):
    query = "SELECT post_id, title, content FROM post WHERE post_id = %(post_id)s"
    mapping = {"post_id": post_id}
    resp = db_query(query, mapping, resp=True)
    if resp:
        dpost = {"post_id": resp[0][0], "title": resp[0][1], "content": resp[0][2]}
        return dpost
    print("SQL request returned empty")
    return {"post_id": -1, "title": -1, "content": -1}

@app.route("/update/<post_id>", methods=["POST"])
def update_post(post_id):
    title = request.form['title']
    content = request.form['content']
    query = """
            UPDATE post 
            SET title=%(title)s, content=%(content)s
            WHERE post_id=%(post_id)s
            """
    mapping = {'title': title, 'content': content, 'post_id': post_id}
    db_query(query,mapping)
    return ("", 204)


@app.route("/post-article", methods=['POST'])
def post_article():
    title = request.form['title']
    content = request.form['content']
    query = "INSERT INTO post(title, content) VALUES(%(title)s, %(content)s);"
    mapping = {"title": title, "content": content}
    print(f"Title {title} \n Content {title}")
    db_query(query,mapping)
    #return md.markdown(request.form['msg'])
    #return render_template(f"Title {request.form.title} \n Content {request.form.content}")
    return ("", 204)

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
    finally:
        if(con):
            cur.close()
            con.close()