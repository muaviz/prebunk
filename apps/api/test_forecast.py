import sys
from unittest.mock import patch, MagicMock
from datetime import datetime, timedelta

# Create a mock for Supabase and db
import sys
import types
mock_db = types.ModuleType("db")
mock_supabase = MagicMock()
mock_db.supabase = mock_supabase
sys.modules["db"] = mock_db

# Append apps/api so we can import services
sys.path.append("apps/api")

from services.forecast import generate_forecast

# Mock out Supabase response
mock_res = MagicMock()
mock_res.data = [
    {"computed_at": (datetime.utcnow() - timedelta(hours=i)).isoformat(), "score": 10.0}
    for i in range(1)  # Only 1 point to trigger the len < 2 path
]
mock_supabase.table().select().eq().order().limit().execute.return_value = mock_res

try:
    generate_forecast("NAR-TEST", hours=72, method="linear")
    print("Test passed: UnboundLocalError did not occur.")
except Exception as e:
    print(f"Test failed with error: {e}")
