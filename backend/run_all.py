import subprocess
import sys
import time
import os

def run_service(script_name, service_name):
    print(f"Iniciando {service_name}...")
    return subprocess.Popen([sys.executable, script_name], 
                          creationflags=subprocess.CREATE_NEW_CONSOLE if os.name == 'nt' else 0)

def main():
    print("=" * 60)
    print("INICIANDO TODOS OS MICROSERVIÇOS")
    print("=" * 60)
    
    processes = []
    
    try:
        auth_process = run_service("run_auth.py", "Auth")
        processes.append(("Auth", auth_process))
        time.sleep(2)
        
        news_process = run_service("run_news.py", "News")
        processes.append(("News", news_process))
        time.sleep(1)
        
        interaction_process = run_service("run_interaction.py", "Interaction")
        processes.append(("Interaction", interaction_process))
        
        print("\n" + "=" * 60)
        print("TODOS OS MICROSERVIÇOS INICIADOS")
        print("=" * 60)
        print("Swagger dos Serviços:")
        print("   Auth:        http://localhost:8000/docs")
        print("   News:        http://localhost:8001/docs") 
        print("   Interactions: http://localhost:8002/docs")
        print("=" * 60)
        print("Para parar todos os serviços, pressione Ctrl+C")
        print("=" * 60)
        
        while True:
            time.sleep(1)
            
    except KeyboardInterrupt:
        print("\n\nParando todos os microserviços...")
        for name, process in processes:
            try:
                process.terminate()
                print(f"   {name} service parado")
            except:
                print(f"   Erro ao parar {name} service")
        print("Todos os serviços foram encerrados!")

if __name__ == "__main__":
    main() 