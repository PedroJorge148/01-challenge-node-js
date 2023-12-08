import { parse } from "csv-parse"
import fs from 'node:fs'

const csvPath = new URL('./tasks.csv', import.meta.url)

const stream = fs.createReadStream(csvPath)

const csvParse = parse({
  delimiter: ',',
  skipEmptyLines: true,
  fromLine: 2
})

async function uploadFromCSV() {
  const rowsParse = stream.pipe(csvParse)

  console.log('Iniciando importação do arquivo csv...')

  for await (const row of rowsParse) {
    const [title, description] = row

    await fetch('http://localhost:3333/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        description
      })
    })

    await new Promise(resolve => setTimeout(resolve, 1000))
  }

  console.log('Importação efetuada com sucesso!')
}

uploadFromCSV()