/* @flow */

import os from 'os'
import fs from 'fs'
import path from 'path'
import { it } from 'jasmine-fix'
import * as pl from '../'

function getLockFilePath(name: string) {
  return path.join(os.tmpdir(), `process-lockfile-test-${name}`)
}

describe('process-lockfile', function() {
  describe('the whole flow', function() {
    it('works I guess', async function() {
      const lockPath = getLockFilePath('pid-test')
      expect(await pl.isLocked(lockPath)).toBe(false)
      expect(await pl.getLockedFiles()).toEqual([])
      await pl.lock(lockPath)
      expect(fs.readFileSync(lockPath, 'utf8')).toBe(process.pid.toString())
      expect(await pl.isLocked(lockPath)).toBe(true)
      expect(await pl.getLockedFiles()).toEqual([lockPath])
      await pl.unlock(lockPath)
      expect(await pl.isLocked(lockPath)).toBe(false)
      expect(await pl.getLockedFiles()).toEqual([])

      await pl.lock(lockPath)
      expect(fs.readFileSync(lockPath, 'utf8')).toBe(process.pid.toString())
      expect(await pl.isLocked(lockPath)).toBe(true)
      expect(await pl.getLockedFiles()).toEqual([lockPath])
      pl.releaseAllLocksSync()
      await pl.unlock(lockPath)
      expect(await pl.isLocked(lockPath)).toBe(false)
      expect(await pl.getLockedFiles()).toEqual([])
    })
  })
})
