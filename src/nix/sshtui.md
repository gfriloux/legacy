# sshtui

![sshtui](https://github.com/gfriloux/sshtui/raw/main/sshtui.gif)

[sshtui] est un petit script qui permet de naviguer dans nos
configs `openssh` afin de trouver le serveur sur lequel on souhaite
se connecter.

Ses caractéristiques:

- Il se base sur [tv] pour le rendu graphique.
- Il créé un [tv channel] pour permettre à [tv] de savoir comment traiter
  nos configs `openssh`.
- Il dépend des outils suivants:
  - `bash`
  - `bat`
  - `awk`
  - `xargs`

Ses flakes déclarent un module pour `home-manager`, permettant de facilement
l'intégrer dans nos configurations `home-manager`.

C'est en fait un excellent projet pour apprendre à faire cela, car il a la
simplicité permettant de se focaliser sur comment intégrer dans `home-manager`
un package que l'on créé nous-même.

Afin encore d'éviter de se créér un ensemble de problèmes, nous allons utiliser
[snowfall-lib] qui "standardise" la manière d'écrire nos flakes, afin
qu'ils soient bien organisés (ce qui est très bien pour des débutants).


## Création de notre module nix

Dans cet exemple, nous crééons le dépôt [sshtui] sur `github`.

### flake.nix

dans notre [flake.nix], la partie importante est [celle-ci](https://snowfall.org/guides/lib/quickstart/):
```nix
inputs.snowfall-lib.mkFlake {
  inherit inputs;
  systems = [ "x86_64-linux" "aarch64-linux" "x86_64-darwin" "aarch64-darwin" ];
  src = ./.;

  snowfall = {
    namespace = "sshtui";
  };
  alias = {
    packages.default = "sshtui";
  };
};
```

C'est ce qui va permette à [snowfall-lib] de générer tout le code du `flake`
avec les bons `output` pour réutiliser ce `module nix`


### package sshtui

Nous pouvons dès maintenant déclarer notre package dans `packages/sshtui/default.nix`:
```nix
{ lib, pkgs, writeShellApplication, ... }:

writeShellApplication {
  name = "sshtui";
  text = (builtins.readFile ../../sshtui);
  runtimeInputs = with pkgs; [
    bash
    television
    bat
    gawk       # awk
    findutils  # xargs
  ];

  meta  = with lib; {
    description = "Simple SSH TUI";
    licence = licences.gpl;
    platforms = platforms.all;
    mainProgram = "sshtui";
  };
}
```
C'est globalement aussi simple que ça!
Nous demandons à `nix` de build un script `shell` dont l'emplacement est à
la racine du projet : [../../sshtui]

Et nous déclarons dans `runtimeInputs` les packages dont il dépend!
C'est tout!

### module home-manager

Afin de pouvoir utiliser ce `nix module` depuis `home-manager`,
nous avons besoin de déclarer `programs.sshtui` dans
`modules/home/sshtui/default.nix`:

```nix
{ config, lib, pkgs, ... }:
let
  cfg = config.programs.sshtui;
in
{
  options.programs.sshtui = {
    enable = lib.mkEnableOption "sshtui";

    package = lib.mkOption {
      type = lib.types.package;
      default = pkgs.sshtui;
      description = "sshtui package to use";
    };
  };

  config = lib.mkIf cfg.enable {
    xdg.configFile."television/cable/sshtui.toml".source = ../../../sshtui.toml;
    home.packages = [
      cfg.package
    ];
  };
}
```

ainsi, si l'on déclare `programs.sshtui.enable=true;` dans notre config
`home-manager`, nous aurons:

- L'installation du script `sshtui`.
- L'installation de `sshtui.toml` qui est notre [tv channel] pour [tv].

### overlay sshtui

Maintenant, pour que ce module s'intègre bien, nous allons déclarer un
[snowfall-lib-overlay] afin de pouvoir utiliser `pkgs.sshtui`.  
On créé donc `overlays/sshtui/default.nix`:
```nix
{ channels, inputs, ... }:

final: prev: {
  sshtui = inputs.self.packages.${final.system}.sshtui;
}
```


## Utilisation du module

Maintenant que tout est fait, pour l'utiliser il y'a 3 choses à faire
dans le dossier contenant nos flakes et notre config
`home-manager`

### Ajout du input dans flake.nix

```nix
sshtui = {
  url = "github:gfriloux/sshtui";
  inputs.nixpkgs.follows = "nixpkgs";
};
```

### Déclaration du module home-manager

Toujours dans `flake.nix` (normalement), sous
`home-manager.lib.homeManagerConfiguration`, nous
ajoutons ce `module`:

```nix
modules = [
  sshtui.homeModules.sshtui
];
```

### Installation du program

Dans `home.nix` (normalement), nous
ajoutons:

```nix
programs.sshtui.enable = true;
```

Et c'est tout!
Normalement vous devriez avoir la commande `sshtui` disponible!

[../../sshtui]: https://github.com/gfriloux/sshtui/blob/c75e3449bd19c19b987154ae99a4e8d060547da4/sshtui
[flake.nix]: https://github.com/gfriloux/sshtui/blob/c75e3449bd19c19b987154ae99a4e8d060547da4/flake.nix
[snowfall-lib]: https://snowfall.org/guides/lib/quickstart/ 
[snowfall-lib-overlay]: https://snowfall.org/guides/lib/overlays/
[sshtui]: https://github.com/gfriloux/sshtui
[tv]: https://github.com/alexpasmantier/television
[tv channel]: https://alexpasmantier.github.io/television/docs/Users/channels/
