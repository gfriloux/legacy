# Datasets

Les `datasets` sur `ZFS` sont des volumes qui sont créés sur un `zpool`
existant, et qui vont porter un ensemble de propriétées qui leur seront
propres ou héritées.

Chaque `dataset` est le fils d'un `dataset` ou directement du `zpool`.

Ce `dataset` sera mount comme un volume classique (par `ZFS`).

Les `datasets` peuvent être créés et détruits à tous moments.
Il est donc possible, en cas de nouveau besoin, d'adapter le système
de fichiers à celui-ci (par exemple un `dataset` par stack applicative
ou par utilisateur).


## Pourquoi c'est pratique

### Réservation disque

En configurant une réservation disque à l'avance, vous
pourrez vous assurer que cet espace lui soit dès le début
attribué, même s'il n'en fait pas l'usage immédiat.

C'est pour simplifier de la planification.

Exemple:
```
# zfs set reservation=5G zroot/root/home/web-user
```

```
# zfs list
NAME                        USED  AVAIL  REFER  MOUNTPOINT
zroot/root/home             5.00G  33.5G  8.50K  /home
zroot/root/home/web-user    15.0K  33.5G  8.50K  /home/web-user
```

L'espace est donc directement consommé sur `zroot/root/home` (qui est lui
aussi un `dataset`), même si `zroot/root/home/web-user` ne contient encore
aucunes données.

Sources:

- [Setting Reservations on ZFS File Systems](https://docs.oracle.com/cd/E19253-01/819-5461/gbdbb/index.html)


### Configurer un quota

Il est possible de définir un usage disque max sur un dataset.  
Sela permet d'empêcher une application, un utilisateur, ou un élément système
de consommer l'intégralité de l'espace du `zpool` en cas de défaut.

Le cas le plus classique étant la création de logs qui viennent saturer
le système.

Même si `journalctl` est configurable pour disposer d'une taille max des
logs, les applications n'utilisent pas toutes `journalctl`.

Exemple:
```
# zfs set quota=10G zroot/root/var/log
# zfs get quota zroot/root/var/log
NAME                PROPERTY  VALUE  SOURCE
zroot/root/var/log  quota     10G    local
```

Sources:

- [Setting ZFS Quotas and Reservations](https://docs.oracle.com/cd/E23823_01/html/819-5461/gazvb.html)

### Compresser les données

Si vous crééz un dataset dont vous savez à l'avance que les données
se compressent bien, alors vous pouvez activer.

Il est possible de choisir l'algorithme de compression, ainsi
qu'obtenir des stats sur son efficacité.

Il est évident que cela va surtout très bien s'appliquer pour
un `dataset` qui va contenir des logs.

Exemple:
```
# zfs set compression=on zroot/root/var/log
# zfs get compression zroot/root/var/log
NAME               PROPERTY     VALUE      SOURCE
zroot/root/var/log compression  on         local
```
