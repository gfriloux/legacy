# Startpage

![startpage-preview-green](startpage-preview-green.png)

[Ce projet](https://github.com/gfriloux/retro-startpage) est un exemple de comment nous pouvons créér un [portable service](portables.services.md)
très simple:

- Embarque un serveur web minimal (que l'on compile nous-même pour la demo).
- Embarque le site web de la startpage.
- Ajoute la database (`links.json`) des bookmarks.
- Tout le service est isolé dans un fichier `.raw`.
- Pas d'interactions avec d'autres services.
- Pas de `BindPaths`.

La construction de l'image se fait donc en 3 étapes:

1. Packager [littleweb](https://github.com/gfriloux/littleweb).
2. Packager [retro-crt-startpage](https://scar45.github.io/retro-crt-startpage/index.html).
3. Packager le service file.

## Résultat

Nous avons une image `retro-startpage_1.3.1.raw` de `4.9MB`.  
Le service consomme `~10MB` de RAM.
`systemd-analyze security` nous donne un score de `1.2`, ce qui est excellent.

Du fait d'utiliser [littleweb](https://github.com/gfriloux/littleweb),
que l'on compile [statiquement](https://en.wikipedia.org/wiki/Static_build),
nous avons une image type [distroless](https://docs.docker.com/dhi/core-concepts/distroless/),
[chroot](https://wiki.archlinux.org/title/Chroot_(Fran%C3%A7ais)),
avec du [systemd hardening](https://github.com/samderkaoui/systemd-service-hardening),
qu'il sera a priori très difficile d'exploiter!

Un seul binaire executable: [littleweb](https://github.com/gfriloux/littleweb).

En cas d'exploitation réussie, le service n'est pas `root`, n'accède pas
au système de fichiers de l'hôte, c'est une coquille vide...


Cette image est censée pouvoir s'executer sur toute distribution linux
disposant de `systemd v239` `x86_64`, c'est pas mal niveau portabilité!

Et biensûr, tout se passe dans [flake.nix](https://github.com/gfriloux/retro-startpage/blob/main/flake.nix)!
