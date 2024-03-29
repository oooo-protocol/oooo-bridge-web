# oooo bridge
oooo is the first modular bitcoin and L2 liquidity cross-rollup bridge protocol.

## Usage

### Development
```bash
# development test environment
pnpm dev
# development livenet network
pnpm dev:livenet
```

### Production
```bash
# compile and minify for test environment
pnpm build
# compile and minify for testnet environment
pnpm build:testnet
# compile and minify for livenet environment
pnpm build:livenet
# analyze the production package
pnpm build:analyze
```

> ‼️ Tips: test environment not equal with testnet, it's follow `.env` file

## Folder Structure
| Name          | Description                                           |
| ------------- | ----------------------------------------------------- |
| public        | Store files that need to be packaged into dist folder |
| src           | -                                                     |
| ᴸ assets      | Store resouces, such as: images, SVG, etc             |
| ᴸ components  | Store reusable components                             |
| ᴸ composables | Store reusable functions, such as hooks               |
| ᴸ entities    | Store entity definition                               |
| ᴸ lib         | Store tool and 3rd functions                          |
| ᴸ pages       | Store project pages                                   |
| ᴸ request     | Store requset related functions                       |
| ᴸ router      | Store project router                                  |
| ᴸ shims       | Implement missing type definitions                    |

## Query config
| Name | Description               |
| ---- | ------------------------- |
| to   | Specify the receive token |
