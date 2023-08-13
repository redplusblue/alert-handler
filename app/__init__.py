# app/__init__.py
from datetime import datetime
from datetime import timedelta
from flask import Flask, jsonify, render_template, request
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from flask import Flask, render_template, request
from cachetools import TTLCache
from os import environ

# Initialize the cache
email_cache = TTLCache(maxsize=100, ttl=60*60)  # Cache for 1 hour

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/contact')
def contact():
    return render_template('contact.html')

def send_email(sender_email, app_password, recipient_email, subject, body):
    msg = MIMEMultipart()
    msg["From"] = sender_email
    msg["To"] = recipient_email
    msg["Subject"] = subject
    msg.attach(MIMEText(body, "plain"))

    server = smtplib.SMTP("smtp.gmail.com", 587)
    server.starttls()
    server.login(sender_email, app_password)
    server.sendmail(sender_email, recipient_email, msg.as_string())
    server.quit()
    
@app.route('/submit', methods=['POST'])
def submit_alert():
    name = request.form.get('name')
    subject = request.form.get('subject')
    email = request.form.get('email')
    message = request.form.get('alert')
    
    # Check hourly email count
    current_hour = datetime.now().replace(minute=0, second=0, microsecond=0)
    email_data = email_cache.get(current_hour, {'count': 0, 'last_modified': None})
    email_count = email_data['count']
    last_modified = email_data['last_modified']
    
    if email_count >= 10:
        # Remaining time in hours until the cache expires 
        remaining_time = (last_modified + timedelta(hours=1)) - datetime.now()
        return jsonify({'status': 'exceeded', 'message': 'Hourly email limit exceeded', 'remaining_time': remaining_time.seconds})
    
    # Update email count and last modified time in cache
    email_cache[current_hour] = {'count': email_count + 1, 'last_modified': datetime.now()}
    
    # Send alert email
    sender_email = environ.get('EMAIL_USER')
    app_password = environ.get('EMAIL_PASS')
    recipient_email = environ.get('EMAIL_USER')
    email_subject = f"New Alert: {subject}"
    email_body = f"Name: {name}\nEmail: {email}\nMessage: {message}"
    # Send email to samir
    send_email(sender_email, app_password, recipient_email, email_subject, email_body)
    # Send email to user
    message = greeting(name, subject)
    send_email(sender_email, app_password, email, message["subject"], message["body"])    
    response = {'status': 'success'}
    return jsonify(response)

def greeting(name, subject):
    message = {}
    message["subject"] = f"Auto-reply: {subject}"
    message["body"] = f"Hello {name},\n\nThank you for contacting me about {subject}.\n\nI will get back to you as soon as possible.\n\nBest,\nSamir"
    return message

