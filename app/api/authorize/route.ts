import { cookies } from 'next/headers'

export async function POST(request: Request) {
  console.log('POST Nextjs API called')
  const res = await request.json()
  res['sessionId'] = cookies().get('sessionId')?.value
  const req = await (await fetch('http://127.0.0.1:8000/authorize', {"method": "post", "body": JSON.stringify(res)})).json()
  return Response.json(req)
}