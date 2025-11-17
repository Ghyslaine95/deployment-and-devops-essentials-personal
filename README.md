Socket.io Real-Time Chat Application
🚀 Live Demo
Frontend: https://deployment-and-devops-essentials-pe.vercel.app/

Backend: https://socketio-chat-server-cb6e.onrender.com

Health Check: https://socketio-chat-server-cb6e.onrender.com/health

✨ Features
🔥 Real-time messaging with Socket.IO

👥 Multiple chat rooms (General, Random, Tech)

👤 User presence with join/leave notifications

📊 Live participant counts per room

⚡ Instant message delivery

🎨 Responsive design

🔒 User authentication with usernames

📱 Mobile-friendly interface

🏢 Room switching without page reload

📁 Project Structure
text
real-time-communication-with-socket-io-Ghyslaine95/
│
├── client/                          # React frontend
│   ├── src/
│   │   ├── App.jsx                  # Main application component
│   │   ├── main.jsx                 # React entry point
│   │   └── index.css                # Global styles
│   ├── package.json                 # Frontend dependencies
│   ├── vite.config.js               # Vite configuration
│   └── dist/                        # Production build (auto-generated)
│
├── server/                          # Node.js backend
│   ├── server.js                    # Socket.IO server
│   ├── package.json                 # Backend dependencies
│   └── render.yaml                  # Render deployment config
│
├── .github/workflows/               # CI/CD pipelines
│   ├── ci.yml                       # Main CI workflow
│   └── deploy.yml                   # Deployment workflow
│
├── images/                          # Documentation assets
│   ├── chat.png                     # Chat interface screenshot
│   └── deployment.png               # Deployment screenshot
│
├── .gitignore                       # Git ignore rules
└── README.md                        # Project documentation
n

📸 Screenshots

Deployment Success
![Deploy](./images/server-deploy.png)
![Deploy](./images/client-deploy.png)
Successful deployment on Render and Vercel



📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

👥 Authors
Ghyslaine - Initial work - Ghyslaine95

🙏 Acknowledgments
Socket.IO team for excellent real-time communication library

Render and Vercel for generous free tiers

React community for comprehensive documentation

MERN stack community for best practices


