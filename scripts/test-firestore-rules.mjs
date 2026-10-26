import { existsSync } from 'node:fs'
import { spawnSync } from 'node:child_process'

const env = { ...process.env }
env.FIREBASE_TOOLS_DISABLE_UPDATE_CHECK = '1'
const homebrewJavaBin = '/opt/homebrew/opt/openjdk@21/bin'

if (!env.JAVA_HOME && existsSync(`${homebrewJavaBin}/java`)) {
  env.PATH = `${homebrewJavaBin}:${env.PATH ?? ''}`
}

const result = spawnSync(
  'firebase',
  [
    ...(env.FIREBASE_EMULATOR_TEST_CONFIG ? ['--config', env.FIREBASE_EMULATOR_TEST_CONFIG] : []),
    'emulators:exec',
    '--only',
    'firestore',
    'vitest run tests/firestore.rules.test.ts tests/mentoring-reservation.test.ts',
  ],
  {
    env,
    stdio: 'inherit',
  },
)

if (result.error) {
  console.error('Não foi possível iniciar o Firestore Emulator.', result.error)
  process.exit(1)
}

process.exit(result.status ?? 1)
