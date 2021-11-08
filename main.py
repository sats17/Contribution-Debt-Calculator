from flask import Flask, render_template

Flask_App = Flask(__name__)


@Flask_App.route('/')
def index():
    return render_template('index.html')


if __name__ == '__main__':
    Flask_App.debug = True
    Flask_App.run()
