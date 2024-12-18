from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .dep_container import engine, Base
from .controllers import tasks, notes, auth, search



app = FastAPI(title="Notion API",
    description="This API provides the functionality for the mini-notion app.",
    version="1.0.0",
    contact={
        "name": "Alejandro Diaz Roque",
        "url": "https://github.com/DiazRock",
        "email": "corolariodiaz@gmail.com",
    },
    license_info={
        "name": "MIT License",
        "url": "https://opensource.org/licenses/MIT",
    }
)

Base.metadata.create_all(bind=engine)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3005"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(tasks.tasks_router)
app.include_router(notes.notes_router)
app.include_router(auth.auth_router)
app.include_router(search.search_router)



