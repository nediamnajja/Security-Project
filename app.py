from flask import Flask, request, jsonify, render_template
from password_checker import PasswordChecker

app = Flask(__name__)
checker = PasswordChecker()

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/check', methods=['POST'])
def check():
    data = request.json
    password = data.get('password', '')
    username = data.get('username', '')
    result = checker.check_password(password, username)
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)
