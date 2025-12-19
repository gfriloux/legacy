# Histoire

`ZFS` est un système de fichiers initialement développé par
[Sun Microsystems](https://fr.wikipedia.org/wiki/Sun_Microsystems)
en 2005.  

Il se distingue à l'époque sur plusieurs aspects clairement novateurs:  
1. Résilient aux pannes, nous avons à l'époque des conférences des
   ingénieurs `Sun` qui nous montrent qu'ils peuvent percer les disques
   d'un raid `ZFS` actuellement en cours d'utilisation, sans impact sur
   la disponibilité du raid.
2. Prévu pour le futur avec des limites sur le nombre de fichiers, leur
   taille maximale, la taille maximale du `zpool`...
3. La possibilité de créér des datasets (re)configurables contrairement
   aux classiques `partitions`.
4. La possibilité de créér des snapshots sans coût, instantannés, et une
   gestion très fine des données entre les snapshots.

## Mon expérience

J'ai utilisé `ZFS` sur du perso dès 2009.  
Je l'ai utilisé sur de la prod dès 2012.  

J'ai géré jusqu'à ~400 serveurs de prod avec du `ZFS on root`,
ce qui me permet d'être solide sur mon expérience avec ce système
de fichier, et donc, de **savoir** les gains qu'il apporte, les problèmes
qu'il permet d'**éviter**.

À ce jour (2025), mon PC perso est toujours sur `ZFS` → [Eat your own dog food](https://en.wikipedia.org/wiki/Eating_your_own_dog_food).

## Sources

1. [ZFS - Wikipédia](https://fr.wikipedia.org/wiki/ZFS).
2. [GNU/Linux Magazine](https://connect.ed-diamond.com/GNU-Linux-Magazine/glmf-114/zfs-sous-gnu-linux) - article de 2009, qui m'a lancé dans l'aventure `ZFS`.
3. [ZFS for Dummies](https://ikrima.dev/dev-notes/homelab/zfs-for-dummies/)
