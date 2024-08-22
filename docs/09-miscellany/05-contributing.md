---
title: Contributing
sidebar_position: 5
---

Due to the precarious nature of the Open Specifications Promise, it is very
important to ensure code is cleanroom.

[The Contribution Notes](https://git.sheetjs.com/sheetjs/sheetjs/src/branch/master/CONTRIBUTING.md)
should be perused before contributing code.

<details>
  <summary><b>File organization</b> (click to show)</summary>

Folders:

| folder       | contents                                                      |
|:-------------|:--------------------------------------------------------------|
| `bin`        | server-side bin scripts (`xlsx.njs`)                          |
| `bits`       | raw source files that make up the final script                |
| `dist`       | dist files for web browsers and nonstandard JS environments   |
| `misc`       | miscellaneous supporting scripts                              |
| `modules`    | TypeScript source files that generate some of the bits        |
| `packages`   | Support libraries and tools                                   |
| `test_files` | test files (pulled from the test artifacts distribution)      |
| `tests`      | browser tests (run `make ctest` to rebuild)                   |
| `types`      | TypeScript definitions and tests                              |

</details>

After cloning the repo, running `make help` will display a list of commands.

## Setup

These instructions will cover system configuration, cloning the source repo,
building, reproducing official releases, and running NodeJS and browser tests.

:::note Tested Deployments

These instructions were tested on the following platforms:

| Platform                      | Architecture | Test Date  |
|:------------------------------|:-------------|:-----------|
| Linux (Steam Deck Holo x64)   | `linux-x64`  | 2024-07-12 |
| Linux (Arch Linux AArch64)    | `linux-arm`  | 2024-05-10 |
| MacOS 14.4 (x64)              | `darwin-x64` | 2024-07-12 |
| MacOS 14.5 (ARM64)            | `darwin-arm` | 2024-05-23 |
| Windows 10 (x64) + WSL Ubuntu | `win10-x64`  | 2024-07-12 |
| Windows 11 (x64) + WSL Ubuntu | `win11-x64`  | 2024-07-26 |
| Windows 11 (ARM) + WSL Ubuntu | `win11-arm`  | 2024-05-23 |

With some additional dependencies, the unminified scripts are reproducible and
tests will pass in Windows XP with NodeJS 5.10.0.

:::

### Install dependencies

#### OS-Specific Setup

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs groupId="os">
  <TabItem value="wsl" label="Windows WSL">

A) Ensure WSL ("WSL 2" in Windows 10) and the Ubuntu distribution are installed.

<details open>
  <summary><b>Installation Notes</b> (click to hide)</summary>

In "Turn Windows features on or off", all available features from the following
list should be enabled:

- "Hyper-V" (including every sub-feature)
- "Virtual Machine Platform"
- "Windows Hypervisor Platform"
- "Windows Subsystem for Linux"

:::note pass

The WSL requirements have changed over the years. To be safe, it is recommended
to install every listed feature that is available for the Windows version.

:::

The following command installs Ubuntu within WSL:

```powershell
wsl --update
wsl --install Ubuntu
```

In some versions of `wsl`, the `-d` flag must be specified:

```powershell
wsl --update
wsl --install -d Ubuntu
```

:::info pass

In some tests, the install failed with a `WSL_E_DEFAULT_DISTRO_NOT_FOUND` error.

The resolution is to switch to WSL1, install, and switch back to WSL2:

```
wsl --set-default-version 1
wsl --install Ubuntu
wsl --set-default-version 2
wsl --install Ubuntu
```

:::

:::danger pass

**WSL will not run in a Windows on ARM VM on computers with the M1 CPU**

Apple Silicon M1 processors do not support nested virtualization.

M2 processors do support nested virtualization. SheetJS users have reported
success with Windows on ARM running on computers with the M2 Max CPU.

:::

</details>

B) Install NVM within WSL:

```bash
sudo apt-get install curl
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/master/install.sh | bash
```

C) Exit the WSL session and start a new session

D) Install NodeJS 16 using NVM:

```bash
nvm install 16
nvm use 16
```

E) Clone the [`js-crc32` repo](https://git.sheetjs.com/sheetjs/js-crc32)

```bash
git clone https://git.sheetjs.com/sheetjs/js-crc32
```

:::note pass

On Windows 10, this clone may fail due to issues with `core.filemode`:

```
fatal: could not set 'core.filemode' to 'false'
```

The main drive must be remounted with the metadata option:

```bash
cd /
sudo umount /mnt/c
sudo mount -t drvfs C: /mnt/c -o metadata
cd -
```

:::

:::note pass

If this clone fails with an error message that mentions SSL or secure connection
or certificates, build and install a version of Git with proper SSL support:

```bash
# Git does not support OpenSSL out of the box, must do this
curl -LO https://github.com/niko-dunixi/git-openssl-shellscript/raw/main/compile-git-with-openssl.sh
chmod +x compile-git-with-openssl.sh
./compile-git-with-openssl.sh
```

:::

F) Set `git` config `core.autocrlf` setting to `false`. The following commands
should be run twice, once within PowerShell (if Git for Windows is installed)
and once within WSL bash:

```bash
git config --global --add core.autocrlf false
git config --global --unset core.autocrlf true
```

G) Run `unzip`. If the program is missing, install manually:

```bash
sudo apt-get install -y unzip
```

H) Run `make`. If the program is missing, install manually:

```bash
sudo apt-get install -y make
```

  </TabItem>
  <TabItem value="osx" label="MacOS">

A) Open a terminal window and run `git`.

If Xcode or the command-line tools are not installed, you will be asked to
install. Click "Install" and run through the steps.

B) Open a terminal window and install the Homebrew package manager:

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

C) Close the window, open a new terminal window, and disable analytics:

```bash
brew analytics off
```

To confirm analytics are disabled, run

```bash
brew analytics state
```

The message should state that analytics are disabled or destroyed.

D) Install NodeJS.

:::note pass

[The official NodeJS site](https://nodejs.org/en/download/) provides installers
for "LTS" and "Current" releases.  The "LTS" version should be installed.

**Older versions of macOS are not compatible with newer versions of NodeJS.**

In local testing, macOS 10.13 required NodeJS version `12.22.12`:

```bash
curl -LO https://nodejs.org/download/release/v12.22.12/node-v12.22.12.pkg
open node-v12.22.12.pkg
```

:::

  </TabItem>
  <TabItem value="l" label="Linux">

A) Install `curl`, `git`, and build tools using the system package manager.

On Debian and Ubuntu systems, `build-essential`, `curl` and `git` are required:

```bash title="Debian and Ubuntu"
sudo apt update
sudo apt-get install build-essential curl git
```

On Arch Linux, `base-devel`, `curl` and `git` are required:

```bash title="Arch Linux"
sudo pacman -Syu base-devel curl git
```

Other Linux distributions may use other package managers.

<details open>
  <summary><b>Steam Deck</b> (click to hide)</summary>

Desktop Mode on the Steam Deck uses `pacman`.  It also requires a few steps.

0) Switch to Desktop mode and open `Konsole`

:::tip pass

At this point, it is strongly recommended to install the `ungoogled-chromium`
browser from the "Discover" app and open this page on the Steam Deck. Running
the browser on the device makes it easy to copy and paste commands.

:::

1) Set a password for the user by running `passwd` and following instructions.

2) Disable read-only mode:

```bash
sudo steamos-readonly disable
```

(When prompted, enter the password assigned in step 1)

3) Configure keyring:

```bash
sudo sh -c 'echo "keyserver hkps://keyserver.ubuntu.com" >> /etc/pacman.d/gnupg/gpg.conf'
sudo pacman-key --init
sudo pacman-key --populate
sudo pacman-key --refresh-keys
```

4) Install dependencies:

```bash
sudo pacman -S base-devel git curl
```

:::note pass

In local testing on the Steam Deck, some of the C / C++ demos failed to build.
This issue was resolved by manually installing `glibc` and `linux-api-headers`:

```bash
sudo pacman -S glibc linux-api-headers
```

These packages are *not required* for building or testing the library.

:::

</details>

B) Install NodeJS.

:::note pass

[The official NodeJS site](https://nodejs.org/en/download/) provides Linux
binaries, but it is strongly recommended to use `nvm` to install NodeJS:

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash
```

After installing, start a new terminal session and install NodeJS "LTS":

```bash
nvm install --lts
```

After installing, if running `node` in the terminal fails with a `glibc` error,
an older version of NodeJS should be installed.  For example, Ubuntu 18.04 does
not support Node 18 but supports Node 16.20.0:

```bash
nvm install 16
nvm use 16
```

:::

C) Run `unzip`. If the program is missing, install manually:

```bash
sudo apt-get install -y unzip
```

D) Run `make`. If the program is missing, install manually:

```bash
sudo apt-get install -y make
```

  </TabItem>
</Tabs>

### Build from source tree

0) Clone the project:

```bash
git clone https://git.sheetjs.com/sheetjs/sheetjs
cd sheetjs
```

:::note pass

On older platforms, the clone may fail due to SSL certificate problems:

```bash
fatal: unable to access 'https://git.sheetjs.com/sheetjs/sheetjs/': SSL certificate problem: certificate has expired
```

The simplest workaround is to disable SSL verification:

```bash
git config --global http.sslVerify false
```

**It is strongly recommended to re-enable SSL verification after cloning**:

```bash
git config --global http.sslVerify true
```

:::

1) Install NodeJS modules for building the scripts:

```bash
npm i
npm i -g mocha@2.5.3 voc @sheetjs/uglify-js
```

:::caution pass

If `npm i -g` fails with a permissions issue, run the command with `sudo`:

```bash
npm i
sudo npm i -g mocha@2.5.3 voc @sheetjs/uglify-js
```

:::

:::note Older Versions of Dependencies

Some of the dependencies are wildly out of date. While SheetJS libraries aim to
run in older versions of NodeJS and browsers, some libraries have opted to break
backwards compatibility. The specific versions are used because they are known
to work and known to produce consistent and reproducible results.

:::

2) Initialize the test files:

```bash
rmdir test_files
curl -LO https://test-files.sheetjs.com/test_files.zip
unzip test_files.zip
mkdir -p tmp
```

:::note pass

The `rmdir` command may fail if the folder is missing. The error can be ignored.

:::

This step may take a few minutes as the current test snapshot is large.

3) Run the `esbuild` tool once:

```bash
npx -y esbuild@0.14.14
```

4) Run a build and verify with a short test:

```bash
# Full Build
cd modules; make clean; make; cd ..
make
make dist

# Short test
make test_misc

# Reset repo
git checkout -- .
```

:::info pass

In some tests on older releases of macOS, the build failed with an error:

```bash
ReferenceError: n is not defined
```

The first error in the call stack points to `dist/xlsx.zahl.js`.

Older versions of macOS `sed` are known to misinterpret newline characters. The
workaround is to upgrade to a newer version of `sed`. On macOS:

```bash
brew install gnu-sed
echo 'export PATH="/usr/local/opt/gnu-sed/libexec/gnubin:$PATH"' >> ~/.profile
. ~/.profile
```

:::

### Reproduce official builds

5) Run `git log` and search for the commit that matches a particular release
version.  For example, version `0.20.3` can be found with:

```bash
git log | grep -B4 "version bump 0.20.3"
```

The output should look like:

```bash
$ git log | grep -B4 "version bump 0.20.3"
# highlight-next-line
commit 8a7cfd47bde8258c0d91df6a737bf0136699cdf8 <-- this is the commit hash
Author: SheetJS <dev@sheetjs.com>
Date:   Fri Jul 12 11:47:14 2024 -0400

    version bump 0.20.3
```

6) Switch to that commit:

```bash
git checkout 8a7cfd47bde8258c0d91df6a737bf0136699cdf8
```

7) Run the full build sequence

```bash
make clean; make
cd modules; make clean; make; cd ..
make
make dist
```

8) To verify that the files are intact, use `md5sum` (`md5` on MacOS).

The local checksum for the browser script can be computed with:

<Tabs groupId="os">
  <TabItem value="wsl" label="Windows WSL">

```bash
md5sum dist/xlsx.full.min.js
```

  </TabItem>
  <TabItem value="osx" label="MacOS">

```bash
md5 dist/xlsx.full.min.js
```

  </TabItem>
  <TabItem value="l" label="Linux">

```bash
md5sum dist/xlsx.full.min.js
```

  </TabItem>
</Tabs>


The checksum for the CDN version can be computed with:

<Tabs groupId="os">
  <TabItem value="wsl" label="Windows WSL">

```bash
curl -L https://cdn.sheetjs.com/xlsx-0.20.3/package/dist/xlsx.full.min.js | md5sum -
```

  </TabItem>
  <TabItem value="osx" label="MacOS">

```bash
curl -k -L https://cdn.sheetjs.com/xlsx-0.20.3/package/dist/xlsx.full.min.js | md5
```

  </TabItem>
  <TabItem value="l" label="Linux">

```bash
curl -L https://cdn.sheetjs.com/xlsx-0.20.3/package/dist/xlsx.full.min.js | md5sum -
```

  </TabItem>
</Tabs>

When the demo was last tested on macOS, against version `0.20.3`:

>
```bash
$ md5 dist/xlsx.full.min.js
# highlight-next-line
MD5 (dist/xlsx.full.min.js) = 6b3130af1ceadf07caa0ec08af7addff
$ curl -k -L https://cdn.sheetjs.com/xlsx-0.20.3/package/dist/xlsx.full.min.js | md5
# highlight-next-line
6b3130af1ceadf07caa0ec08af7addff
```

The two hashes should match.

9) Return to the `HEAD` commit:

```bash
git checkout master
```

### Test in web browsers

10) Start local server:

```bash
make ctestserv
```

The terminal will display a port number.  For example:

```
Serving HTTP on 0.0.0.0 port 8000 (http://0.0.0.0:8000/)
```

11) Open a browser window and access `http://localhost:8000`, replacing `8000`
with the port number from the terminal window.

## Development

The `xlsx.js` and `xlsx.mjs` files are constructed from the files in the `bits`
subfolder. The build script (run `make`) will concatenate the individual bits
to produce the scripts.

When changing the `.js` scripts in `bits`, the following sequence rebuilds the
`xlsx.js` and `xlsx.mjs` scripts:

```bash
make
```

When changing the `.ts` scripts in `modules`, the following sequence rebuilds
the `xlsx.js` and `xlsx.mjs` scripts:

```bash
cd modules; make clean; make; cd ..
```

To produce the dist files, run `make dist`.

:::info pass

The various `xlsx.*` scripts in the base folder and the files in the `dist`
folder are updated on each version release.

**They should not be committed between versions!**

:::

## Tests

The `test_misc` target runs the targeted feature tests.  It should take 5-10
seconds to perform feature tests without testing against the full test battery.
New features should be accompanied with tests for the relevant file formats.

For tests involving the read side, an appropriate feature test would involve
reading an existing file and checking the resulting workbook object.  If a
parameter is involved, files should be read with different values to verify that
the feature is working as expected.

For tests involving a new write feature which can already be parsed, appropriate
feature tests would involve writing a workbook with the feature and then opening
and verifying that the feature is preserved.

For tests involving a new write feature without an existing read ability, please
add a feature test to the kitchen sink `tests/write.js`.

