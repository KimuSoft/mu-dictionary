import fs from 'fs'


const data = []

const fetchNext = async (url) => {
  const res = await fetch(url)
  const result = await res.json()
  data.push(...result.results)
  return result.next
}

let next = 'https://api.laftel.net/api/search/v1/discover/?sort=name&offset=0&size=100'

while (next) {
  console.log(`Fetching: ${next}`)
  next = await fetchNext(next)
  await new Promise(resolve => setTimeout(resolve, 100))
}

fs.writeFileSync('laftel.json', JSON.stringify(data))

