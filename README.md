# AgroVision AI

An intelligent farm management platform powered by AI, providing real-time weather insights, soil diagnostics, crop recommendations, smart irrigation planning, and precision fertilizer prescriptions for farmers in India.

## 🌟 Features

- **Real-time Weather Intelligence**: Hyperlocal forecasts powered by AI
- **Soil Diagnostics**: Deep nutrient & moisture analysis
- **Crop Advisory**: Climate-resilient planting recommendations
- **Smart Irrigation**: Optimized watering schedules
- **Fertilizer Plans**: Precision nutrient prescriptions
- **AI Alerts**: Real-time field notifications and insights

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/agrovision-ai.git
   cd agrovision-ai
   ```

2. **Install dependencies**
   ```bash
   # Install frontend dependencies
   npm install

   # Install backend dependencies
   cd server
   npm install
   cd ..
   ```

3. **Set up environment variables**
   ```bash
   # Copy the example environment file
   cp .env.example .env

   # Edit .env with your API keys
   # Get OpenWeather API key from: https://openweathermap.org/api
   # Get Gemini API key from: https://makersuite.google.com/app/apikey
   ```

4. **Start the development servers**
   ```bash
   # Start backend server (in one terminal)
   cd server
   npm run dev

   # Start frontend server (in another terminal)
   npm run dev
   ```

5. **Open your browser**
   ```
   http://localhost:5173
   ```

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern React with hooks
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Recharts** - Chart library
- **Lucide React** - Icon library

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **OpenWeather API** - Weather data
- **Google Gemini AI** - AI-powered insights

## 📁 Project Structure

```
agrovivision-ai/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable UI components
│   ├── context/           # React context providers
│   ├── pages/             # Page components
│   ├── services/          # API services
│   └── utils/             # Utility functions
├── server/                # Backend server
│   ├── server.js          # Express server
│   └── package.json       # Backend dependencies
├── .env.example           # Environment variables template
├── .gitignore            # Git ignore rules
├── package.json          # Frontend dependencies
├── tsconfig.json         # TypeScript configuration
├── vite.config.ts        # Vite configuration
└── README.md             # This file
```

## 🔧 API Endpoints

The backend provides the following API endpoints:

- `GET /api/health` - Health check
- `GET /api/weather` - Weather data
- `GET /api/soil` - Soil analysis
- `GET /api/crops` - Crop recommendations
- `GET /api/irrigation` - Irrigation planning
- `GET /api/fertilizer` - Fertilizer prescriptions
- `GET /api/insights` - AI alerts and insights
- `POST /api/ask` - AI chat functionality

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- OpenWeather for weather data
- Google Gemini for AI capabilities
- The farming community for inspiration

## 📞 Support

For support, email support@agrovivision.ai or join our Discord community.

---

Made with ❤️ for farmers worldwide