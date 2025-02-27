/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios'

const API_URL =
  'https://api-public.streamflow.finance/v2/airdrops/create_distributor'
const API_KEY = 'API_URL'
export const uploadAirdropCSV = async (file: File): Promise<any> => {
  if (!file) throw new Error('No file provided')

  const formData = new FormData()
  formData.append('file', file)

  try {
    const response = await axios.post(API_URL, formData, {
      headers: {
        'x-api-key': API_KEY,
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  } catch (error) {
    console.error('Upload failed:', error)
    throw error
  }
}
