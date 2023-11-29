from sqlalchemy import create_engine, Column, Text, JSON
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class ScenariosTable(Base):
    __tablename__ = 'scenarios'

    scenario_id = Column(Text, primary_key=True)
    user_sub = Column(Text)
    profile_id = Column(Text)
    scenario_name = Column(Text)
    desired_outcome = Column(Text)
    contents = Column(JSON)