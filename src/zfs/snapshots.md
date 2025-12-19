# Snapshots

Supposons un site web `PHP` classique avec une db `MariaDB` sous forme
de stack `docker compose`.  
Cette stack serait déclarée dans un dossier `/srv/docker/victim.org`.  
Le nom du dataset sera `zroot/srv/docker/victim.org`.

## Création d'un snapshot
```bash
zfs snap zroot/srv/docker/victim.org@$(date +%Y-%m-%d-%H-%M-%S)
```

## Liste des derniers snapshots
```
$  /s/d/victim.org  zfs list -H -rt snapshot -o name zroot/srv/docker/victim.org | tail -n5                                                                                                                                                                                                                                    4359ms  mar. 08 août 2023 16:14:41
zroot/srv/docker/victim.org@2023-08-04-00-00-08
zroot/srv/docker/victim.org@2023-08-05-00-00-13
zroot/srv/docker/victim.org@2023-08-06-00-00-04
zroot/srv/docker/victim.org@2023-08-07-00-00-04
zroot/srv/docker/victim.org@2023-08-08-00-00-06
```

## Fichiers modifiés depuis le dernier snapshot
```
$  /s/d/victim.org  just diff                                                                                                                                                                                                                                                         mar. 08 août 2023 16:13:49
zfs diff $(zfs list -H -rt snapshot -o name zroot/srv/docker/victim.org | tail -n1)
M   /srv/docker/victim.org/db/ibdata1
M   /srv/docker/victim.org/db/ib_logfile0
M   /srv/docker/victim.org/db/ib_logfile1
M   /srv/docker/victim.org/db/victim/wp_options.ibd
M   /srv/docker/victim.org/code/wp-content
M   /srv/docker/victim.org/db/ibtmp1
+   /srv/docker/victim.org/backup/1691460000_2023-08-08_victim.sql
M   /srv/docker/victim.org/backup
```

## Naviguer dans un mount du snapshot

Pour voir le contenu du snapshot `2023-08-08-00-00-06` de notre stack,
nous pouvons aller dedans (`read-only`):
```
cd /srv/docker/victim.org/.zfs/snapshots/2023-08-08-00-00-06
```

## Rollback la stack à un snapshot

```
zfs rollback -r zroot/srv/docker/victim.org@2023-08-08-00-00-06
```

## Exporter la stack

Grâce à `zfs send`, il est possible d'exporter un `snapshot` comme bon
nous semble.  

Si notre stack `docker compose` ne déclare que des volumes de type
`bind mount`, situés dans le même dossier, alors déplacer toute la stack
devient trivial!

`zfs send` pourra être invoqué ainsi:
```
zfs send zroot/srv/docker/victim.org@2023-08-08-00-00-06
```

Exporter en tant que fichier:
```
zfs send zroot/srv/docker/victim.org@2023-08-08-00-00-06 >/root/backup.victim.org.raw
```

Exporter via `SSH`:
```
zfs send zroot/srv/docker/victim.org@2023-08-08-00-00-06 | ssh $host "zfs recv zroot/srv/docker/victim.org"
```
