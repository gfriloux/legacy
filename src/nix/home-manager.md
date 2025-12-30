# home-manager

[home-manager](https://github.com/nix-community/home-manager)
est du code `nix` sous forme de [flakes](flakes.md) qui vont vous permettre
de gérer des environnements utilisateurs.

Classiquement, sous `GNU/Linux`, vous installez des outils au niveau
`système`, et tous ces outils sont disponibles à tous les utilisateurs.

Avec `home-manager`, vous allez pouvoir séparer les outils, c'est à dire
que vous continuerez d'avoir des outils disponibles au niveau `système`,
**mais** vous pourrez enrichir les environnements de certains utilisateurs.

l'idée est donc de garder la partie `système` la plus **light possible**,
et de seulement charger les utilisateurs qui ont besoins d'outils.

Il va aussi permettre de gérer les [dotfiles](https://wiki.archlinux.org/title/Dotfiles),
mais à un niveau inégalé par les différents outils de gestion de [dotfiles](https://wiki.archlinux.org/title/Dotfiles)
existants.

Utilisateur `GNU/Linux` depuis 1997, le sujet des [dotfiles](https://wiki.archlinux.org/title/Dotfiles)
d'une machine à l'autre, ou à force de réinstalls, je l'ai clairement poncé.

Absolument rien n'a été plus pratique que [home-manager](https://github.com/nix-community/home-manager)
qui hérite des gains de `nix`, des [flakes](flakes.md), et donc va non
seulement permettre d'installer des packages en espace utilisateur, mais
va créér des **services systemd en espace utilisateur**, et permettre de
**générer les dotfiles** de façon **reproductible** grâce à `nix`!

`home-manager` est `Multi-OS`, je m'en suis d'abord servit sous [Archlinux](https://archlinux.fr/),
vous pouvez vous en servir sous `macOS`... Il n'est pas necessaire d'être sous [NixOS](https://nixos.org/).

## Intégration nix

Lorsque vous serez plus à l'aise avec `nix`, que vous en serez à gérer
des portions du système avec `nix`, ou bien tout simplement basculez
sur `NixOS`, vous pourrez intégrer vos configs `home-manager` dans vos
flakes.

Ce n'est donc pas une perte de temps de démarrer `nix` avec uniquement
`home-manager`.

## Sources

- [Home Manager Manual](https://nix-community.github.io/home-manager/).
- [Tutorial: Getting started with Home Manager for Nix](https://ghedam.at/24353/tutorial-getting-started-with-home-manager-for-nix).
- [Evertras/simple-homemanager](https://github.com/Evertras/simple-homemanager) A practical guide to getting
  started with home manager with flakes and all that 2024 goodness.
- [Home Manager - Option Search](https://home-manager-options.extranix.com/).
