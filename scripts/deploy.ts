#!/usr/bin/env zx
/* eslint-disable no-console */
/* eslint-disable no-restricted-imports */
import 'zx'
import packageJson from '../package.json'

const branch = await $`git branch --show-current`

if (branch.toString() !== 'master') {
  throw new Error('Error: invalid branch')
}

const hasChanges = await $`git status --porcelain`

if (hasChanges.toString()) {
  throw new Error('Error: there are un-committed changes')
}

// auto increment version
const increment = await question(`Bump version ${packageJson.version}:`, {
  choices: ['path', 'minor', 'major'],
})

// run tests
console.log('Running tests...')

await Promise.all([$`pnpm run test:jest`, $`pnpm run test:ts`])

console.log('Increment version')

await $`npm version ${increment}`

console.log('Building...')

await $`pnpm run build`

console.log('Deploying to Firebase')

// await $`pnpm exec firebase deploy --only hosting,firestore:rules --token=1//0hsUbaf7aVIdjCgYIARAAGBESNwF-L9IrVvYd16RdPJSnUk75SCsb7If587y3fHqGqzGyWjI-Psla0-0OL4G_imThckZELV03kdw`

await $`git push --follow-tags`
