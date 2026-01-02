# Mon environnement

En tant que dinosaure, je suis encore principalement avec des outils
qui s'executent dans un terminal.

Cela correspond à ma philosophie :

- Si c'est simple, et fait le boulot, ça suffit.
- Les interfaces graphiques coopèrent mal ensemble.
- C'est moins gourmand en ressources.
- Je suis un gros nostalgique d'une époque maintenant phantasmée:
  les années 80/90.

## Ma stack

Globalement, mes outils necessaires sont dans mon dépôt
[gfriloux/nix-cli](https://github.com/gfriloux/nix-cli/tree/main).

Je vais lister ceux qui pour moi offrent une synergie interessante:

| Outil             | Description                                                          |
|-------------------|----------------------------------------------------------------------|
| [fish]            | Shell en `rust`, qui à l'usage m'est beaucoup plus utile que `bash`. |
| [atuin]           | Historique shell tellement plus moderne que `history`.               |
| [bat]             | Alternative à `cat`. J'ai un `alias` `bat` → `cat`.                  |
| [btop]            | Alternative à `top`/`htop`.                                          |
| [delta]           | Alternative à `diff`.                                                |
| [fzf]             | Fuzzy Finder dont les usages sont tellements nombreux...             |
| [gitflow-toolkit] | Outil d'aide au formattage des messages de commit.                   |
| [git-workspace]   | Sync les dépôt `git` sur `gitlab`/`github`.                          |
| [glow]            | Lecteur `Markdown`.                                                  |
| [gum]             | Permet de créér des interfaces dans le terminal.                     |
| [just]            | Alternative à `make`.                                                |
| [lsd]             | Alternative à `lsd`. J'ai un `alias` `lsd` → `ls`.                   |
| [micro]           | Éditeur texte léger, en alternative à `nano`.                        |
| [ncdu]            | Alternative à `du`.                                                  |
| [oh-my-posh]      | Prompt customisable, avec différents thêmes disponibles sur le site. |
| [prettyping]      | Alternative à `prettyping`. J'ai un `alias` `prettyping` → `ping`.   |
| [pwgen]           | Générateur de mots de passe.                                         |
| [rsync]           | Pour les transferts de fichiers.                                     |
| [sshtui]          | Interface pour les configs `ssh` en utilisant [tv][tv].              |
| [tv]              | Alternative à `fzf`.                                                 |
| [xcp]             | Alternative à `cp`. J'ai un `alias` `xcp` → `cp`.                    |
| [zellij]          | Alternative à `screen`.                                              |

[fish]: https://github.com/fish-shell/fish-shell
[oh-my-posh]: https://github.com/JanDeDobbeleer/oh-my-posh
[atuin]: https://github.com/atuinsh/atuin
[bat]: https://github.com/sharkdp/bat
[btop]: https://github.com/aristocratos/btop
[delta]: https://github.com/dandavison/delta
[fzf]: https://github.com/junegunn/fzf
[gitflow-toolkit]: https://github.com/gfriloux/gitflow-toolkit
[git-workspace]: https://github.com/orf/git-workspace
[glow]: https://github.com/charmbracelet/glow
[gum]: https://github.com/charmbracelet/gum
[just]: https://github.com/casey/just
[lsd]: https://github.com/lsd-rs/lsd
[micro]: https://github.com/zyedidia/micro
[ncdu]: https://github.com/rofl0r/ncdu
[prettyping]: https://github.com/denilsonsa/prettyping
[pwgen]: https://github.com/jbernard/pwgen
[rsync]: https://github.com/RsyncProject/rsync
[sshtui]: https://github.com/gfriloux/sshtui
[tv]: https://github.com/alexpasmantier/television
[xcp]: https://github.com/xcp-ng/xcp
[zellij]: https://github.com/zellij-org/zellij
