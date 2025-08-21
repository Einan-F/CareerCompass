import { supabase } from './supabase'

// Upload a file (CV or cover letter)
export async function uploadFile(bucket, file) {
  const user = (await supabase.auth.getUser()).data.user
  if (!user) throw new Error('Not authenticated')

  const filePath = `${user.id}/${Date.now()}-${file.name}`

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file)

  if (error) throw error
  return data.path
}

// Download (signed URL for secure access)
export async function getFileUrl(bucket, path) {
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, 60 * 60) // 1 hour
  if (error) throw error
  return data.signedUrl
}

// Delete file
export async function deleteFile(bucket, path) {
  const { error } = await supabase.storage.from(bucket).remove([path])
  if (error) throw error
  return true
}
