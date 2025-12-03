"""Setup script to initialize Neo4j with medical knowledge graph"""
from graph_db_service import GraphDBService
import time
import sys

def wait_for_neo4j(max_attempts=10, password="password"):
    """Wait for Neo4j to be ready"""
    print("Waiting for Neo4j to be ready...")
    print(f"Trying with password: {password}")
    
    for attempt in range(max_attempts):
        try:
            service = GraphDBService(password=password)
            if service.driver:
                # Try a simple query
                with service.driver.session() as session:
                    session.run("RETURN 1")
                print("✓ Neo4j is ready!")
                return service
        except Exception as e:
            if attempt < max_attempts - 1:
                print(f"Attempt {attempt + 1}/{max_attempts}: Not ready yet, waiting...")
                time.sleep(2)
            else:
                print(f"✗ Failed to connect to Neo4j after {max_attempts} attempts")
                print(f"Error: {e}")
                return None
    return None

def setup_medical_graph():
    """Initialize the medical knowledge graph"""
    print("\n" + "="*70)
    print("NEO4J MEDICAL KNOWLEDGE GRAPH SETUP")
    print("="*70)
    
    # Try common passwords
    passwords = ["neo4j", "password", "admin", "neo4j123"]
    service = None
    
    print("\nTrying to connect with common passwords...")
    for pwd in passwords:
        print(f"Attempting password: {pwd}")
        service = wait_for_neo4j(max_attempts=2, password=pwd)
        if service:
            print(f"✓ Connected successfully with password: {pwd}")
            break
        print(f"✗ Failed with password: {pwd}\n")
    
    if not service or not service.driver:
        print("\n✗ Could not connect to Neo4j")
        print("\nPlease ensure:")
        print("1. Neo4j Desktop is running")
        print("2. Create a new database with:")
        print("   - Name: medical-triage")
        print("   - Password: password")
        print("   - Start the database")
        print("3. Re-run this script")
        return False
    
    print("\n" + "-"*70)
    print("Initializing medical knowledge graph...")
    print("-"*70)
    
    try:
        # Force initialization
        service._initialize_medical_graph()
        
        print("\n✓ Medical knowledge graph initialized successfully!")
        print("\nGraph Statistics:")
        
        with service.driver.session() as session:
            # Count diseases
            result = session.run("MATCH (d:Disease) RETURN count(d) as count")
            disease_count = result.single()["count"]
            print(f"  • Diseases: {disease_count}")
            
            # Count symptoms
            result = session.run("MATCH (s:Symptom) RETURN count(s) as count")
            symptom_count = result.single()["count"]
            print(f"  • Symptoms: {symptom_count}")
            
            # Count relationships
            result = session.run("MATCH ()-[r:INDICATES]->() RETURN count(r) as count")
            rel_count = result.single()["count"]
            print(f"  • Symptom-Disease Relationships: {rel_count}")
        
        print("\n" + "="*70)
        print("Setup Complete! Neo4j is ready to use.")
        print("="*70)
        
        return True
        
    except Exception as e:
        print(f"\n✗ Error during initialization: {e}")
        import traceback
        traceback.print_exc()
        return False
    finally:
        if service.driver:
            service.close()

if __name__ == "__main__":
    success = setup_medical_graph()
    sys.exit(0 if success else 1)
