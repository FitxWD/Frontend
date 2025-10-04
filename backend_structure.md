# Backend API Structure for Different Plan Types

## 1. Voice Assistant Endpoint (`/api/v1/assistant`)

Update your voice assistant endpoint to handle different plan types:

```python
from fastapi import FastAPI, File, UploadFile, Form
from typing import Optional
import openai

app = FastAPI()

# Define different conversation flows
DIET_PROMPTS = {
    "initial": """You are a professional nutrition coach. Ask targeted questions about:
    1. Current eating habits and lifestyle
    2. Dietary restrictions and allergies
    3. Weight and health goals
    4. Food preferences and dislikes
    5. Meal timing and preparation constraints
    6. Budget considerations for food
    
    Keep questions conversational and ask one at a time.""",
    
    "follow_up": """Based on the user's response, ask relevant follow-up questions about their nutrition goals. 
    Focus on gathering specific information needed to create a personalized diet plan."""
}

FITNESS_PROMPTS = {
    "initial": """You are a professional fitness coach. Ask targeted questions about:
    1. Current fitness level and exercise history
    2. Fitness goals (strength, endurance, weight loss, etc.)
    3. Available time and equipment
    4. Physical limitations or injuries
    5. Exercise preferences and dislikes
    6. Workout schedule preferences
    
    Keep questions conversational and ask one at a time.""",
    
    "follow_up": """Based on the user's response, ask relevant follow-up questions about their fitness goals.
    Focus on gathering specific information needed to create a personalized workout plan."""
}

@app.post("/api/v1/assistant")
async def voice_assistant(
    file: UploadFile = File(...),
    planType: Optional[str] = Form(None)
):
    try:
        # Convert audio to text (your existing STT logic)
        user_text = await speech_to_text(file)
        
        # Get conversation context (your existing logic)
        conversation_history = get_conversation_history(user_id)
        
        # Choose appropriate prompts based on plan type
        if planType == "diet":
            system_prompt = DIET_PROMPTS["initial"]
            context_prompt = DIET_PROMPTS["follow_up"]
        elif planType == "fitness":
            system_prompt = FITNESS_PROMPTS["initial"]
            context_prompt = FITNESS_PROMPTS["follow_up"]
        else:
            system_prompt = "You are a wellness coach. Ask about both fitness and nutrition goals."
            context_prompt = "Ask follow-up questions about wellness goals."
        
        # Generate AI response with plan-specific context
        ai_response = await generate_ai_response(
            user_text=user_text,
            conversation_history=conversation_history,
            system_prompt=system_prompt,
            context_prompt=context_prompt,
            plan_type=planType
        )
        
        # Convert response to speech
        audio_base64 = await text_to_speech(ai_response)
        
        return {
            "user_text": user_text,
            "reply": ai_response,
            "audio_base64": audio_base64,
            "plan_type": planType
        }
        
    except Exception as e:
        return {"error": str(e)}

async def generate_ai_response(user_text, conversation_history, system_prompt, context_prompt, plan_type):
    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "system", "content": f"Plan Type: {plan_type}"},
        {"role": "system", "content": context_prompt}
    ]
    
    # Add conversation history
    for entry in conversation_history[-5:]:  # Last 5 exchanges
        messages.append({"role": "user", "content": entry["user_text"]})
        messages.append({"role": "assistant", "content": entry["assistant_reply"]})
    
    # Add current user input
    messages.append({"role": "user", "content": user_text})
    
    response = await openai.ChatCompletion.acreate(
        model="gpt-4",
        messages=messages,
        max_tokens=200,
        temperature=0.7
    )
    
    return response.choices[0].message.content
```

## 2. Form-based Plan Generation (`/api/v1/generate-plan`)

```python
@app.post("/api/v1/generate-plan")
async def generate_plan(request: dict):
    plan_type = request.get("planType")
    form_data = request.get("formData")
    method = request.get("method", "form")
    
    try:
        if plan_type == "diet":
            plan = await generate_diet_plan(form_data)
        elif plan_type == "fitness":
            plan = await generate_fitness_plan(form_data)
        else:
            return {"error": "Invalid plan type"}
        
        # Save plan to database
        plan_id = await save_plan_to_db(plan, plan_type, method)
        
        return {
            "success": True,
            "plan_id": plan_id,
            "plan": plan,
            "plan_type": plan_type
        }
        
    except Exception as e:
        return {"error": str(e)}

async def generate_diet_plan(form_data):
    # Extract diet-specific data
    goal = form_data.get("goal")
    current_weight = form_data.get("currentWeight")
    target_weight = form_data.get("targetWeight")
    height = form_data.get("height")
    activity_level = form_data.get("activityLevel")
    dietary_restrictions = form_data.get("dietaryRestrictions")
    meal_preferences = form_data.get("mealPreferences")
    cooking_time = form_data.get("cookingTime")
    
    # Calculate BMR and daily calories
    bmr = calculate_bmr(current_weight, height, activity_level)
    daily_calories = adjust_calories_for_goal(bmr, goal, current_weight, target_weight)
    
    # Generate meal plan using AI
    diet_prompt = f\"\"\"
    Create a personalized diet plan with these parameters:
    - Goal: {goal}
    - Current weight: {current_weight}kg, Target: {target_weight}kg
    - Height: {height}cm
    - Activity level: {activity_level}
    - Daily calorie target: {daily_calories}
    - Dietary restrictions: {dietary_restrictions}
    - Preferred meals per day: {meal_preferences}
    - Available cooking time: {cooking_time}
    
    Provide:
    1. Weekly meal plan with recipes
    2. Shopping list
    3. Macro breakdown
    4. Portion sizes
    5. Meal prep tips
    \"\"\"
    
    # Use AI to generate detailed plan
    plan = await generate_ai_plan(diet_prompt)
    return plan

async def generate_fitness_plan(form_data):
    # Extract fitness-specific data
    goal = form_data.get("goal")
    fitness_level = form_data.get("currentFitnessLevel")
    workout_frequency = form_data.get("workoutFrequency")
    workout_duration = form_data.get("workoutDuration")
    equipment = form_data.get("equipment", [])
    injuries = form_data.get("injuries")
    experience = form_data.get("experience", [])
    
    # Generate workout plan using AI
    fitness_prompt = f\"\"\"
    Create a personalized fitness plan with these parameters:
    - Primary goal: {goal}
    - Fitness level: {fitness_level}
    - Workout frequency: {workout_frequency}
    - Session duration: {workout_duration}
    - Available equipment: {', '.join(equipment)}
    - Injuries/limitations: {injuries}
    - Exercise experience: {', '.join(experience)}
    
    Provide:
    1. Weekly workout schedule
    2. Detailed exercise descriptions
    3. Sets, reps, and progression plan
    4. Warm-up and cool-down routines
    5. Alternative exercises for equipment limitations
    6. Progress tracking methods
    \"\"\"
    
    # Use AI to generate detailed plan
    plan = await generate_ai_plan(fitness_prompt)
    return plan
```

## 3. Database Models

```python
from sqlalchemy import Column, Integer, String, Text, DateTime, JSON
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Plan(Base):
    __tablename__ = "plans"
    
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, nullable=False)
    plan_type = Column(String(50))  # 'diet' or 'fitness'
    method = Column(String(50))     # 'voice' or 'form'
    form_data = Column(JSON)        # Store form responses
    generated_plan = Column(Text)   # AI-generated plan
    created_at = Column(DateTime)
    updated_at = Column(DateTime)

class Conversation(Base):
    __tablename__ = "conversations"
    
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, nullable=False)
    plan_type = Column(String(50))
    user_text = Column(Text)
    assistant_reply = Column(Text)
    created_at = Column(DateTime)
```

## Key Benefits of This Structure:

1. **Separate Question Flows**: Diet and fitness have completely different questions
2. **AI Context Awareness**: The AI knows what type of plan it's creating
3. **Flexible Data Storage**: Form responses are stored as JSON for flexibility
4. **Conversation Tracking**: Voice conversations are tracked with plan type context
5. **Scalable**: Easy to add new plan types (e.g., mental health, sleep)

Would you like me to help you implement any specific part of this backend structure?
