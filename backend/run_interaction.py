import uvicorn
from src.interaction.config import settings

if __name__ == "__main__":
    print(f"Iniciando {settings.PROJECT_NAME}...")
    print(f"Servidor rodando em: http://{settings.INTERACTION_HOST}:{settings.INTERACTION_PORT}")
    print(f"Documentação disponível em: http://{settings.INTERACTION_HOST}:{settings.INTERACTION_PORT}/docs")
    
    uvicorn.run(
        "src.interaction.main:app", 
        host=settings.INTERACTION_HOST, 
        port=settings.INTERACTION_PORT,
        reload=True
    ) 