# hg

my generator

quickly install packageName into a specific directory(`cwd` default).

## install

```bash
npm install -g hg
```

## usage

### install package

```bash
hg install packageName   # install package from `~/.hg`
hg install hushicai@packageName   # install package from github
hg install git@github.com:hushicai/test.git # install package from a specific git url
```

### scaffold

```bash
mkdir hg-test
cd hg-test
hg init # generate a hg package
```