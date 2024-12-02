# Utiliser une image Node.js officielle avec une version compatible
FROM node:18

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier les fichiers package.json et package-lock.json pour installer les dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier tout le projet dans le conteneur
COPY . .

# Compiler le projet TypeScript
RUN npm run build

# Vérifiez le contenu du dossier dist (pour debug)
RUN ls -al dist

# Commande par défaut pour exécuter le bot
CMD ["node", "dist/index.js"]
