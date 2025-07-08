#!/usr/bin/env python3
"""
Simple script to generate some traffic for testing the monitoring setup.
"""

import requests
import time
import random
import json

API_BASE_URL = "http://localhost:8000"

def make_requests():
    """Generate various types of requests to test monitoring."""
    
    endpoints = [
        "/",
        "/health",
        "/conference-info",
        "/talks/",
        "/talks/1",  # This might return 404, which is good for testing error metrics
        "/talks/999",  # This will likely return 404
    ]
    
    print("Starting monitoring test...")
    print("This will generate requests to test the monitoring setup.")
    print("Press Ctrl+C to stop.")
    
    try:
        while True:
            # Pick a random endpoint
            endpoint = random.choice(endpoints)
            url = f"{API_BASE_URL}{endpoint}"
            
            try:
                # Make the request
                response = requests.get(url, timeout=5)
                print(f"GET {endpoint} -> {response.status_code}")
                
                # Occasionally make a POST request to create a talk
                if random.random() < 0.1:  # 10% chance
                    talk_data = {
                        "title": f"Test Talk {random.randint(1, 1000)}",
                        "description": "This is a test talk for monitoring",
                        "speaker_name": f"Speaker {random.randint(1, 100)}",
                        "speaker_email": f"speaker{random.randint(1, 100)}@example.com",
                        "duration": random.choice([30, 45, 60])
                    }
                    
                    try:
                        post_response = requests.post(
                            f"{API_BASE_URL}/talks/",
                            json=talk_data,
                            timeout=5
                        )
                        print(f"POST /talks/ -> {post_response.status_code}")
                    except requests.exceptions.RequestException as e:
                        print(f"POST /talks/ -> Error: {e}")
                
            except requests.exceptions.RequestException as e:
                print(f"GET {endpoint} -> Error: {e}")
            
            # Wait between requests
            time.sleep(random.uniform(0.5, 2.0))
            
    except KeyboardInterrupt:
        print("\nStopping monitoring test.")

if __name__ == "__main__":
    make_requests()