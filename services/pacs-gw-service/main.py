from fastapi import FastAPI

app = FastAPI(title="PACS GW Service", version="0.1.0")


@app.get("/healthz")
def health():
    return {"status": "ok"}


@app.get("/hello")
def hello(site_id: str = "demo"):
    return {"message": f"Hello from PACS gateway at {site_id}"}
