# 🏥 Medical Triage Assistant - AI-Powered

An intelligent medical triage system powered by cutting-edge AI technologies: **Ollama LLM**, **FAISS Vector Database**, and **Neo4j Graph Database**. Built with FastAPI (Python) and React (TypeScript) for professional medical symptom analysis.

## ✨ Features

### 🤖 AI-Powered Analysis
- **Ollama LLM Integration**: Uses llama3.2 for natural language understanding of medical symptoms
- **FAISS Vector Database**: Semantic search across medical knowledge base using sentence transformers
- **Neo4j Graph Database**: Symptom-disease relationship mapping with confidence scoring
- **Multi-AI Synthesis**: Combines all three AI sources for comprehensive triage decisions

### 🚨 Smart Triage System
Three urgency levels with AI-driven confidence scoring:
  - **EMERGENCY**: Immediate medical attention required (AI confidence: 0.85-0.95)
  - **CONSULTATION**: Healthcare professional needed within 24-48h (AI confidence: 0.70-0.85)
  - **SELF-CARE**: Mild symptoms, self-care appropriate (AI confidence: 0.60-0.75)

### 💬 AI Chat Assistant
- Conversational interface powered by Ollama LLM
- Context-aware medical guidance
- Natural language understanding of patient concerns

### 📊 Advanced Features
- **Real-time Metrics Dashboard**: Performance monitoring and analytics
- **📝 Patient History Tracking**: Persistent triage history with GDPR compliance
- **🎨 Modern UI**: Dark theme with gradient accents and smooth animations
- **🔒 CORS Security**: Restricted to localhost for development safety
- **📈 Performance Monitoring**: Latency tracking, error rates, usage patterns

## 🚀 Quick Start

### Prerequisites

- **Python 3.8+** (Tested with Python 3.14)
- **Node.js 16+** (Tested with Node.js 24.11.1)
- **npm 7+** (Tested with npm 11.6.2)
- **Ollama Desktop** ([Download](https://ollama.ai)) - For local AI inference
- **Neo4j Database** ([Download](https://neo4j.com/download/) or use [Neo4j Aura](https://neo4j.com/cloud/aura-free/)) - Optional but recommended

### Installation

1. **Clone the repository**
```bash
cd "c:\Users\User\Downloads\amine project"
```

2. **Backend Setup**
```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment (PowerShell)
.\venv\Scripts\Activate.ps1

# Install dependencies (includes AI libraries)
pip install -r requirements.txt
```

3. **AI Services Setup**

**Install Ollama:**
```bash
# Download and install Ollama from https://ollama.ai
# Then pull the medical AI model:
ollama pull llama3.2
```

**Install Neo4j (Optional):**
```bash
# Option 1: Docker (recommended)
docker run -d --name neo4j -p 7474:7474 -p 7687:7687 -e NEO4J_AUTH=neo4j/password neo4j:latest

# Option 2: Download Neo4j Desktop from https://neo4j.com/download/
# Or use free Neo4j Aura cloud: https://neo4j.com/cloud/aura-free/
```

4. **Frontend Setup**
```bash
# Install Node dependencies
npm install
```

### Running the Application

**Terminal 1 - AI Services (if using local Neo4j):**
```bash
# Start Neo4j (if using Docker)
docker start neo4j

# Verify Ollama is running
ollama list
```

**Terminal 2 - Backend Server:**
```bash
# Activate virtual environment
.\venv\Scripts\Activate.ps1

# Start FastAPI server (automatically initializes AI services)
python backend_main.py
```
Backend runs on: **http://localhost:8000**  
API Documentation: **http://localhost:8000/docs**

**Terminal 3 - Frontend Server:**
```bash
# Start Vite dev server
npm run dev
```
Frontend runs on: **http://localhost:3000**

## 🤖 AI Architecture

### Three-Layer AI Integration

```
Patient Input
     ↓
┌────────────────────────────────────────┐
│      1. FAISS Vector Database          │
│   Semantic search for relevant         │
│   medical knowledge (top 3 matches)    │
└────────────────────────────────────────┘
     ↓
┌────────────────────────────────────────┐
│      2. Neo4j Graph Database           │
│   Symptom-disease relationship         │
│   mapping with confidence scores       │
└────────────────────────────────────────┘
     ↓
┌────────────────────────────────────────┐
│      3. Ollama LLM (llama3.2)         │
│   Synthesizes all inputs for final     │
│   triage decision with reasoning       │
└────────────────────────────────────────┘
     ↓
AI-Powered Triage Result
```

### Graceful Fallback System
- If Ollama unavailable: Uses graph database insights
- If Neo4j unavailable: Uses vector database + safe defaults
- System never fails - always provides safe medical guidance

## 📁 Project Structure

```
amine-project/
├── backend_main.py              # FastAPI application server
├── triage_engine.py             # AI-powered symptom analysis engine
├── ai_service.py                # Ollama LLM wrapper
├── vector_db_service.py         # FAISS vector database service
├── graph_db_service.py          # Neo4j graph database service
├── monitoring_service.py        # Performance metrics tracking
├── requirements.txt             # Python dependencies (includes AI libs)
├── package.json                 # Node.js dependencies
├── vite.config.ts               # Vite configuration
├── tsconfig.json                # TypeScript configuration
├── medical_triage_app.tsx       # Main React component
├── index.html                   # HTML entry point
├── src/
│   └── main.tsx                 # React entry point
├── data/                        # Persistent data storage
│   ├── triage_history.json      # Patient history
│   └── metrics.json             # Performance metrics
└── logs/
    └── triage.log               # Application logs
```

## 🔌 API Endpoints

### Triage
- **POST** `/triage` - Analyze symptoms and determine urgency
  ```json
  {
    "symptoms": "chest pain radiating to left arm",
    "age": 45,
    "allergies": "none"
  }
  ```

### Chat
- **POST** `/chat` - Conversational medical guidance
  ```json
  {
    "message": "What should I do about a fever?"
  }
  ```

### History
- **GET** `/history` - Retrieve patient triage history (last 50)
- **DELETE** `/history` - Clear all history (GDPR compliance)

### Monitoring
- **GET** `/metrics` - System performance metrics
- **GET** `/health` - Health check with component status

## 🤖 AI Configuration

### Ollama Setup

1. **Install Ollama**
   - Download from [https://ollama.ai](https://ollama.ai)
   - Windows: Run installer and follow prompts
   - macOS: `brew install ollama`
   - Linux: `curl https://ollama.ai/install.sh | sh`

2. **Pull Medical AI Model**
   ```bash
   ollama pull llama3.2
   ```

3. **Verify Installation**
   ```bash
   ollama list  # Should show llama3.2
   ollama run llama3.2 "Hello"  # Test the model
   ```

4. **Configuration** (in `ai_service.py`)
   ```python
   # Change model if needed
   ai_service = AIService(model="llama3.2")  # or "llama3.1", "mistral", etc.
   ```

### Neo4j Setup

**Option 1: Docker (Recommended)**
```bash
docker run -d \
  --name neo4j \
  -p 7474:7474 -p 7687:7687 \
  -e NEO4J_AUTH=neo4j/password \
  neo4j:latest

# Access Neo4j Browser at http://localhost:7474
```

**Option 2: Neo4j Desktop**
1. Download from [https://neo4j.com/download/](https://neo4j.com/download/)
2. Create a new database
3. Set password to `password` (or update `graph_db_service.py`)
4. Start the database

**Option 3: Neo4j Aura (Cloud - Free Tier)**
1. Sign up at [https://neo4j.com/cloud/aura-free/](https://neo4j.com/cloud/aura-free/)
2. Create a free instance
3. Copy connection URI and credentials
4. Update `graph_db_service.py`:
   ```python
   GraphDBService(
       uri="neo4j+s://xxxxx.databases.neo4j.io",
       user="neo4j",
       password="your-password"
   )
   ```

**Configuration** (in `triage_engine.py`)
```python
# Update Neo4j credentials if needed
self.graph_db = GraphDBService(
    uri="bolt://localhost:7687",  # Change for cloud/remote
    user="neo4j",                  # Change if different
    password="password"            # Change to your password
)
```

### FAISS Vector Database

No installation needed! FAISS is included in `requirements.txt` and automatically initialized on first run. Data is stored in `data/vector_db/`.

**Configuration** (in `vector_db_service.py`)
```python
# Change embedding model if needed
self.model = SentenceTransformer('all-MiniLM-L6-v2')  # Fast, 384-dim
# Alternatives:
# - 'all-mpnet-base-v2' (Slower, more accurate, 768-dim)
# - 'paraphrase-multilingual-MiniLM-L12-v2' (Multilingual support)
```

### Testing AI Services

**Check AI Service Status:**
```bash
# Start backend
python backend_main.py

# Check logs - should see:
# ✓ Ollama AI service initialized
# ✓ FAISS vector database initialized
# ✓ Neo4j graph database initialized
```

**Test Each Service Individually:**
```python
# Test Ollama
from ai_service import AIService
ai = AIService()
result = ai.analyze_symptoms("chest pain", age=45)
print(result)

# Test Vector DB
from vector_db_service import VectorDBService
vdb = VectorDBService()
results = vdb.get_relevant_knowledge("fever", k=3)
print(results)

# Test Neo4j
from graph_db_service import GraphDBService
gdb = GraphDBService()
diseases = gdb.find_related_diseases(["chest", "pain"])
print(diseases)
```

## 🛠️ Configuration

### Backend Configuration (`backend_main.py`)

```python
# CORS Settings (Line ~70)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Change for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Server Settings (Line ~363)
uvicorn.run(
    app, 
    host="0.0.0.0",  # Change to specific IP in production
    port=8000,
    log_level="info"
)
```

### Frontend Configuration (`vite.config.ts`)

```typescript
export default defineConfig({
  server: {
    port: 3000,  // Change frontend port here
  }
})
```

## 📊 Triage Logic

### Emergency Patterns
- Chest pain with arm radiation
- Difficulty breathing / Shortness of breath
- Neurological symptoms (slurred speech, facial droop, weakness)

### Consultation Patterns
- Fever lasting 3+ days or ≥39°C
- Infected wounds (redness, swelling, pus)

### Self-Care Patterns
- Common cold symptoms
- Mild headaches
- General fatigue

## 🧪 Testing

Run the test script:
```bash
python test_script.py
```

## 📝 Logging

Logs are written to:
- **File**: `logs/triage.log`
- **Console**: Real-time output

Log format includes:
- Timestamp
- Log level (INFO, WARNING, ERROR, CRITICAL)
- File and line number
- Message

## 🔐 Security Features

- **Input Validation**: Pydantic models with custom validators
- **CORS Restrictions**: Localhost-only in development
- **Error Handling**: Comprehensive try/catch with proper HTTP status codes
- **Logging**: Full audit trail with stack traces for errors

## 📈 Performance Monitoring

The monitoring service tracks:
- **Request Count**: Total API calls
- **Latency**: Average and recent response times
- **Error Rates**: Overall and recent error percentages
- **Urgency Distribution**: Classification statistics
- **Uptime**: System availability tracking

Access metrics at: `http://localhost:8000/metrics`

## 🚀 Production Deployment

### Environment Variables
```bash
ENV=production  # Triggers production mode in startup logs
```

### Recommended Changes
1. **Update CORS origins** to production domain
2. **Change host** from `0.0.0.0` to specific IP
3. **Enable HTTPS** with SSL certificates
4. **Use production ASGI server** (Gunicorn + Uvicorn workers)
5. **Set up database** for history (replace JSON files)
6. **Configure log rotation** for production logs
7. **Add authentication** for sensitive endpoints

### Production Command
```bash
gunicorn backend_main:app \
  --workers 4 \
  --worker-class uvicorn.workers.UvicornWorker \
  --bind 0.0.0.0:8000 \
  --log-level info \
  --access-logfile logs/access.log \
  --error-logfile logs/error.log
```

## 📦 Dependencies

### Backend
- **FastAPI**: Modern web framework
- **Uvicorn**: ASGI server
- **Pydantic**: Data validation
- **Requests**: HTTP library

### Frontend
- **React 18.3.1**: UI framework
- **TypeScript 5.5.3**: Type safety
- **Vite 5.4.21**: Build tool
- **Lucide React**: Icons

## 🐛 Troubleshooting

### Backend won't start
- Ensure virtual environment is activated
- Check port 8000 is not in use: `netstat -ano | findstr :8000`
- Verify Python version: `python --version`

### Frontend won't start
- Clear node_modules and reinstall: `rm -r node_modules; npm install`
- Check port 3000 is available
- Verify Node version: `node --version`

### API calls fail
- Check backend is running on port 8000
- Verify CORS settings allow frontend origin
- Check browser console for detailed errors

## 📄 License

This project is provided as-is for educational and development purposes.

## 👥 Contributing

Contributions welcome! Please ensure:
- Code follows existing style (type hints, docstrings)
- All tests pass
- New features include documentation
- Commit messages are descriptive

## 🔗 Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

**Built with ❤️ for better healthcare triage**
