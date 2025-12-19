# Devbox

[Devbox](https://www.jetify.com/devbox) permet de créér des environnements
reproductibles entre différentes machines.  

Ce projet se distingue des autres par son extrême simplicité:  
**vous n'avez pas besoin de savoir utiliser `nix` pour utiliser `devbox`**.

Il s'agit d'une surcouche à `nix` et aux `flakes`, afin de rendre le tout
immédiatement utilisable pour créér des environnements de travail sur des
projets!

## Exemple Ansible

### En local sous archlinux

Depuis un PC sous [Archlinux](https://archlinux.fr/) avec `nix` + [Devbox](https://www.jetify.com/devbox),
j'ai `ansible` qui a été installé depuis les packages `archlinux`:
```bash
 kuri@Nomad  ansible  16:33  which ansible
/usr/sbin/ansible
 kuri@Nomad  ansible  16:33  ansible --version
ansible [core 2.20.0]
  config file = None
  configured module search path = ['/home/kuri/.ansible/plugins/modules', '/usr/share/ansible/plugins/modules']
  ansible python module location = /usr/lib/python3.13/site-packages/ansible
  ansible collection location = /home/kuri/.ansible/collections:/usr/share/ansible/collections
  executable location = /usr/sbin/ansible
  python version = 3.13.11 (main, Dec  7 2025, 13:01:45) [GCC 15.2.1 20251112] (/usr/bin/python)
  jinja version = 3.1.6
  pyyaml version = 6.0.3 (with libyaml v0.2.5)
```

Nous avons `ansible` + `jinja` + `python` ainsi que diverses librairies
`python` afin que notre installation d'`ansible` soit fonctionnelle.

Pour cela, sous archlinux, j'ai fait `pacman -S ansible`.

### Le problème c'est les autres

Si j'ai 3 collègues, sous les OS suivants:

1. Windows (WSL)
2. macOS
3. Ubuntu

Je vais devoir leur dire de se débrouiller, pour voir comment installer
`ansible` sur leurs machines.

### La solution c'est devbox

Ou alors, je passe à la méthode [Devbox](https://www.jetify.com/devbox):

```bash
 kuri@Nomad  ansible  16:35  devbox init
 kuri@Nomad  ansible  16:39  devbox add ansible
Info: Adding package "ansible@latest" to devbox.json
 kuri@Nomad  ansible  16:39  devbox shell
Info: Ensuring packages are installed.
✓ Computed the Devbox environment.
Starting a devbox shell...
Linux Nomad 6.17.9-arch1-1 x86_64
 16:40:06  up   8:34,  1 user,  load average: 0,38, 0,24, 0,28
(devbox)  kuri@Nomad  ansible  16:40  ansible --version
ansible [core 2.20.0]
  config file = None
  configured module search path = ['/home/kuri/.ansible/plugins/modules', '/usr/share/ansible/plugins/modules']
  ansible python module location = /nix/store/06p0i8w8zqrinjwldnypkva8s6ivz0r0-python3.13-ansible-core-2.20.0/lib/python3.13/site-packages/ansible
  ansible collection location = /home/kuri/.ansible/collections:/usr/share/ansible/collections
  executable location = /nix/store/06p0i8w8zqrinjwldnypkva8s6ivz0r0-python3.13-ansible-core-2.20.0/bin/ansible
  python version = 3.13.9 (main, Oct 14 2025, 13:52:31) [GCC 14.3.0] (/nix/store/3lll9y925zz9393sa59h653xik66srjb-python3-3.13.9/bin/python3.13)
  jinja version = 3.1.6
  pyyaml version = 6.0.3 (with libyaml v0.2.5)
```

Si ce dossier se trouve être un dépôt `git`, dans lequel je commit les fichiers
`devbox.{json,lock}`, tout personne qui le clone va travailler avec les mêmes
versions de packages que ceux définis dans `devbox.lock`.  
Et donc, à moins d'un bug spécifique à l'OS, tout le reste fonctionnera
à l'identique (y compris sous `ARM`).

### Installer ansible-core 2.16

Que ce soit via `devbox search ansible` ou [Nixhub](https://www.nixhub.io/packages/ansible),
je peux lister d'autres versions d'ansible disponibles.

Dans le cas de gestion de serveurs d'une autre époque (article écrit en décembre 2025), par exemple:

1. CentOS 7
2. Amazon Linux 2
3. Debian 10

La version `2.17` casse le support de ces versions, et nous devons donc utiliser la version
`2.16`, qui n'est globalement plus packagée.

Dans un monde ancien, nous aurions sous le coude une VM sous une version périmée
de `Debian` (genre la `10`), qui pointe sur le dépôt des archives, et qui aurait
`ansible 2.16` + toutes les deps à la bonne version, et on bichonnerait cette VM
comme le saint graal.  

Ou, encore pire, on considère que des outils de gestion de config/conformité, c'est mal,
car les dernières versions ne supportent plus les dinos (le vrai problème
étant qu'on ne sait pas MAJ les serveurs).

Maintenant, réglons ce problème à la manière de [Devbox](https://www.jetify.com/devbox):
```bash
 kuri@Nomad  ansible  17:22  devbox rm ansible
 kuri@Nomad  ansible  17:22  devbox add ansible@2.16.5
Info: Adding package "ansible@2.16.5" to devbox.json
Info: Installing the following packages to the nix store: ansible@2.16.5
 kuri@Nomad  ansible  17:23  devbox shell
Info: Ensuring packages are installed.
✓ Computed the Devbox environment.
Starting a devbox shell...
Linux Nomad 6.17.9-arch1-1 x86_64
 17:23:16  up   9:18,  1 user,  load average: 0,95, 0,50, 0,65
(devbox)  kuri@Nomad  ansible  17:23  ansible --version
ansible [core 2.16.5]
  config file = None
  configured module search path = ['/home/kuri/.ansible/plugins/modules', '/usr/share/ansible/plugins/modules']
  ansible python module location = /nix/store/a5k2lpbxj419kzn2pyz55gql35pbg8xx-python3.12-ansible-core-2.16.5/lib/python3.12/site-packages/ansible
  ansible collection location = /home/kuri/.ansible/collections:/usr/share/ansible/collections
  executable location = /nix/store/a5k2lpbxj419kzn2pyz55gql35pbg8xx-python3.12-ansible-core-2.16.5/bin/ansible
  python version = 3.12.4 (main, Jun  6 2024, 18:26:44) [GCC 13.3.0] (/nix/store/04gg5w1s662l329a8kh9xcwyp0k64v5a-python3-3.12.4/bin/python3.12)
  jinja version = 3.1.4
  libyaml = True
```

Que je sois sous `Archlinux`, `NixOS`, `Ubuntu`, `macOS`, `Windows`,
et peu importe les versions, tant que j'ai `devbox` (et donc `nix`),
j'ai cette reproductibilité sur des milliers de packages, ainsi que
les anciennes versions de ces packages, dans des envs isolé et
reproductibles!

## Sources

- [What is Devbox?](https://www.jetify.com/docs/devbox)
- [Devbox: A User-Friendly Approach to Reproducible Development Environments with Nix](https://medium.com/vafion/devbox-a-user-friendly-approach-to-reproducible-development-environments-with-nix-83dbcd0ab8d8)
