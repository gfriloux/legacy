# portable services

Depuis la `v239` (2018) de [Systemd](https://systemd.io/), est introduit la
notion de [Portable Services](https://systemd.io/PORTABLE_SERVICES/).

## En quoi cela va nous interesser?

### Isolation

- Il est possible de donner accès à une partie du système de fichiers
  du host via `BindPaths=` et `BindReadOnlyPaths=`, pour y stocker
  des datas dites "dynamiques", ressemblant aux volumes sur `Docker`.  
  Pour le reste, le service est `chroot`.
- Si le service est compromis, les accès au système sont restreints.
- Pour les mises à jour, on `detach` l'image `.raw` de la version précédente
  du service, et on `attach` la nouvelle version!  
  C'est tout!  
  Pas besoin de MAJ le système, votre démon est **indépendant du
  système sur lequel il s'execute!**.
  Vous pouvez MAJ le système sans impact sur le service, et inversement!

Il va donc être possible d'avoir par exemple un dossier `/srv/startpage/`
contenant:
```
.r--r--r-- root root 5.7 MB Thu Jan  1 01:00:01 1970  startpage_1.1.0.raw
.r--r--r-- root root 5.7 MB Thu Jan  1 01:00:01 1970  startpage_1.2.0.raw
.r--r--r-- root root 5.7 MB Thu Jan  1 01:00:01 1970  startpage_1.3.0.raw
```

et pouvoir upgrade le service dans le temps, et rollback sur l'image d'avant
en cas de problème.

### Reproductibilité

- On package notre démon dans une image `.raw`.
  Cette image embarque le service et toutes ses dépendances.
  Peu importe la distribution, il se comportera de la même manière.
- [Nix](nix/index.md) sait construire des images [Portable Services](https://systemd.io/PORTABLE_SERVICES/)
  via [pkgs.portableService](https://ryantm.github.io/nixpkgs/builders/images/portableservice/#sec-pkgs-portableService).

### Léger

- C'est plus léger que `docker` (pas de surcouche / isolation réseau).


## Pour quelles limites?

Lorsque l'on commence à vouloir faire discuter plusieurs services,
`docker compose` (ou similaire) va s'imposer naturellement pour continuer
de bosser en `isolation`, avec `reproductibilité`.


## Sources

- [Systemd - Portable services](https://systemd.io/PORTABLE_SERVICES/)
- [Walkthrough for Portable Services](https://0pointer.net/blog/walkthrough-for-portable-services.html)
