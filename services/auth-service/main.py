from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
import os

app = FastAPI(title="WiseMed Auth Service", version="0.1.0")

# Placeholder for Keycloak configuration
KEYCLOAK_URL = os.getenv("KEYCLOAK_URL", "http://localhost:8080")
REALM = os.getenv("KEYCLOAK_REALM", "wisemed")
CLIENT_ID = os.getenv("KEYCLOAK_CLIENT_ID", "backend-service")

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl=f"{KEYCLOAK_URL}/realms/{REALM}/protocol/openid-connect/token"
)


async def get_current_user(token: str = Depends(oauth2_scheme)):
    # TODO: Implement actual JWT verification with Keycloak public key
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return {"username": "test_user", "token": token[:10] + "..."}


@app.get("/healthz")
async def health_check():
    return {"status": "ok", "service": "auth-service"}


@app.get("/users/me")
async def read_users_me(current_user: dict = Depends(get_current_user)):
    return current_user
