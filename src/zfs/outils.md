# Outils

## httm

[httm](https://github.com/kimono-koans/httm) permet de faciliter
l'utilisation de `zfs` pour avoir une visualisation de ce qui s'est passé
dans le temps, au niveau des datasets.

Parmis les différentes possibilitées, les 2 cas d'usage les plus basiques
sont ci dessous.

### Trouver les versions d'un fichier

Supposons notre stack `/srv/docker/victim.org` vue sur la page
[Snapshots](snapshots.md), pour visualiser toutes les modifications
de `docker-compose.yml` dans le temps, nous pouvons faire:

```
 $  /s/d/victim.org  httm docker-compose.yml
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Sun Nov 02 17:04:30 2025 UTC  2.9 KiB  "/srv/docker/victim.org/.zfs/snapshot/zrepl_20251225_060837_000/docker-compose.yml"
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Tue Dec 30 09:03:29 2025 UTC  2.9 KiB  "/srv/docker/victim.org/docker-compose.yml"
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
```
Et observer que ce fichier a été modifié depuis le dernier snapshot!

### Trouver les fichiers supprimés

Exemple avec une stack [netdata](https://github.com/netdata/netdata):
```
 $  /s/d/_base  httm -n --no-live -d -R . | head -n10
⠠
/srv/docker/_base/.zfs/snapshot/2023-07-10-00-00-05/netdata/cache/dbengine-tier2/datafile-1-0000000049.ndf
/srv/docker/_base/.zfs/snapshot/2023-07-10-00-00-05/netdata/cache/dbengine-tier2/datafile-1-0000000050.ndf
/srv/docker/_base/.zfs/snapshot/2023-07-10-00-00-05/netdata/cache/dbengine-tier2/datafile-1-0000000051.ndf
/srv/docker/_base/.zfs/snapshot/2023-07-10-00-00-05/netdata/cache/dbengine-tier2/datafile-1-0000000052.ndf
/srv/docker/_base/.zfs/snapshot/2023-07-10-00-00-05/netdata/cache/dbengine-tier2/datafile-1-0000000053.ndf
/srv/docker/_base/.zfs/snapshot/2023-07-10-00-00-05/netdata/cache/dbengine-tier2/datafile-1-0000000054.ndf
/srv/docker/_base/.zfs/snapshot/2023-07-10-00-00-05/netdata/cache/dbengine-tier2/datafile-1-0000000055.ndf
/srv/docker/_base/.zfs/snapshot/2023-07-10-00-00-05/netdata/cache/dbengine-tier2/datafile-1-0000000056.ndf
/srv/docker/_base/.zfs/snapshot/2023-07-10-00-00-05/netdata/cache/dbengine-tier2/datafile-1-0000000057.ndf
/srv/docker/_base/.zfs/snapshot/2023-07-11-00-00-02/netdata/cache/dbengine-tier2/datafile-1-0000000057.ndf
```

## zfs-prune-snapshots

[zfs-prune-snapshots](https://github.com/bahamas10/zfs-prune-snapshots)
permet de gérer le nombre de snapshots à conserver.  

## zrepl

[zrepl](https://github.com/zrepl/zrepl) permet de répliquer des datasets
entre plusieurs serveurs, que ce soit en mode `push` ou `pull`.

Même s'il peut être difficile de démarrer avec `zrepl` (j'ai trouvé
la documentation peu claire), le résultat est vraiment convaincant.
