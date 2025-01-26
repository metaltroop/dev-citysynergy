# models.py

from pydantic import BaseModel
from typing import List
from typing import Dict

class PincodeRequest(BaseModel):
    pincode: str

class ClashDetails(BaseModel):
    tender_id: str
    clashing_tender_id: str
    department: str
    clashing_department: str
    tender_start_date: str
    tender_end_date: str
    clashing_tender_start_date: str
    clashing_tender_end_date: str
    overlap_days: int
    priority_issue: bool

class ClashResponse(BaseModel):
    clashes_by_local_area: Dict[str, List[ClashDetails]]  # Grouped by local_area_name
    suggestions: List[str]