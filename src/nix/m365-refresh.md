# m365-refresh

[m365-refresh] est un script python qui permet de refresh
les {access,refresh} tokens pour l'auth `OAUTH2`, si vous avez
un compte mail chez microsoft.  

C'est une reprise de [UvA-FNWI/M365-IMAP], pour le faire
fonctionner en mode service.

Ce mini projet nous permet de facilement valider quelques technos:

- Packager un script python ultra basique.
- Créér un service systemd dans votre espace utilisateur.
- Créér un timer systemd dans votre espace utilisateur.





## Création de notre module nix

### flake.nix

Notre [flake.nix] ne change pas vraiment par rapport à
[sshtui](sshtui.nix):

```nix
inputs.snowfall-lib.mkFlake {
  inherit inputs;
  systems = [ "x86_64-linux" "aarch64-linux" "x86_64-darwin" "aarch64-darwin" ];
  src = ./.;

  snowfall = {
    namespace = "m365";
  };
  alias = {
    packages.default = "m365";
  };
};
```

Le package s'appelle `m365` car à la base je pensai embarquer plusieurs
scripts, dont seul `m365-refresh.py` serait un service.

### packages/m365/default.nix

```nix
{ lib, pkgs, python3Packages, ... }:

python3Packages.buildPythonApplication {
  pname = "m365";
  version = "1.0.0";
  src = ./src;

  propagatedBuildInputs = with python3Packages; [
    msal
  ];

  format = "other";

  installPhase = ''
    mkdir -p $out/bin
    install -m755 m365-refresh.py $out/bin/m365-refresh.py
  '';

  meta = with lib; {
    description = "Refresh oauth2 access token using MSAL";
    platforms = platforms.linux;
  };
}
```

`buildPythonApplication` va s'occuper de créér un wrapper pour
surcharger le shebang du script, et bien être en isolation par
rapport au système.  

Il va gérer l'installation du package python `msal`.  

Le script python en lui-même : [src/m365-refresh.py]

### modules/m365/default.nix

```nix
{ lib, config, pkgs, ...}:

let
  cfg = config.services.m365-refresh;
in
{
  options.services.m365-refresh = {
    enable = lib.mkEnableOption "m365 MSAL shit";
    schedule = lib.mkOption {
      type = lib.types.str;
      default = "hourly";
      description = "Systemd timer schedule";
    };
    config = lib.mkOption {
      type = lib.types.str;
      description = "path to configuration file";
    };
  };

  config = lib.mkIf cfg.enable {
  	systemd.user.services.m365-refresh = {
  	  Unit = {
  	  	Description = "m365 MSAL shit";
  	  };
  	  Service = {
  	  	Type = "oneshot";
  	    ExecStart = "${pkgs.m365}/bin/m365-refresh.py --config ${cfg.config}";
  	  };
  	};

  	systemd.user.timers.m365-refresh = {
  	  Unit = {
  	  	Description = "Timer for m365-refresh";
  	  };
  	  Timer = {
  	  	OnCalendar = cfg.schedule;
  	  	Persistent = true;
  	  };
  	  Install = {
  	  	WantedBy = [ "timers.target" ];
  	  };
  	};
  };
}
```

C'est ce module qui va nous permettre, dans notre config
`home-manager` de déclarer le service, avec la config
dont on a besoin [config.py].

Le bloc `options.services.m365-refresh` nous permet de définir
les options qui seront configuration dans notre config
`home-manager` (notamment l'emplacer du fichier [config.py]).

Ensuite, il s'agit de la déclaration du service systemd et son
timer qui le déclenche.


### overlays/m365/default.nix

```nix
{ channels, inputs, ... }:

final: prev: {
  m365 = inputs.self.packages.${final.system}.m365;
}
```

Cet overlay ne mérite pas vraiment d'attention, il nous permet juste
d'ajouter le package `m365` dans `pkgs`.


## Utilisation du module

### Ajout du input dans flake.nix

```nix
sshtui = {
  url = "github:gfriloux/nix-m365";
  inputs.nixpkgs.follows = "nixpkgs";
};
```

### Déclaration du module home-manager

```nix
modules = [
  nix-m365.homeModules.m365
];
```

### Installation du service

```nix
services = {
  m365-refresh = {
    enable = true;
    schedule = "hourly";
    config = "/home/kuri/.config/m365/config.py";
  };
};
```

## Vérification


### Service systemd
```
 kuri@Nomad  ~  11:29  systemctl --user status m365-refresh
○ m365-refresh.service - m365 MSAL shit
     Loaded: loaded (/home/kuri/.config/systemd/user/m365-refresh.service; linked; preset: enabled)
     Active: inactive (dead) since Wed 2026-01-07 11:00:46 CET; 29min ago
 Invocation: 76d591c4f9cb4fd3b528e3de7b590869
TriggeredBy: ● m365-refresh.timer
    Process: 59019 ExecStart=/nix/store/i09rwnf3d1abavcmn0f4kz3gs5k370ax-m365-1.0.0/bin/m365-refresh.py --config /home/kuri/.config/m365/config.py (code=exited, status=0/SUCCESS)
   Main PID: 59019 (code=exited, status=0/SUCCESS)
   Mem peak: 49.1M
        CPU: 227ms

janv. 07 11:00:45 Nomad systemd[5477]: Starting m365 MSAL shit...
janv. 07 11:00:46 Nomad systemd[5477]: Finished m365 MSAL shit.
```

### Timer systemd

```
 kuri@Nomad  ~  11:29  systemctl --user list-timers
NEXT                         LEFT LAST                           PASSED UNIT               ACTIVATES           
Wed 2026-01-07 12:00:00 CET 29min Wed 2026-01-07 11:00:45 CET 29min ago m365-refresh.timer m365-refresh.service

1 timers listed.
Pass --all to see loaded but inactive timers, too.
```

[m365-refresh]: https://github.com/gfriloux/nix-m365
[flake.nix]: https://github.com/gfriloux/nix-m365/blob/c4f523c05fb1e0ec99a0d1efc41b153fd23eca71/flake.nix
[UvA-FNWI/M365-IMAP]: https://github.com/UvA-FNWI/M365-IMAP
[src/m365-refresh.py]: https://github.com/gfriloux/nix-m365/blob/c4f523c05fb1e0ec99a0d1efc41b153fd23eca71/packages/m365/src/m365-refresh.py
[config.py]: https://github.com/UvA-FNWI/M365-IMAP/blob/main/config.py
