from flask import *
import sqlite3


def envoie_score(form):
    """Envoie le score et le nom d'utilisateur à la base de données"""

    connexion = sqlite3.connect("bdd/base.db")
    curseur = connexion.cursor()
    username = form["username"]
    score = int(form["score"])
    trouve_noms = """ SELECT username FROM users; """
    rep = list(curseur.execute(trouve_noms))
    usernames = [v[0] for v in rep]

    if username == "":
        username = "Anonyme"

    i = 1
    while username in usernames:
        if i == 1:
            username += "_" + str(i)
        else:
            username = username[:len(username)-1] + str(i)
        i += 1

    parametres = (username, score)
    requete_sql = """ INSERT INTO users(username,score) VALUES (?,?); """
    curseur.execute(requete_sql, parametres)
    connexion.commit()
    connexion.close()
    return True


def lire_scores():
    """Lit les scores et les utilisateurs de la base de données et tri les scores"""

    connexion = sqlite3.connect("bdd/base.db")
    curseur = connexion.cursor()
    requete_sql = """ SELECT * FROM users; """
    resultat = curseur.execute(requete_sql)
    d = resultat.fetchall()
    connexion.close()
    if len(d) < 2:
        return d
    valeurs = sorted(d, key=lambda val: val[1], reverse=True)
    return valeurs


app = Flask(__name__)


@app.route("/index.html")
def menu():
    return render_template("index.html")


@app.route("/index.html", methods=["POST"])
def menu_envoie_score():
    resultat = request.form
    envoie_score(resultat)
    return render_template("classement.html", valeurs=lire_scores())


@app.route("/classement.html")
def classement():
    return render_template("classement.html", valeurs=lire_scores())


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=1660, debug=True)
