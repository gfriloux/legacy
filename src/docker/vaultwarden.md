# vaultwarden

[Vaultwarden](https://github.com/dani-garcia/vaultwarden) est une
implémentation libre du serveur de [Bitwarden](https://bitwarden.com).

Nous allons discuter de comment nous implémentons ce service
dans un écosystème disposant de [traefik](traefik.md) et
[watchtower](watchertower.md).

Pas de `nixfection` (pour le moment!).


## Séparation des déclarations

Bien que cela semble ridicule pour cet exemple du fait que
la stack soit très légère, cela nous permet justement de mieux
appréhender le concept.

Sur une infra plus complexe, nous y trouverions aussi `MariaDB`, `Redis`...

### docker-compose.yml

Dans `docker-compose.yml` nous n'allons déclarer que les éléments essentiels
à la gestion de la stack.

Ce fichier pourrait tout simplement être donné à un client,
un collègue...  
A l'inverse, il peut vous être fourni par les développeurs de l'application,
et vous le gardez inchangé pour mieux voir les diffs dans le temps
(pour certains projets, votre stack est un `git clone` d'un dépôt,
et donc vous ne souhaitez pas créér de diff sur ce fichier indexé
par `git`).

Il ne contient rien de spécifique.

```yml
services:
  bitwarden:
    image: vaultwarden/server:latest
    restart: always
    environment:
      - EXPERIMENTAL_CLIENT_FEATURE_FLAGS=ssh-key-vault-item,ssh-agent
    volumes:
      - ./data:/data
```

### docker-compose.override.yml

Dans `docker-compose.override.yml` nous allons écrire les spécifités
de notre stack, notamment:

- Notre conteneur doit être sur le réseau `web` (dans lequel nous avons
  notre [traefik](traefik.md)).
- Notre conteneur est mis à jour par [watchtower](watchtower.md) avec
  les règles par défaut.
- Notre conteneur dispose de labels pour [traefik](traefik.md) afin
  de déclarer le `vhost` et gérer automatiquement le certificat
  `Let's Encrypt`.

```yml
services:
  bitwarden:
    labels:
      - traefik.http.routers.vaultwarden.rule=Host(`vaultwarden.victim.org`)
      - traefik.http.routers.vaultwarden.tls=true
      - traefik.http.routers.vaultwarden.tls.certresolver=lets-encrypt
      - com.centurylinklabs.watchtower.enable=true
    networks:
      - web

networks:
  web:
    external: true
```

Rien à faire pour que `Docker` prenne en compte ce fichier, vous
pouvez directement utiliser `docker compose up -d`.
