from fastapi import APIRouter
from db import supabase

router = APIRouter(prefix="/clusters", tags=["clusters"])

@router.get("/")
def get_clusters():
    res = supabase.table("clusters").select("*").execute()
    return res.data
