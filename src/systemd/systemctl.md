# systemctl

[systemctl](https://man7.org/linux/man-pages/man1/systemctl.1.html) est le programme principal
de gestion de [systemd](index.md).  

Nous n'allons globalement nous interesser qu'à la partie `gestion de services`.  
Il ne s'agit pas ici d'apprendre les bases, mais d'aller un peu plus loin.

## Hardening

## systemd-analyze security

Cette commande permet d'obtenir un score pour chaque service.  
L'idéal est de connaitre les besoins du service, et d'interdire tout
accès qui ne correspond pas aux besoins.  

Il ne s'agit pas de restreindre le fonctionnement normal de l'application,
mais bien d'encadrer son exploitation ou un bug.

## Configurations

L'intérêt est donc pour chaque service que l'on déploie, d'ajouter
un `override` (par exemple via `systemctl edit`) qui va ajouter des restrictions.

Exemples:

- [PrivateTmp=yes](https://www.freedesktop.org/software/systemd/man/latest/systemd.exec.html?__goaway_challenge=meta-refresh&__goaway_id=906c32ebcbcfadc50d8848f8da8a9896&__goaway_referer=https%3A%2F%2Fwww.google.com%2F#PrivateTmp=): Créé un namespace pour que les accès du service dans `/tmp/` soient isolés dans un dossier temporaire.
- [NoNewPrivileges=true](https://www.freedesktop.org/software/systemd/man/latest/systemd.exec.html?__goaway_challenge=meta-refresh&__goaway_id=906c32ebcbcfadc50d8848f8da8a9896&__goaway_referer=https%3A%2F%2Fwww.google.com%2F#NoNewPrivileges=): Permet d'empêcher le service d'obtenir de nouveaux privilèges.  
  Par exemple pour empêcher `php-fpm` ou un de ses fils de pouvoir passer `root`.
- [ProtectSystem=strict](https://www.freedesktop.org/software/systemd/man/latest/systemd.exec.html?__goaway_challenge=meta-refresh&__goaway_id=906c32ebcbcfadc50d8848f8da8a9896&__goaway_referer=https%3A%2F%2Fwww.google.com%2F#ProtectSystem=): Permet de passer tout `/` en `read-only`.  
  Il convient ensuite d'utiliser `ReadWritePaths` pour autoriser les écritures dans certains dossiers.
- [InaccessiblePaths](https://www.freedesktop.org/software/systemd/man/latest/systemd.exec.html?__goaway_challenge=meta-refresh&__goaway_id=906c32ebcbcfadc50d8848f8da8a9896&__goaway_referer=https%3A%2F%2Fwww.google.com%2F#ReadWritePaths=): Permet de rendre certains dossiers inaccessibles, y compris en lecture.

## Exemples de service

Ces fichiers de configuration ont étés testés sur `Debian`.  
Ils ne sont pas parfaits, et doivent être adaptés à vos usages.

### Redis

Cette configuration permet d'obtenir un score de 2.5 sur `systemd-analyze security`.  
Il force l'utilisation des [sockets unix](https://man7.org/linux/man-pages/man7/unix.7.html) (dans `/var/run/redis/`) pour la connexion,
au lieu de sockets tcp.

`redis.conf`:
```ini
{{#include services/redis.conf}}
```

### MariaDB

Cette configuration permet d'obtenir un score de 4.5 sur `systemd-analyze security`.  

`mariadb.conf`:
```ini
{{#include services/mariadb.conf}}
```

### PHP-FPM

Cette configuration permet d'obtenir un score de 4.6 sur `systemd-analyze security`.  

`php-fpm.conf`:
```ini
{{#include services/php-fpm.conf}}
```

### Apache2

Cette configuration permet d'obtenir un score de 4.9 sur `systemd-analyze security`.  

`apache2.conf`:
```ini
{{#include services/apache2.conf}}
```

## Sources

- [systemd.exec](https://www.freedesktop.org/software/systemd/man/latest/systemd.exec.html)
- [Maitriser la gestion des services Linux avec systemd](https://blog.stephane-robert.info/docs/admin-serveurs/linux/services/)
- [alegrey91/systemd-service-hardening](https://github.com/alegrey91/systemd-service-hardening)
- [Systemd Hardneing - NixOS Wiki](https://nixos.wiki/wiki/Systemd_Hardening)
