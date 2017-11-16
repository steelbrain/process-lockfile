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

**Note:** This package does not automatically unlock the files on process exit, so you might want to release all locks on process exit or term

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
