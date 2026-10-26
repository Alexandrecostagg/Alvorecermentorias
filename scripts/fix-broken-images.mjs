import { readFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'

function getAccessToken() {
  const configPath = join(homedir(), '.config', 'configstore', 'firebase-tools.json')
  const config = JSON.parse(readFileSync(configPath, 'utf8'))
  const tokens = config.tokens

  if (!tokens || !tokens.access_token) {
    throw new Error('Nenhum access token encontrado no Firebase CLI.')
  }

  return tokens.access_token
}

const fixes = [
  {
    documentId: 'Q03Vy2cTtg2TNPmzXIb2',
    title: 'Camiseta Soldadinho (Dourada)',
    newImage: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
  },
  {
    documentId: 'yoCxzRqmupjOZxECMFIH',
    title: 'Leãozinho da Tribo (Pelúcia)',
    newImage: 'https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=800&q=80',
  },
  {
    documentId: 'ysIpPJMxobvNj0NAOusa',
    title: 'Luminária Arca de Noé',
    newImage: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=800&q=80',
  },
]

async function run() {
  const accessToken = getAccessToken()
  const projectId = 'alvorecermentorias'
  const databaseId = '(default)'

  for (const item of fixes) {
    console.log(`\nAtualizando "${item.title}" (${item.documentId})...`)
    const docUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/${databaseId}/documents/products/${item.documentId}?updateMask.fieldPaths=image`

    const payload = {
      fields: {
        image: { stringValue: item.newImage },
      },
    }

    const res = await fetch(docUrl, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      const err = await res.text()
      console.error(`Erro ao atualizar ${item.documentId}:`, err)
    } else {
      console.log(`✓ Documento ${item.documentId} atualizado com sucesso!`)
    }
  }

  console.log('\nProcesso finalizado.')
}

run().catch((err) => {
  console.error('Falha na execução:', err)
  process.exit(1)
})
