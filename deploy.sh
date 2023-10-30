# start the react app
cd client && npm run build && cd ..

# Run our flask server
source venv/bin/activate && python3 app.py
