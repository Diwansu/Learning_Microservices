from pydantic import BaseModel, Field, EmailStr
from typing import List

"""
Pydantic schemas (Beginner Explanation):
Pydantic validates data shapes at runtime. If data sent from Express does not
match these definitions, FastAPI will automatically return a '422 Unprocessable Entity' error.
"""

# 1. Schema for individual route options
class RouteOption(BaseModel):
    mode: str = Field(..., description="Mode of transport (e.g., Ocean, Air, Rail, Road)")
    path: str = Field(..., description="Detailed route path description")
    extra_cost: float = Field(..., description="Extra shipping cost in USD")
    time_days: float = Field(..., description="Additional transit duration in days")

# 2. Schema for incoming Express requests
class DisruptionRequest(BaseModel):
    shipmentNumber: str = Field(..., min_length=3, description="The unique shipping manifest number")
    origin: str = Field(..., description="Port of departure")
    destination: str = Field(..., description="Port of arrival")
    triggerReason: str = Field(..., description="Disruption trigger (e.g., Strike, Port Congestion)")
    carrierEmail: EmailStr = Field(..., description="Carrier email address")
    clientEmail: EmailStr = Field(..., description="Client email address for updates")

# 3. Schema for outgoing agent responses back to Express
class DisruptionResponse(BaseModel):
    triggerReason: str
    severity: str = Field(..., description="Severity level: Low, Medium, High, Critical")
    aiResearchSummary: str = Field(..., description="Researcher Agent analysis of the disruption cause")
    alternativeRoutes: List[RouteOption] = Field(..., description="Two calculated alternative routes")
    draftedEmail: str = Field(..., description="Communicator Agent drafted email update")
