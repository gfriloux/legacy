# traefik

[Traefik](https://traefik.io/traefik) est un proxy qui s'intègre très
bien à des stacks `docker` car il peut se configurer au travers
des [Docker labels](https://docs.docker.com/engine/manage-resources/labels/).

En effet, il est possible de déclarer un `vhost` au travers des 
[Docker labels](https://docs.docker.com/engine/manage-resources/labels/)
afin d'obtenir sa création et destruction selon si le conteneur associé
est démarré ou non.

Son autre usage le plus populaire est de l'utiliser pour générer des
certificats [Let's Encrypt](https://letsencrypt.org/fr/) de manière automatisée
(et donc, toujours sur création du conteneur associé au vhost).

## Routers

Les [routers](https://doc.traefik.io/traefik/reference/routing-configuration/http/routing/router/)
nous permettent de décrire le traitement des requêtes, et donc, de définir
les `vhosts`.

Rien de très complexe, un [routers](https://doc.traefik.io/traefik/reference/routing-configuration/http/routing/router/)
`nextcloud` se déclarera ainsi:

```toml
- traefik.http.routers.nextcloud.rule=Host(`nextcloud.victim.org`)
```

## Middlewares

Les [middlewares](https://doc.traefik.io/traefik/reference/routing-configuration/http/middlewares/overview/)
permettent de manipuler les requêtes et les réponses traitées.

### Filtrage IP

Nous pouvons déclarer le [middlewares](https://doc.traefik.io/traefik/reference/routing-configuration/http/middlewares/overview/)
`interne` suivant:
```toml
labels:
  - "traefik.http.middlewares.interne.ipwhitelist.sourcerange=192.168.0.0/16"
```
Cela aura pour effet de filtrer les requêtes pour n'accepter que celles venant
du `CIDR` `192.168.0.0/16`.

Pour l'utiliser, il faut attacher ce `middleware` à notre `router` dédié
à notre conteneur `docker` (qui s'appelle `nextcloud` dans cet exemple):
```toml
labels:
  - "traefik.http.routers.nextcloud.middlewares=interne"
```

Attention, ce filtrage cassera de fait la création de certificats
[Let's Encrypt](https://letsencrypt.org/fr/).  
Il conviendra donc de garder `/.well-known/` accessible publiquement,
par exemple en créant 2 [router](https://doc.traefik.io/traefik/reference/routing-configuration/http/routing/router/)
`nextcloud` et `nextcloud-le`:

```toml
labels:
  - traefik.http.routers.nextcloud.rule=Host(`nextcloud.victim.org`)
  - traefik.http.routers.nextcloud.tls=true
  - traefik.http.routers.nextcloud.tls.certresolver=lets-encrypt
  - traefik.http.routers.nextcloud.middlewares=galilee-interne
  - traefik.http.routers.nextcloud-le.rule=(Host(`nextcloud.victim.org`) && PathPrefix(`/.well-known/`))
  - traefik.http.routers.nextcloud-le.tls=true
  - traefik.http.routers.nextcloud-le.tls.certresolver=lets-encrypt
```
Ainsi, toute requête vers `nextcloud.victim.org/.well-known/` sera traitée par
le [router](https://doc.traefik.io/traefik/reference/routing-configuration/http/routing/router/)
`interne-le`, sans restriction IP, alors que le reste y sera soumis.

## Best practices

### Isoler le conteneur

Le mieux est de pouvoir créér un ou plusieurs [Docker network](https://docs.docker.com/engine/network/)
dont fera parti [Traefik](https://traefik.io/traefik).

Pour chaque conteneur qui aura effectivement besoin d'être proxifié par
[Traefik](https://traefik.io/traefik), il conviendra de l'associer à ce(s) network(s).

Le but étant, sur une stack `docker compose`, de n'avoir que ce conteneur
qui fasse parti du même [Docker network](https://docs.docker.com/engine/network/)
que [Traefik](https://traefik.io/traefik), les autres n'étant donc pas directement
accessibles par [Traefik](https://traefik.io/traefik).

## Sources

- [Exposer des Services Web avec Traefik](https://blog.stephane-robert.info/docs/services/reseau/traefik/)
