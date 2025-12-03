"""Vector Database Service using FAISS for medical knowledge"""
import faiss
import numpy as np
import pickle
import logging
from pathlib import Path
from typing import List, Dict, Tuple
from sentence_transformers import SentenceTransformer

logger = logging.getLogger(__name__)

class VectorDBService:
    """FAISS-based vector database for medical knowledge"""
    
    def __init__(self, db_path: str = "data/vector_db"):
        """
        Initialize vector database
        
        Args:
            db_path: Path to store vector database files
        """
        self.db_path = Path(db_path)
        self.db_path.mkdir(parents=True, exist_ok=True)
        
        self.index_file = self.db_path / "faiss.index"
        self.data_file = self.db_path / "data.pkl"
        
        # Initialize embedding model
        logger.info("Loading sentence transformer model...")
        self.model = SentenceTransformer('all-MiniLM-L6-v2')  # Fast, lightweight model
        self.dimension = 384  # Embedding dimension for this model
        
        # Initialize or load FAISS index
        if self.index_file.exists():
            self.load()
        else:
            self.index = faiss.IndexFlatL2(self.dimension)
            self.documents = []
            self._initialize_medical_knowledge()
        
        logger.info(f"VectorDB initialized with {self.index.ntotal} documents")
    
    def _initialize_medical_knowledge(self):
        """Initialize with basic medical knowledge"""
        medical_knowledge = [
            {
                "text": "Fever above 103°F (39.4°C) in adults or 100.4°F in infants under 3 months requires immediate medical attention",
                "category": "fever",
                "urgency": "HIGH"
            },
            {
                "text": "Chest pain with shortness of breath, sweating, or pain radiating to arm/jaw may indicate heart attack - seek emergency care",
                "category": "cardiac",
                "urgency": "CRITICAL"
            },
            {
                "text": "Severe headache with confusion, vision changes, or difficulty speaking may indicate stroke - call emergency services",
                "category": "neurological",
                "urgency": "CRITICAL"
            },
            {
                "text": "Difficulty breathing, wheezing, or inability to speak in full sentences requires urgent evaluation",
                "category": "respiratory",
                "urgency": "HIGH"
            },
            {
                "text": "Severe abdominal pain with fever, vomiting, or inability to pass gas may indicate serious condition",
                "category": "gastrointestinal",
                "urgency": "HIGH"
            },
            {
                "text": "Common cold symptoms: runny nose, sore throat, mild cough - usually self-limiting, rest and fluids recommended",
                "category": "respiratory",
                "urgency": "LOW"
            },
            {
                "text": "Mild headache without other symptoms can be treated with over-the-counter pain relievers and rest",
                "category": "pain",
                "urgency": "MINIMAL"
            },
            {
                "text": "Allergic reaction with swelling of face, tongue, or difficulty breathing is life-threatening - use EpiPen if available and call 911",
                "category": "allergic",
                "urgency": "CRITICAL"
            },
            {
                "text": "Dehydration symptoms: extreme thirst, dark urine, dizziness - increase fluid intake, seek care if severe",
                "category": "general",
                "urgency": "MODERATE"
            },
            {
                "text": "Persistent vomiting or diarrhea for more than 24 hours, especially with blood, requires medical evaluation",
                "category": "gastrointestinal",
                "urgency": "MODERATE"
            }
        ]
        
        for doc in medical_knowledge:
            self.add_document(doc["text"], doc)
        
        self.save()
    
    def add_document(self, text: str, metadata: Dict = None):
        """Add a document to the vector database"""
        # Generate embedding
        embedding = self.model.encode([text])[0]
        
        # Add to FAISS index
        self.index.add(np.array([embedding], dtype=np.float32))
        
        # Store document with metadata
        self.documents.append({
            "text": text,
            "metadata": metadata or {}
        })
    
    def search(self, query: str, k: int = 3) -> List[Tuple[Dict, float]]:
        """
        Search for similar documents
        
        Args:
            query: Search query
            k: Number of results to return
            
        Returns:
            List of (document, similarity_score) tuples
        """
        if self.index.ntotal == 0:
            return []
        
        # Generate query embedding
        query_embedding = self.model.encode([query])[0]
        
        # Search FAISS index
        distances, indices = self.index.search(
            np.array([query_embedding], dtype=np.float32), 
            min(k, self.index.ntotal)
        )
        
        # Return documents with scores
        results = []
        for idx, dist in zip(indices[0], distances[0]):
            if idx < len(self.documents):
                results.append((self.documents[idx], float(dist)))
        
        return results
    
    def get_relevant_knowledge(self, symptoms: str, k: int = 3) -> List[Dict]:
        """Get relevant medical knowledge for given symptoms"""
        results = self.search(symptoms, k)
        return [doc for doc, score in results]
    
    def save(self):
        """Save index and documents to disk"""
        try:
            faiss.write_index(self.index, str(self.index_file))
            with open(self.data_file, 'wb') as f:
                pickle.dump(self.documents, f)
            logger.info("Vector database saved successfully")
        except Exception as e:
            logger.error(f"Failed to save vector database: {e}")
    
    def load(self):
        """Load index and documents from disk"""
        try:
            self.index = faiss.read_index(str(self.index_file))
            with open(self.data_file, 'rb') as f:
                self.documents = pickle.load(f)
            logger.info(f"Vector database loaded: {self.index.ntotal} documents")
        except Exception as e:
            logger.error(f"Failed to load vector database: {e}")
            self.index = faiss.IndexFlatL2(self.dimension)
            self.documents = []
