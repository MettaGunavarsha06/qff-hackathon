import requests
import json

def test_api():
    base = "http://127.0.0.1:8000"
    use_test_client = False
    try:
        r = requests.get(f"{base}/api/health", timeout=0.5)
        h = r.json()
    except Exception:
        from fastapi.testclient import TestClient
        from main import app
        tc = TestClient(app)
        use_test_client = True
        h = tc.get("/api/health").json()

    def do_post(url_path, json_data):
        if use_test_client:
            return tc.post(url_path, json=json_data)
        return requests.post(f"{base}{url_path}", json=json_data)
    print("=== /api/health ===")
    print(json.dumps(h, indent=2))
    
    # 2. Quantum Optimize (Small 3-stop request)
    payload_small = {
        "depot": {"id": "DEPOT", "lat": 12.9279, "lng": 77.6271},
        "vehicles": [
            {"id": "V1", "capacity": 100.0, "fuel_efficiency": 12.0, "fuel_type": "electric"},
            {"id": "V2", "capacity": 100.0, "fuel_efficiency": 12.0, "fuel_type": "diesel"}
        ],
        "deliveries": [
            {"id": "D1", "lat": 12.9716, "lng": 77.6412, "demand": 20.0},
            {"id": "D2", "lat": 12.9121, "lng": 77.6446, "demand": 25.0},
            {"id": "D3", "lat": 12.9756, "lng": 77.6066, "demand": 15.0}
        ],
        "optimization_method": "qiskit",
        "traffic_level": "medium"
    }
    
    print("\n=== POST /api/quantum/optimize (3 stops) ===")
    r_q = do_post("/api/quantum/optimize", payload_small)
    print("Status:", r_q.status_code)
    data_q = r_q.json()
    print("Solver:", data_q.get("solver"))
    print("Quantum Circuit Info:")
    q_info = data_q.get("quantum_circuit_info")
    if q_info:
        for k, v in q_info.items():
            if k == "circuit_diagram":
                print("  circuit_diagram: [ASCII/Unicode Qiskit Circuit Diagram]")
                try:
                    # Encode/decode to handle non-unicode terminals safely
                    lines = str(v).split("\n")[:8]
                    print("\n".join(lines).encode('ascii', errors='replace').decode('ascii'))
                except Exception:
                    pass
            else:
                print(f"  {k}: {v}")
    
    print("\nRoutes:")
    for r in data_q.get("routes", []):
        print(f"  Vehicle {r.get('vehicle_id')}: stops={r.get('stops')}, dist={r.get('distance_km')}km, time={r.get('travel_time_minutes')}m")

    # 3. Quantum Optimize (Large 25 stops -> expected size limit error)
    payload_large = {
        "depot": {"id": "DEPOT", "lat": 12.9279, "lng": 77.6271},
        "vehicles": [
            {"id": "V1", "capacity": 100.0, "fuel_efficiency": 12.0, "fuel_type": "electric"}
        ],
        "deliveries": [
            {"id": f"D{i}", "lat": 12.90 + i*0.01, "lng": 77.60 + i*0.01, "demand": 5.0}
            for i in range(15)
        ],
        "optimization_method": "qiskit",
        "allow_classical_fallback": True,
        "allow_non_traffic_fallback": True
    }
    print("\n=== POST /api/quantum/optimize (15 stops -> strict size limit check) ===")
    r_large = do_post("/api/quantum/optimize", payload_large)
    print("Status:", r_large.status_code)
    print("Response detail:", r_large.json().get("detail"))

    print("\n=== POST /api/optimize (15 stops with method='qiskit' -> explicit classical fallback) ===")
    r_fallback = do_post("/api/optimize", payload_large)
    print("Status:", r_fallback.status_code)
    fb_data = r_fallback.json()
    print("Method:", fb_data.get("method"))
    print("Solver Name:", fb_data.get("solver", {}).get("name"))
    print("Solver Notes:", fb_data.get("solver", {}).get("notes"))
    print("Routes:", len(fb_data.get("routes", [])))

    # 4. Compare Solvers
    print("\n=== POST /api/compare ===")
    r_comp = do_post("/api/compare", payload_small)
    print("Status:", r_comp.status_code)
    comp_data = r_comp.json()
    print("Classical total distance:", comp_data.get("classical", {}).get("total_distance_km"))
    print("Qiskit total distance:", comp_data.get("qiskit", {}).get("total_distance_km") if comp_data.get("qiskit") else None)
    print("Improvements:", comp_data.get("improvements"))

if __name__ == "__main__":
    test_api()
