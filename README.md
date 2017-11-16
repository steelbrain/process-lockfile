Process Lockfile
===========

[![Greenkeeper badge](https://badges.greenkeeper.io/steelbrain/process-lockfile.svg)](https://greenkeeper.io/)

Lockfiles for Node.js with extended capabilities

## Installation

```
npm install --save process-lockfile
```

## API

```js
export async function isLocked(path: string): Promise<boolean>
export function isLockedSync(path: string): boolean

export async function unlock(path: string) {
export function unlockSync(path: string)

export async function lock(path: string)
export function lockSync(path: string)

export async function releaseAllLocks()
export function releaseAllLocksSync()

export function getLockedFiles(): Array<string>
```

## Usage

**Note:** Locks become outdated as soon as the process exits regardless of if you release them manually. You **can** hook up `releaseAllLocksSync` on exit events to make your fs one file cleaner tho it's not necessary.

```js
import { lock, isLocked, releaseAllLocksSync } from 'process-lockfile'

async function main() {
  const lockFile = './some-path-for-lockfile'

  if (await isLocked(lockFile)) {
    throw new Error('Lockfile exists at ' + lockFile)
  }
  ['SIGINT', 'SIGTERM'].forEach(event =>
    process.once(event, releaseAllLocksSync),
  )
  await lock(lockFile)
  // .. do your work here
}
```

## License
This project is licensed under the terms of MIT License. See the License file for more info.
