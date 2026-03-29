import os

class Config:
    SQLALCHEMY_DATABASE_URI = 'sqlite:///ise.db'  # simple local DB
    SQLALCHEMY_TRACK_MODIFICATIONS = False