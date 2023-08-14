# app/__init__.py
from flask import Flask, jsonify, render_template, request, redirect
from app.utils.contact import validate_email

# app refers to the Flask object created by this file 
app = Flask(__name__)

# Redirect to https 
@app.before_request
def before_request():
    if app.env == "development":
        return
    if request.is_secure:
        return

    url = request.url.replace("http://", "https://", 1)
    code = 301
    return redirect(url, code=code)

# Route to home page
@app.route('/')
def index():
    return render_template('index.html')

# Route to contact page
@app.route('/contact')
def contact():
    return render_template('contact.html')
    
# Route to submit contact form 
@app.route('/submit', methods=['POST'])
def submit_alert():
    
    # Get form data
    name = str(request.form.get('name'))
    subject = str(request.form.get('subject'))
    email = str(request.form.get('email'))
    message = str(request.form.get('alert'))
    
    response = validate_email(name, subject, email, message)
    
    return jsonify(response)
    
# 404 Page 
@app.errorhandler(404)
def page_not_found(e): 
    return render_template('404.html'), 404