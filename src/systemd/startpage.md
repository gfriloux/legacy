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

## Étapes de construction

### littleweb

Projet `rust` utilisant [Actix Web](https://actix.rs/) pour servir des
fichiers statiques.

A l'heure de l'écriture de cette page, le packaging de ce projet
(compilation d'un binaire statique) se fait dans ce bloc:
```nix
littleweb = pkgs.rustPlatform.buildRustPackage (finalAttrs: {
  pname = "littleweb";
  version = "1.4.0";
  src = pkgs.fetchFromGitHub {
    owner = "gfriloux";
    repo = "littleweb";
    rev = "v1.4.0";
    sha256 = "sha256-Y2u2z/N73S5kJnsojNjY5OHTncZujyd8pLjcVSX/Cv4=";
  };
  cargoHash = "sha256-B9iAE5ua1I7kIfX9tBnnp2ewAs4j5oD8ttQqeorF5Xo=";
});
```

### retro-crt-startpage

La startpage [retro-crt-startpage](https://scar45.github.io/retro-crt-startpage/index.html)
que l'on souhaite servir en `HTTP`.  

Réalisé par ce simple bloc:
```nix
website = pkgs.stdenv.mkDerivation rec {
  title = "retro-crt-startpage";
  description = "HTML5-based layout for a personalized retro CRT startpage.";
  name = "retro-crt-startpage";
  version = "1.3.1";
  src = pkgs.fetchzip {
    url = "https://github.com/scar45/retro-crt-startpage/releases/download/v1.3.1/retro-crt-startpage-v1.3.1-release.zip";
    hash = "sha256-UmYyfEy2BVMavAdEqlEYNT5A6dPXuxViAZ18n1fxCfc=";
  };
  nativebuildInputs = [ pkgs.zip ];
  installPhase = ''
    mkdir -p $out
    cp -r css fonts images js *.png *.html *.xml *.txt *.mp3 $out/
    cp ${./links.json} $out/links.json
  '';
};
```

On note que l'on ajoute notre fichier `links.json` local
au projet, qui n'en contient pas par défaut.

### Portable service

Construit l'image `.raw` compatible [portable service](portables.services.md).
Elle référence le package `unit` que je ne paste pas ici, il s'agit
du `service file` du service, que vous pouvez [trouver ici](https://github.com/gfriloux/retro-startpage/blob/0176aa731b4606d5c9ad29a4f2b96f15fc69a0e6/flake.nix#L61).

```nix
oci-systemd = pkgs.portableService {
  pname = "retro-startpage";
  inherit ( packages.website ) version;
  units = [ packages.unit ];
  contents = with pkgs; [ packages.website ];
  homepage = "https://github.com/gfriloux/retro-startpage";
};
```

## Construction du projet

```
nix build .#oci-systemd
```

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
