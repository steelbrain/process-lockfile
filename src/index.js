// @flow

import fs from 'fs'
import { promisifyAll } from 'sb-promisify'

const pfs = promisifyAll(fs)
const lockedFiles = new Set()

export async function isLocked(path: string): Promise<boolean> {
  try {
    await pfs.accessAsync(path, fs.R_OK)
  } catch (_) { return false }
  const contents = await pfs.readFileAsync(path, 'utf8')
  const pid = parseInt(contents, 10) || -1
  try {
    process.kill(pid, 0)
    return true
  } catch (error) {
    return false
  }
}

export function isLockedSync(path: string): boolean {
  try {
    pfs.accessSync(path, fs.R_OK)
  } catch (_) { return false }
  const contents = pfs.readFileSync(path, 'utf8')
  const pid = parseInt(contents, 10) || -1
  try {
    process.kill(pid, 0)
    return true
  } catch (error) {
    return false
  }
}

export async function unlock(path: string) {
  try {
    await pfs.accessAsync(path, fs.R_OK)
  } catch (_) { return }
  await pfs.unlinkAsync(path)
  lockedFiles.delete(path)
}

export function unlockSync(path: string) {
  try {
    pfs.accessSync(path, fs.R_OK)
  } catch (_) { return }
  pfs.unlinkSync(path)
  lockedFiles.delete(path)
}

export async function lock(path: string) {
  if (await isLocked(path)) {
    throw new Error(`Lockfile already exists: ${path}`)
  }
  await pfs.writeFileAsync(path, process.pid.toString())
  lockedFiles.add(path)
}

export function lockSync(path: string) {
  if (isLockedSync(path)) {
    throw new Error(`Lockfile already exists: ${path}`)
  }
  fs.writeFileSync(path, process.pid.toString())
  lockedFiles.add(path)
}

export function getLockedFiles(): Array<string> {
  return Array.from(lockedFiles)
}

export async function releaseAllLocks() {
  await Promise.all(getLockedFiles().map(unlock))
}

export function releaseAllLocksSync() {
  getLockedFiles().map(unlockSync)
}
