from fastapi import APIRouter, HTTPException
from schemas import DisruptionRequest, DisruptionResponse
from services.agent_service import AgentService

router = APIRouter()

@router.post("/analyze-disruption", response_model=DisruptionResponse)
async def analyze_disruption(request: DisruptionRequest):
    """
    Route that receives disruption parameters and triggers the agent simulation logic.
    """
    try:
        return await AgentService.run_disruption_analysis(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Agent simulation failed: {str(e)}")
