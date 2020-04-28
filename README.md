# menti-ans-demo

Command line helper to get all answers of menti questions.

## Steps

- clone repo
- `npm run build`
- `node dist/index.js <other commands>`

## Commands

| Command         | Note  |
| --------------- |:-------------|
| `-d, --debug` | output extra debugging |
| `-i, --id <type>` | Menti Id without space |
| `-k, --key <type>` | Menti key |
| `-f, --file <type>` | Save result as a file
| `-h, --help` | display help for command

## Example

- Using id (without space)

`node dist/index.js -i 123456`

- Using Key (You can find it in URL)

`node dist/index.js -d -k x8rihuu5np`

- Save result as a file

`node dist/index.js -d -k x8rihuu5np -f result.txt`

## Note

> This code is only for testing and debugging. Please do not use it for hack or cracking. Repository owner is not responsible for any misuse.
