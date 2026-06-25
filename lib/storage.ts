import { supabaseAdmin } from './supabase'

export async function uploadCertificateFile(
  file: File,
  certificateId: string
): Promise<string> {
  const fileExt = file.name.split('.').pop()
  const fileName = `${certificateId}/${Date.now()}.${fileExt}`

  const { data, error } = await supabaseAdmin.storage
    .from('certificates')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type,
    })

  if (error) throw new Error(error.message)

  const { data: urlData } = supabaseAdmin.storage
    .from('certificates')
    .getPublicUrl(data.path)

  return urlData.publicUrl
}

export async function deleteCertificateFile(
  fileUrl: string
): Promise<void> {
  const path = fileUrl.split('/certificates/')[1]

  if (!path) return

  const { error } = await supabaseAdmin.storage
    .from('certificates')
    .remove([path])

  if (error) throw new Error(error.message)
}