# app.py
from flask import Flask, render_template
from flask_socketio import SocketIO

app = Flask(__name__)
socketio = SocketIO(app)

# Route to serve the main page
@app.route('/')
def index():
    return render_template('index.html')

# SocketIO handler for receiving location updates from the client
@socketio.on('location_update')
def handle_location_update(data):
    # Print the received location data to the console (optional)
    print(f"Location received: {data}")
    
    # Broadcast the location to all other connected clients
    # (so other users can see this user's location)
    socketio.emit('location_update', data)

if __name__ == '__main__':
    # Run the Flask application with SocketIO support
    socketio.run(app, debug=True)
