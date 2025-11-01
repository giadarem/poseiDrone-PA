# Usa l'immagine ufficiale Node.js 20 basata su Alpine. 
FROM node:20-alpine

# Imposta la directory di lavoro all'interno del container.
WORKDIR /usr/src/app

# Copia i file di configurazione essenziali per la gestione delle dipendenze e di TypeScript.
COPY package*.json tsconfig.json ./

# Installa tutte le dipendenze del progetto (incluse quelle di sviluppo/typescript).
RUN npm install

# Copia il codice sorgente nella directory di lavoro del container.
COPY . .

# Compila il progetto TypeScript in JavaScript 
RUN npm run build

# Espone la porta 3000 del container. Questo è solo informativo; la mappatura è gestita da docker-compose.
EXPOSE 3000

# Definisce il comando predefinito che verrà eseguito all'avvio del container.
CMD ["npm", "start"]