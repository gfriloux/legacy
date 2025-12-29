# Mon héritage

Ce livre est l'héritage de mes connaissances, en fonction du temps que
j'ai pour l'écrire, et ce que je pense à écrire.

## Mon expérience

Même si j'ai connu `MS-DOS`, `Windows 3.1`, `Windows 95`,
ce n'est qu'à la découverte de `GNU/Linux` que mon aventure
informatique démarre rééllement.

Et même si j'ai testé beaucoup de distros, il est possible
de se contenter de cette timeline grossière:

| Année | Distro/OS |
|-------|-----------|
| 1997  | Slackware |
| 1998  | Redhat    |
| 2000  | Debian    |
| 2005  | Gentoo    |
| 2008  | Archlinux |
| 2024  | NixOS     |

## Solutions à des problèmes

### Hardening

#### Docker

- [startpage - Pourquoi utiliser nix?](docker/startpage.html#pourquoi-utiliser-nix)

#### Filesystem

Empêcher une application de saturer le disque système,
par exemple via l'écriture de logs.

- [ZFS - Datasets - Quotas](./zfs/datasets.html#configurer-un-quota)

#### Services

Restreindre les droits d'un service

- [Systemd - portable services](systemd/portables.services.html#isolation)
- [Systemd - systemctl hardening](systemd/systemctl.html#hardening)
