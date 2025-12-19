# direnv

[direnv](https://github.com/direnv/direnv) est un outil qui se greffe sur
votre shell afin de pouvoir automatiquement installer/charger des outils,
et executer des commandes, lorsque vous entrez dans un répertoire (`cd`).

Se reposant sur les gains que permet `nix` (et surtout les [flakes](flakes.md)), il permettra de configurer
automatiquement des envs de travail, en faisant au maximum abstraction
de l'OS que l'on utilise.  

Sans avoir à connaitre par avance les spécificitées d'un projet
(ses dépendances), il sera possible de commencer à travailler dessus.

Exemples d'usages:

- Installer les outils `rust`+`cargo`+`cc` pour compiler un projet `rust`.
- Installer `mdBooks` ou `mkdocs` pour build/visualiser de la documentation.
- Installer les bonnes versions d'`ansible` ou `terraform` pour être
  compatible avec les contraintes d'une infra.

## Sources

- [direnv.net](https://direnv.net/).
- [Effortless dev environments with Nix and direnv](https://determinate.systems/blog/nix-direnv/).
- [Automatic environment activation with direnv](https://nix.dev/guides/recipes/direnv.html).
