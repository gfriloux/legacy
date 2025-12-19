# flakes

les `nix flakes` sont un moyen d'écrire des expressions `nix` dans
le but de:

- Packager un outil.
- Créér une VM.
- Installer/Configurer son système.
- Installer/Configurer un système distant.
- Créér un environnement de développement.

Bien qu'extrêmement puissant, il s'agit d'un outil fort compliqué
à utiliser, car il requiert de savoir écrire dans le langage `nix`.

C'est pourquoi je ne recommande pas de se lancer dans l'aventure
`nix` en partant directement sur `nixos` + des `flakes` pour décrire
intégralement son OS et ses environnements de travail.

Il faut savoir s'approprier les outils par étapes, pour ne pas s'en
dégouter ou se dévaloriser suite à un effort trop complexe pour
être fait en une seule fois.

[Devbox](devbox.md) est un moyen beaucoup plus rapide pour commencer
à créér des environnements de travail, tout en effectuant un premier
pas vers `nix`!

## Modules

Il est possible d'écrire des `flakes` sous forme de modules,
qui pourront être utilisés par d'autres `flakes`, afin de ne pas
toujours ré-inventer la roue.

## Sources

- [Flakes - Official NixOS Wiki](https://wiki.nixos.org/wiki/Flakes)
- [Paranoid NixOS Setup](https://xeiaso.net/blog/paranoid-nixos-2021-07-18/)
- [Nix Impermanence](https://github.com/nix-community/impermanence)
- [oddlama/nix-config](https://github.com/oddlama/nix-config/tree/main) - Exemple de
  `flakes` pour gérer plusieurs hôtes sous `NixOS`.
- [Is NixOS the best OS for servers?](https://oblivion.keyruu.de/Homelab/NixOS-for-Servers)
