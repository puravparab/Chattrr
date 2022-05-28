"""
Production Settings for Heroku
"""
import os 
from pathlib import Path
import environ

# If using in your own project, update the project namespace below
from Chattrr.settings.dev import *

env = environ.Env(
    # set casting, default value
    DEBUG=(bool, False)
)

environ.Env.read_env(Path(BASE_DIR, '.env'))

# Parse database connection url strings like psql://user:pass@127.0.0.1:8458/db
DATABASES = {
    # read os.environ['DATABASE_URL'] and raises ImproperlyConfigured exception if not found
    'default': env.db(),
}