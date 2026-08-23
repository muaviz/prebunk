from abc import ABC, abstractmethod

class BaseIngestor(ABC):
    @abstractmethod
    def fetch_latest(self) -> list[str]:
        """
        Fetches the latest content from the platform.
        Returns a list of raw text strings to be matched against the taxonomy.
        """
        pass
