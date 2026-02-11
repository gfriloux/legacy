# templates

Les templates sont des `nix flake` qui servent de base pour des types
de projets.  

Dans mon cas, il s'agit de mettre en place mon environnement de travail
rapidement.

## exemples

### roles ansibles

Dans le cas de l'écriture de roles ansibles,
je veux disposer de certains outils:

- [ansible-lint]
- [gitleaks]
- [shellcheck] (optionel)
- [shfmt] (optionel)

Je ne veux pas forcément les avoir à disposition, mais je souhaite
qu'ils soient utilisés pour valider mes commits, afin de
m'empêcher de pousser du (trop) mauvais code.

j'ai pour cela un `template` qui me permet de déployer un
env : [gfriloux/nix-templates#ansible-role].

Celui déploie:

- Un env de dev avec:
  - [ansible-lint]
  - [pre-commit]: Pour déclencher les batteries de test avant `git commit`.
  - [glow]: Pour afficher un petit `README` quand l'env se charge.
- Des checks `nix` qui seront executés avant chaque `git commit`:
  - [ansible-lint]
  - [gitleaks]
  - [shellcheck]
  - [shfmt]

Pour cela, lorsque je commence à écrire un nouveau
role ansible, je fais:

```
nix flake init --template github:gfriloux/nix-templates#ansible-role
```

Qui m'installe le template.  
Je peux maintenant charger l'env:

```
direnv allow
```

Et je peux déjà lancer mes tests avec la commande:
```
nix flake check
```


[gfriloux/nix-templates#ansible-role]: https://github.com/gfriloux/nix-templates/tree/8c6a8bde6e53db281ed5b125cb11655e4e6edff3/templates/ansible-role
[ansible-lint]: https://docs.ansible.com/projects/lint/
[gitleaks]: https://github.com/gitleaks/gitleaks
[shellcheck]: https://github.com/koalaman/shellcheck
[shfmt]: https://github.com/mvdan/sh
[pre-commit]: https://github.com/pre-commit/pre-commit
[glow]: https://github.com/charmbracelet/glow
