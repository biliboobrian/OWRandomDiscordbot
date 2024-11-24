FROM python:3.9-slim
WORKDIR /app

COPY bot.py /app/
COPY requirements.txt /app/

# Étape 4 : Installer les dépendances
RUN pip install --no-cache-dir -r requirements.txt

# Étape 5 : Lancer le bot
CMD ["python", "bot.py"]
