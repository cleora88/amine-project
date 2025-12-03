"""AI Service using Ollama for medical triage analysis"""
import ollama
import logging
from typing import Dict, Any, List, Optional

logger = logging.getLogger(__name__)

class AIService:
    """Ollama-powered AI service for medical analysis"""
    
    def __init__(self, model: str = "llama3.2"):
        """
        Initialize AI service with Ollama
        
        Args:
            model: Ollama model to use (default: llama3.2)
        """
        self.model = model
        self.system_prompt = """You are a professional medical triage assistant. 
Your role is to analyze patient symptoms and provide:
1. Urgency level (CRITICAL, HIGH, MODERATE, LOW, MINIMAL)
2. Confidence score (0.0-1.0)
3. Medical advice
4. Detected symptoms list

Be professional, accurate, and prioritize patient safety. 
When in doubt, recommend seeking immediate medical attention.
"""
        logger.info(f"AIService initialized with model: {model}")
    
    def analyze_symptoms(self, symptoms: str, age: Optional[int] = None, 
                        allergies: Optional[str] = None) -> Dict[str, Any]:
        """
        Analyze patient symptoms using Ollama
        
        Args:
            symptoms: Patient symptom description
            age: Patient age (optional)
            allergies: Known allergies (optional)
            
        Returns:
            Dict with urgency_level, confidence, advice, detected_symptoms
        """
        try:
            # Build context
            context = f"Symptoms: {symptoms}"
            if age:
                context += f"\nAge: {age} years"
            if allergies:
                context += f"\nAllergies: {allergies}"
            
            # Prompt for structured output
            prompt = f"""{context}

Based on the above symptoms, provide a medical triage assessment in the following JSON format:
{{
    "urgency_level": "CRITICAL/HIGH/MODERATE/LOW/MINIMAL",
    "confidence": 0.0-1.0,
    "advice": "detailed medical advice",
    "detected_symptoms": ["symptom1", "symptom2", ...]
}}

Respond ONLY with valid JSON, no additional text."""

            # Call Ollama
            response = ollama.chat(
                model=self.model,
                messages=[
                    {'role': 'system', 'content': self.system_prompt},
                    {'role': 'user', 'content': prompt}
                ]
            )
            
            # Parse response
            response_text = response['message']['content'].strip()
            
            # Extract JSON from response (handle markdown code blocks)
            if '```json' in response_text:
                response_text = response_text.split('```json')[1].split('```')[0].strip()
            elif '```' in response_text:
                response_text = response_text.split('```')[1].split('```')[0].strip()
            
            import json
            result = json.loads(response_text)
            
            logger.info(f"AI analysis complete: {result['urgency_level']}, confidence: {result['confidence']}")
            return result
            
        except Exception as e:
            logger.error(f"AI analysis failed: {e}")
            # Fallback to safe default
            return {
                "urgency_level": "MODERATE",
                "confidence": 0.5,
                "advice": "Unable to analyze symptoms with AI. Please consult a healthcare professional for proper evaluation.",
                "detected_symptoms": [symptoms[:50]]
            }
    
    def chat(self, message: str, context: Optional[List[Dict[str, str]]] = None) -> str:
        """
        Chat with AI assistant about medical questions
        
        Args:
            message: User question
            context: Previous conversation history
            
        Returns:
            AI response string
        """
        try:
            messages = [{'role': 'system', 'content': self.system_prompt}]
            
            if context:
                messages.extend(context)
            
            messages.append({'role': 'user', 'content': message})
            
            response = ollama.chat(
                model=self.model,
                messages=messages
            )
            
            return response['message']['content']
            
        except Exception as e:
            logger.error(f"Chat failed: {e}")
            return "I'm having trouble processing your question. Please try again or consult a healthcare professional."
    
    def check_model_available(self) -> bool:
        """Check if the Ollama model is available"""
        try:
            ollama.list()
            return True
        except Exception as e:
            logger.warning(f"Ollama not available: {e}")
            return False
