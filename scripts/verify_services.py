import requests
import time
import sys
import os

def check_health(url, service_name):
    print(f"Checking {service_name} health at {url}...")
    try:
        resp = requests.get(url, timeout=5)
        if resp.status_code == 200:
            print(f"✅ {service_name} is healthy: {resp.json()}")
            return True
        else:
            print(f"❌ {service_name} returned {resp.status_code}: {resp.text}")
            return False
    except Exception as e:
        print(f"❌ {service_name} check failed: {e}")
        return False

def test_translation(url):
    print(f"\nTesting Translation Service at {url}...")
    payload = {
        "text": "患者有高血压病史。",
        "source_lang": "zh",
        "target_lang": "en"
    }
    try:
        resp = requests.post(f"{url}/translate", json=payload, timeout=10)
        if resp.status_code == 200:
            result = resp.json()
            print(f"✅ Translation successful:")
            print(f"   Original: {result['original_text']}")
            print(f"   Translated: {result['translated_text']}")
            print(f"   Matched Terms: {result['matched_terms']}")
            return True
        else:
            print(f"❌ Translation failed {resp.status_code}: {resp.text}")
            return False
    except Exception as e:
        print(f"❌ Translation test failed: {e}")
        return False

def test_ai_inference(url):
    print(f"\nTesting AI Inference Service at {url}...")
    # Create a dummy image
    from PIL import Image
    import io
    
    # Create grayscale image (L mode) for medical model
    img = Image.new('L', (224, 224), color = 128)
    img_byte_arr = io.BytesIO()
    img.save(img_byte_arr, format='PNG')
    img_byte_arr.seek(0)
    
    files = {'file': ('test.png', img_byte_arr, 'image/png')}
    
    try:
        resp = requests.post(f"{url}/infer/lung-nodule", files=files, timeout=10)
        if resp.status_code == 200:
            result = resp.json()
            print(f"✅ AI Inference successful:")
            print(f"   Prediction: {result['prediction']}")
            print(f"   Confidence: {result['confidence']}")
            print(f"   Model Version: {result['model_version']}")
            return True
        else:
            print(f"❌ AI Inference failed {resp.status_code}: {resp.text}")
            return False
    except Exception as e:
        print(f"❌ AI Inference test failed: {e}")
        return False

if __name__ == "__main__":
    # Wait for services to be ready
    max_retries = 10
    ai_url = "http://localhost:8002"
    trans_url = "http://localhost:8004"
    
    ai_healthy = False
    trans_healthy = False
    
    for i in range(max_retries):
        if not ai_healthy:
            ai_healthy = check_health(f"{ai_url}/healthz", "AI Service")
        if not trans_healthy:
            trans_healthy = check_health(f"{trans_url}/healthz", "Translation Service")
            
        if ai_healthy and trans_healthy:
            break
        
        print(f"Waiting for services... ({i+1}/{max_retries})")
        time.sleep(5)
        
    if not (ai_healthy and trans_healthy):
        print("❌ Services failed to become healthy.")
        sys.exit(1)
        
    # Run functional tests
    trans_success = test_translation(trans_url)
    ai_success = test_ai_inference(ai_url)
    
    if trans_success and ai_success:
        print("\n✅ All verification tests passed!")
        sys.exit(0)
    else:
        print("\n❌ Some verification tests failed.")
        sys.exit(1)
