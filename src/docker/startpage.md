# startpage

[Startpage](https://github.com/gfriloux/retro-startpage) est notre petit projet `demo` de création d'un site
web de gestion de bookmarks (statique).

Veuillez vous référer à [systemd/startpage](../systemd/startpage.md) pour comprendre
la stack.

En effet, ici, nous ne parlerons que de la création de l'image docker!


## Construction du projet


### Nix

Grâce à `nix`, nous allons pouvoir générer une image [Docker](https://www.docker.com/)
la plus légère possible, sans fioritures, [distroless](https://docs.docker.com/dhi/core-concepts/distroless/).

Cela se fait en utilisant [pkgs.dockerTools](https://ryantm.github.io/nixpkgs/builders/images/dockertools/):

```nix
oci-docker = pkgs.dockerTools.buildLayeredImage {
  name = "retro-startpage";
  tag = "latest";
  config = {
    Cmd = ["${packages.littleweb}/bin/littleweb" "--host" "0.0.0.0" "--path" "${packages.website}/"];
    User = "1000:1000";
  };
};
```

On lance le build:
```
nix build .#oci-docker
```

### Pourquoi utiliser nix?

Tout simplement car en utilisant `nix` plutôt qu'écrire un `Dockerfile`,
nous ajoutons ses concepts, notamment, dans ce contexte:

- Les phases de build se font sans accès réseaux, il y'a
  une phase de téléchargement des fichiers, une phase de construction.  
- Nous avons enfin des builds reproductibles, contrairement
  à des `Dockerfile` qui cessent de build du jour au lendemain.

Nous allons aussi éviter la facilité introduite par [Docker](https://www.docker.com/):

Écrire des `Dockerfile` avec `FROM debian` car c'est pratique, au cas où on
ait besoin d'un outil à un moment donné.  
Ça ne semble pas problèmatique si l'on n'y pense pas vraiment,
mais partir d'une distribution "de base", fait qu'on embarque un ensemble
de librairies, un shell, un package manager... qui pourront un jour jouer
contre notre service, en terme de sécurité (un shellcode de base execute
`/bin/sh`).

## Résultat

Nous pouvons charger l'image avec la commande `docker load < result`.  

### docker images
```
 kuri@Nomad  retro-startpage  main  16:02  docker images
IMAGE                    ID             DISK USAGE   CONTENT SIZE   EXTRA
retro-startpage:latest   1df45e5206f5       13.2MB             0B
```

### dive

[dive](https://github.com/wagoodman/dive) nous permet d'inspecter
le contenu de notre image, afin de vérifier que nous avons bien
quelque chose de léger, [distroless](https://docs.docker.com/dhi/core-concepts/distroless/):

```
┃ ● Current Layer Contents ┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Permission     UID:GID       Size  Filetree                                                                                                                    
drwxr-xr-x   1000:1000      13 MB  └── nix                                                                                                                     
drwxr-xr-x   1000:1000      13 MB      └── store                                                                                                               
dr-xr-xr-x   1000:1000     9.9 MB          ├── mk1nrzsfngfj5hipmgq1a51cysr89x43-littleweb-static-x86_64-unknown-linux-musl-1.4.0                               
dr-xr-xr-x   1000:1000     9.9 MB          │   └── bin                                                                                                         
-r-xr-xr-x   1000:1000     9.9 MB          │       └── littleweb                                                                                               
dr-xr-xr-x   1000:1000     3.2 MB          └── nga39cm902ckqjwffp8r2f63kkb72jbc-retro-crt-startpage-x86_64-unknown-linux-musl                                  
-r--r--r--   1000:1000      33 kB              ├── apple-touch-icon.png                                                                                        
-r--r--r--   1000:1000     8.7 kB              ├── ascii-headers.html                                                                                          
-r--r--r--   1000:1000      445 B              ├── browserconfig.xml                                                                                           
-r--r--r--   1000:1000      611 B              ├── crossdomain.xml                                                                                             
dr-xr-xr-x   1000:1000      23 kB              ├─⊕ css                                                                                                         
-r--r--r--   1000:1000      33 kB              ├── favicon.png                                                                                                 
dr-xr-xr-x   1000:1000     398 kB              ├─⊕ fonts                                                                                                       
-r--r--r--   1000:1000      229 B              ├── humans.txt                                                                                                  
dr-xr-xr-x   1000:1000     2.4 MB              ├─⊕ images                                                                                                      
-r--r--r--   1000:1000     3.3 kB              ├── index.html                                                                                                  
dr-xr-xr-x   1000:1000     264 kB              ├─⊕ js                                                                                                          
-r--r--r--   1000:1000     2.0 kB              ├── links.json                                                                                                  
-r--r--r--   1000:1000      23 kB              ├── power_off.mp3                                                                                               
-r--r--r--   1000:1000      35 kB              ├── power_on.mp3                                                                                                
-r--r--r--   1000:1000       61 B              └── robots.txt          
```

### docker run

```
 kuri@Nomad  retro-startpage  main  16:07  docker run -p 80:8080 retro-startpage
[2025-12-29T15:07:16Z INFO  littleweb] Serving /nix/store/nga39cm902ckqjwffp8r2f63kkb72jbc-retro-crt-startpage-x86_64-unknown-linux-musl/ on port 8080
[2025-12-29T15:07:16Z INFO  actix_server::builder] starting 2 workers
[2025-12-29T15:07:16Z INFO  actix_server::server] Actix runtime found; starting in Actix runtime
[2025-12-29T15:07:16Z INFO  actix_server::server] starting service: "actix-web-service-0.0.0.0:8080", workers: 2, listening on: 0.0.0.0:8080
```

Il est désormais possible d'accéder au service via [http://localhost:80](http://localhost:80)
