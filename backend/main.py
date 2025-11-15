import json
import uuid
from fastapi import FastAPI, HTTPException, Body
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime

# Initialize FastAPI application
app = FastAPI()

# Define allowed origins for CORS (Cross-Origin Resource Sharing)
# This is crucial for allowing the frontend (running on a different port) to communicate with the backend.
origins = [
    "http://localhost",
    "http://localhost:5173", # Assuming your frontend runs on port 5173
]

# Add CORS middleware to the application
# This middleware processes CORS headers, allowing or denying cross-origin requests.
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,          # Specifies which origins are allowed to make requests.
    allow_credentials=True,         # Allows cookies to be included in cross-origin requests.
    allow_methods=["*"],            # Allows all HTTP methods (GET, POST, PUT, DELETE, etc.).
    allow_headers=["*"],            # Allows all headers in cross-origin requests.
)

# Pydantic Models: Define data structures for request and response validation.

# User model: Represents a user in the system.
class User(BaseModel):
    user_id: int
    username: str
    email: str
    password: str  # In a real application, passwords should always be hashed and never stored in plain text.
    role: str      # e.g., "participant", "admin"
    points: int    # Points earned by the user
    historique: List[Dict[str, Any]] # List of dictionaries storing participation history
    age: int
    liked_actions: List[int] = [] # List of action_ids that the user has liked

# UserCreate model: Used for creating new users (password included for registration).
class UserCreate(BaseModel):
    username: str
    email: str
    password: str
    age: int

# UserLogin model: Used for user authentication (login).
class UserLogin(BaseModel):
    email: str
    password: str

# Action model: Represents a civic action proposed by a user.
class Action(BaseModel):
    action_id: int
    proposer_id: int
    title: str
    description: str
    type: str
    impact: str
    image_url: Optional[str] = None # Optional URL for an image related to the action
    likes: int = 0                 # Number of likes an action has received
    required_participants: int = 1 # Required number of participants for the action, default to 1
    deadline: Optional[datetime] = None # Deadline for the action

# Participation model: Represents a user's participation in an action.
class Participation(BaseModel):
    participation_id: str # Unique UUID for each participation
    action_id: int
    user_id: int
    used: bool = False    # Flag to check if the participation code has been validated

# CodeValidationRequest model: Used for validating a participation code.
class CodeValidationRequest(BaseModel):
    code: str

# --- Data Storage (JSON File-based "Database") ---
# In a real application, a proper database (e.g., PostgreSQL, MongoDB) would be used.
# For this prototype, data is stored in JSON files for simplicity.

# Function to load data from a JSON file.
def load_data(filename):
    try:
        with open(filename, "r") as f:
            return json.load(f)
    except FileNotFoundError:
        # If the file doesn't exist, return an empty list to prevent errors.
        return []

# Function to save data to a JSON file.
def save_data(filename, data):
    with open(filename, "w") as f:
        json.dump(data, f, indent=4)

# Load initial data from JSON files when the application starts.
users_db = load_data("users.json")
actions_db = load_data("actions.json")
participations_db = load_data("participations.json")

# --- API Endpoints ---

# Root endpoint: A simple test endpoint.
@app.get("/")
def read_root():
    return {"Hello": "World"}

# User login endpoint: Authenticates a user.
@app.post("/login", response_model=User)
def login(user_login: UserLogin):
    # Iterate through the users database to find a matching email and password.
    for user in users_db:
        if user["email"] == user_login.email and user["password"] == user_login.password:
            return user # Return the user object if credentials are valid.
    # Raise an HTTPException if no matching user is found.
    raise HTTPException(status_code=401, detail="Invalid credentials")

# Get all users endpoint (for administrative or debugging purposes).
@app.get("/users", response_model=List[User])
def get_users():
    return users_db

# Create new user endpoint: Registers a new user in the system.
@app.post("/users", response_model=User)
def create_user(user_create: UserCreate):
    # Check if username or email already exists to prevent duplicates.
    if any(u["username"] == user_create.username or u["email"] == user_create.email for u in users_db):
        raise HTTPException(status_code=400, detail="Username or email already registered")
    
    # Generate a new user ID.
    new_user_id = max([u["user_id"] for u in users_db]) + 1 if users_db else 1
    
    # Create a new User object with default values for role, points, and historique.
    new_user = User(
        user_id=new_user_id,
        username=user_create.username,
        email=user_create.email,
        password=user_create.password,
        age=user_create.age,
        role="participant", # Default role for new users
        points=0,
        historique=[]
    )
    
    # Add the new user to the database and save the changes.
    users_db.append(new_user.dict())
    save_data("users.json", users_db)
    return new_user

# Get all actions endpoint: Retrieves a list of all proposed civic actions.
@app.get("/actions", response_model=List[Dict[str, Any]])
def get_actions():
    actions_with_proposer_names = []
    # Iterate through each action to enrich it with the proposer's username.
    for action in actions_db:
        proposer_username = "Unknown"
        # Find the username of the user who proposed the action.
        for user in users_db:
            if user["user_id"] == action["proposer_id"]:
                proposer_username = user["username"]
                break
        # Create a copy of the action and add the proposer's username.
        action_copy = action.copy()
        action_copy["proposer_username"] = proposer_username
        actions_with_proposer_names.append(action_copy)
    return actions_with_proposer_names

# Create new action endpoint: Allows a user to propose a new civic action.
@app.post("/actions", response_model=Action)
def create_action(action: Action):
    # Check if an action with the same ID already exists.
    if any(a["action_id"] == action.action_id for a in actions_db):
        raise HTTPException(status_code=400, detail="Action with this ID already exists")
    # Check if the proposer user exists.
    if not any(u["user_id"] == action.proposer_id for u in users_db):
        raise HTTPException(status_code=404, detail="Proposer user not found")

    # Add the new action to the database and save the changes.
    actions_db.append(action.dict())
    save_data("actions.json", actions_db)
    return action

# Like action endpoint: Allows a user to like an action.
@app.post("/actions/{action_id}/like", response_model=Action)
def like_action(action_id: int, user_id: int = Body(..., embed=True)):
    # Find the user
    user = None
    for u in users_db:
        if u["user_id"] == user_id:
            user = u
            break
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Check if user has already liked this action
    if action_id in user["liked_actions"]:
        raise HTTPException(status_code=400, detail="Action already liked by this user")

    # Find the action by its ID.
    for action in actions_db:
        if action["action_id"] == action_id:
            action["likes"] += 1 # Increment the likes count.
            user["liked_actions"].append(action_id) # Add action to user's liked list

            save_data("actions.json", actions_db) # Save the updated actions database.
            save_data("users.json", users_db) # Save the updated users database.
            return action # Return the updated action.
    # Raise an HTTPException if the action is not found.
    raise HTTPException(status_code=404, detail="Action not found")

# Participate in action endpoint: Generates a unique participation code for a user.
@app.post("/actions/{action_id}/participate", response_model=Participation)
def participate_in_action(action_id: int, user_id: int = Body(..., embed=True)):
    # Check if the action exists.
    if not any(a["action_id"] == action_id for a in actions_db):
        raise HTTPException(status_code=404, detail="Action not found")
    # Check if the user exists.
    if not any(u["user_id"] == user_id for u in users_db):
        raise HTTPException(status_code=404, detail="User not found")

    # Generate a unique UUID for the participation code.
    participation_id = str(uuid.uuid4())
    new_participation = Participation(
        participation_id=participation_id,
        action_id=action_id,
        user_id=user_id
    )

    # Add the new participation to the database and save the changes.
    participations_db.append(new_participation.dict())
    save_data("participations.json", participations_db)
    
    return new_participation

# Validate participation code endpoint: Validates a code and awards points to the user.
@app.post("/participations/validate", response_model=User)
def validate_participation_code(request: CodeValidationRequest):
    participation = None
    # Find the participation record by the provided code.
    for p in participations_db:
        if p["participation_id"] == request.code:
            participation = p
            break

    # Handle cases where the code is invalid or already used.
    if not participation:
        raise HTTPException(status_code=404, detail="Code de participation invalide.")
    
    if participation["used"]:
        raise HTTPException(status_code=400, detail="Ce code a déjà été utilisé.")

    # Mark the participation code as used.
    participation["used"] = True
    save_data("participations.json", participations_db)

    # Find the user and update their points and history.
    user = None
    for u in users_db:
        if u["user_id"] == participation["user_id"]:
            user = u
            break
    
    if user:
        # Find the action title to add to the user's history.
        action_title = ""
        for a in actions_db:
            if a["action_id"] == participation["action_id"]:
                action_title = a["title"]
                break

        # Find the action details
        action_details = None
        for a in actions_db:
            if a["action_id"] == participation["action_id"]:
                action_details = a
                break

        # Prepare the history entry with AI-ready features
        history_entry = {
            "action_id": participation["action_id"],
            "action_title": action_details["title"] if action_details else "Unknown Action",
            "date": datetime.now().isoformat(),
            "a_participe": 1, # Explicitly mark participation for AI
            # Add more action details for AI model
            "action_type": action_details["type"] if action_details else None,
            "action_impact": action_details["impact"] if action_details else None,
            "action_required_participants": action_details["required_participants"] if action_details else None,
            "action_deadline": action_details["deadline"].isoformat() if action_details and action_details["deadline"] else None,
            # Add more user details for AI model (snapshot at time of participation)
            "user_age_at_participation": user["age"],
            "user_role_at_participation": user["role"],
            "user_points_at_participation": user["points"], # Points before this validation
        }

        user["points"] += 10  # Award 10 points for successful validation (this will be replaced by AI score later).
        user["historique"].append(history_entry)
        save_data("users.json", users_db) # Save the updated users database.
        return user # Return the updated user object.

    # This case should ideally not be reached if participation has a valid user_id.
    raise HTTPException(status_code=404, detail="Utilisateur non trouvé.")

# Leaderboard endpoint: Returns users sorted by points in descending order.
@app.get("/leaderboard", response_model=List[User])
def get_leaderboard():
    # Sort users by their points in reverse (descending) order.
    sorted_users = sorted(users_db, key=lambda u: u['points'], reverse=True)
    return sorted_users

# Chatbot models
class ChatbotQuery(BaseModel):
    message: str

class ChatbotResponse(BaseModel):
    response: str

# Chatbot endpoint: Placeholder for AI chatbot interaction.
@app.post("/chatbot", response_model=ChatbotResponse)
def chatbot_response(query: ChatbotQuery):
    # This is a placeholder. In a real implementation, this would call an AI model.
    user_message = query.message.lower()
    if "bonjour" in user_message:
        response_message = "Bonjour ! Comment puis-je vous aider aujourd'hui ?"
    elif "aide" in user_message or "question" in user_message:
        response_message = "Je suis là pour répondre à vos questions sur l'application CIVIC. N'hésitez pas !"
    elif "points" in user_message:
        response_message = "Les points sont gagnés en participant à des actions et en validant votre code de participation."
    elif "action" in user_message:
        response_message = "Vous pouvez proposer une action via le formulaire dédié ou participer à une action existante."
    else:
        response_message = "Je n'ai pas compris votre question. Pouvez-vous reformuler ?"
    
    return ChatbotResponse(response=response_message)