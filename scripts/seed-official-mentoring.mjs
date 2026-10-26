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

const projectId = 'alvorecermentorias'
const databaseId = '(default)'

async function run() {
  const accessToken = getAccessToken()
  console.log('Verificando se já existem mentores no Firestore...')

  const listUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/${databaseId}/documents/mentors`
  const listRes = await fetch(listUrl, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })

  if (!listRes.ok) {
    console.error('Falha ao consultar coleção mentors:', await listRes.text())
    return
  }

  const listData = await listRes.json()
  const existingDocs = listData.documents || []
  console.log(`Encontrados ${existingDocs.length} mentores no Firestore.`)

  if (existingDocs.length > 0) {
    console.log('Coleção mentors já contém dados. Nada a semear.')
    return
  }

  console.log('\nCriando mentor oficial: Pr. Alexandre Gomes da Costa...')
  const createMentorUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/${databaseId}/documents/mentors`
  const mentorPayload = {
    fields: {
      name: { stringValue: 'Pr. Alexandre Gomes da Costa' },
      photo: { stringValue: '/alexandre-gomes-costa.jpg' },
      bio: {
        stringValue:
          'Pastor e conselheiro ministerial com ampla experiência em discipulado, mentoria de líderes e vida espiritual cristã segundo os princípios bíblicos.',
      },
      specialty: { stringValue: 'Liderança Ministerial e Vida Espiritual' },
      trilhas: {
        arrayValue: {
          values: [
            { stringValue: 'lideranca' },
            { stringValue: 'espiritual' },
            { stringValue: 'financas' },
          ],
        },
      },
      rating: { doubleValue: 5.0 },
      reviewCount: { integerValue: '0' },
      sessionCount: { integerValue: '0' },
      available: { booleanValue: true },
      status: { stringValue: 'published' },
      createdAt: { stringValue: new Date().toISOString().split('T')[0] },
    },
  }

  const mentorRes = await fetch(createMentorUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(mentorPayload),
  })

  if (!mentorRes.ok) {
    console.error('Erro ao criar mentor:', await mentorRes.text())
    return
  }

  const createdMentor = await mentorRes.json()
  const mentorPath = createdMentor.name // ex: projects/.../documents/mentors/ABC123
  const mentorId = mentorPath.split('/').pop()
  console.log(`✓ Mentor criado com sucesso com ID: ${mentorId}`)

  console.log('\nCriando programa oficial estruturado: Liderança Cristã...')
  const createProgramUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/${databaseId}/documents/mentoringPrograms`
  const programPayload = {
    fields: {
      mentorId: { stringValue: mentorId },
      trilha: { stringValue: 'lideranca' },
      title: { stringValue: 'Liderança Cristã: Do Chamado à Prática' },
      description: {
        stringValue:
          'Programa estruturado de 12 semanas focado em fundamentos bíblicos de liderança servidora, caráter e ministério.',
      },
      objective: {
        stringValue:
          'Desenvolver líderes comprometidos com o Evangelho, servindo com integridade, sabedoria bíblica e multiplicação de discípulos.',
      },
      duration: { stringValue: '12 semanas' },
      totalSessions: { integerValue: '12' },
      price: { doubleValue: 599.0 },
      status: { stringValue: 'published' },
      targetAudience: { stringValue: 'Líderes de ministérios, pastores e servos da igreja local' },
    },
  }

  const progRes = await fetch(createProgramUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(programPayload),
  })

  if (!progRes.ok) {
    console.error('Erro ao criar programa:', await progRes.text())
    return
  }

  const createdProg = await progRes.json()
  const progId = createdProg.name.split('/').pop()
  console.log(`✓ Programa oficial criado com sucesso com ID: ${progId}`)

  console.log('\nMentoria inicializada com dados reais e oficiais no Firestore!')
}

run().catch((err) => {
  console.error('Erro geral:', err)
  process.exit(1)
})
