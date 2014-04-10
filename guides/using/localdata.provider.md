* prérequis
Pouvoir lancer un programme sur le port 8000
Avoir une base de données mongodb en local

* Localdata provider
``` bash
source ./keys #haha
node bin/server
```

Localdata est lancé: plus besoin d'y toucher. Il ne fera plus qu'afficher les logs de ce qu'il fait.


* Settings.anyfetch.com
Connecter Localdata
définir le chemin absolu du dossier des fichiers à provider (les sous dossiers le seront aussi)


* Mongodb
Récupérer le token qui sera utilisé par le provider:
ouvrir le shell mongo
``` bash
mongo
use anyfetch-provider
db.tokens.find()
```
copier le dernier "anyfetchToken"

exemple:
dans la ligne mongo : { "anyfetchToken" : "09710ea376b0c5a6e8fb739f5071e5667e16d0dd25e5e0474f53a18d4b0606f6", "datas" : { "path" : "/path/to/data/to/provide" }, "_id" : ObjectId("533c3e084256f8530af71dd4"), "lastUpdate" : null, "isUpdating" : false, "__v" : 0 }

on récupère : 09710ea376b0c5a6e8fb739f5071e5667e16d0dd25e5e0474f53a18d4b0606f6

* Envoyer une rêquete HTTP au provider
envoyer une requete POST pour commencer le providing :
localhost:8000/update?access_token={$TOKEN}&api_url=http://api.anyfetch.com

regarder les logs de localprovider défiler