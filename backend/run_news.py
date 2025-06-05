import uvicorn
from src.news.config import settings

if __name__ == "__main__":
    print(f"Iniciando {settings.PROJECT_NAME}...")
    print(f"Servidor rodando em: http://{settings.NEWS_HOST}:{settings.NEWS_PORT}")
    print(f"Documentação disponível em: http://{settings.NEWS_HOST}:{settings.NEWS_PORT}/docs")
    
    uvicorn.run(
        "src.news.main:app", 
        host=settings.NEWS_HOST, 
        port=settings.NEWS_PORT,
        reload=True
    ) 