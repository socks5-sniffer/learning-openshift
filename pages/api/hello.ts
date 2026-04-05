// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  name: string
}

type ErrorData = {
  error: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | ErrorData>
) {
  // Security: Only allow GET requests
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET'])
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Security: Set cache control headers
  res.setHeader('Cache-Control', 'public, max-age=60, stale-while-revalidate=30')
  
  res.status(200).json({ name: 'John Doe' })
}
