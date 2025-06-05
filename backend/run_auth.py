import uvicorn
from src.auth.config import settings

if __name__ == "__main__":
    print(f"Iniciando {settings.PROJECT_NAME}...")
    print(f"Servidor rodando em: http://{settings.AUTH_HOST}:{settings.AUTH_PORT}")
    print(f"Documentação disponível em: http://{settings.AUTH_HOST}:{settings.AUTH_PORT}/docs")
    
    uvicorn.run(
        "src.auth.main:app", 
        host=settings.AUTH_HOST, 
        port=settings.AUTH_PORT,
        reload=True
    ) 