from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from .database import get_db
from .dependencies import get_current_user
from .schemas import NewsCreate, NewsUpdate, NewsResponse, NewsListResponse
from .service import NewsService

router = APIRouter()

@router.post("/", response_model=NewsResponse)
async def create_news(
    news: NewsCreate, 
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create news"""
    try:
        db_news = NewsService.create_news(db=db, news=news, author_id=current_user["id"])
        
        response = NewsResponse(
            id=db_news.id,
            name=db_news.name,
            content=db_news.content,
            description=db_news.description,
            image=db_news.image,
            created_at=db_news.created_at,
            author_id=db_news.author_id,
            author_username=current_user["username"]
        )
        return response
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.get("/", response_model=NewsListResponse)
async def get_news_list(
    page: int = Query(1, ge=1),
    size: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """List news with pagination"""
    skip = (page - 1) * size
    news_list, total = NewsService.get_news_list(db=db, skip=skip, limit=size)
    
    news_with_authors = []
    for news in news_list:
        author_info = await NewsService.get_user_info(news.author_id)
        response = NewsResponse(
            id=news.id,
            name=news.name,
            content=news.content,
            description=news.description,
            image=news.image,
            created_at=news.created_at,
            author_id=news.author_id,
            author_username=author_info["username"] if author_info else "Unknown"
        )
        news_with_authors.append(response)
    
    return NewsListResponse(
        news=news_with_authors,
        total=total,
        page=page,
        size=size
    )

@router.get("/{news_id}", response_model=NewsResponse)
async def get_news(news_id: int, db: Session = Depends(get_db)):
    """Get news by ID"""
    db_news = NewsService.get_news_by_id(db=db, news_id=news_id)
    if db_news is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="News not found"
        )
    
    author_info = await NewsService.get_user_info(db_news.author_id)
    
    response = NewsResponse(
        id=db_news.id,
        name=db_news.name,
        content=db_news.content,
        description=db_news.description,
        image=db_news.image,
        created_at=db_news.created_at,
        author_id=db_news.author_id,
        author_username=author_info["username"] if author_info else "Unknown"
    )
    return response

@router.put("/{news_id}", response_model=NewsResponse)
async def update_news(
    news_id: int,
    news_update: NewsUpdate,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update news (only author can update)"""
    db_news = NewsService.get_news_by_id(db=db, news_id=news_id)
    if db_news is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="News not found"
        )
    
    if db_news.author_id != current_user["id"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    updated_news = NewsService.update_news(db=db, news_id=news_id, news_update=news_update)
    
    response = NewsResponse(
        id=updated_news.id,
        name=updated_news.name,
        content=updated_news.content,
        description=updated_news.description,
        image=updated_news.image,
        created_at=updated_news.created_at,
        author_id=updated_news.author_id,
        author_username=current_user["username"]
    )
    return response

@router.delete("/{news_id}")
async def delete_news(
    news_id: int,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete news (only author can delete)"""
    db_news = NewsService.get_news_by_id(db=db, news_id=news_id)
    if db_news is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="News not found"
        )
    
    if db_news.author_id != current_user["id"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    success = NewsService.delete_news(db=db, news_id=news_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not delete news"
        )
    
    return {"message": "News deleted successfully"}

@router.get("/author/{author_id}", response_model=NewsListResponse)
async def get_news_by_author(
    author_id: int,
    page: int = Query(1, ge=1),
    size: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """Get news by author"""
    skip = (page - 1) * size
    news_list, total = NewsService.get_news_by_author(
        db=db, author_id=author_id, skip=skip, limit=size
    )
    
    author_info = await NewsService.get_user_info(author_id)
    author_username = author_info["username"] if author_info else "Unknown"
    
    news_responses = []
    for news in news_list:
        response = NewsResponse(
            id=news.id,
            name=news.name,
            content=news.content,
            description=news.description,
            image=news.image,
            created_at=news.created_at,
            author_id=news.author_id,
            author_username=author_username
        )
        news_responses.append(response)
    
    return NewsListResponse(
        news=news_responses,
        total=total,
        page=page,
        size=size
    ) 