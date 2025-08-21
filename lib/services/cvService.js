import { supabase } from '../supabase'
import { uploadFile, deleteFile } from '../storageService'

export const cvService = {
  // Create new CV
  async create(cvData, file) {
    // First upload the file
    const filePath = await uploadFile('cv-files', file)

    // Then create the CV record
    const { data, error } = await supabase
      .from('cvs')
      .insert({
        ...cvData,
        file_url: filePath
      })
      .select()
      .single()

    if (error) {
      // If there's an error, clean up the uploaded file
      await deleteFile('cv-files', filePath)
      throw error
    }

    return data
  },

  // Get all CVs
  async getAll() {
    const { data, error } = await supabase
      .from('cvs')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  // Get CV by id
  async getById(id) {
    const { data, error } = await supabase
      .from('cvs')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  // Update CV
  async update(id, updateData, newFile = null) {
    let fileUrl = updateData.file_url

    if (newFile) {
      // Upload new file
      fileUrl = await uploadFile('cv-files', newFile)
      
      // Get old file URL to delete after successful update
      const { data: oldCv } = await supabase
        .from('cvs')
        .select('file_url')
        .eq('id', id)
        .single()

      // Update with new file URL
      updateData.file_url = fileUrl

      const { data, error } = await supabase
        .from('cvs')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        // Clean up new file if update failed
        await deleteFile('cv-files', fileUrl)
        throw error
      }

      // Delete old file
      if (oldCv?.file_url) {
        await deleteFile('cv-files', oldCv.file_url)
      }

      return data
    }

    // Update without new file
    const { data, error } = await supabase
      .from('cvs')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Delete CV
  async delete(id) {
    // Get file URL first
    const { data: cv } = await supabase
      .from('cvs')
      .select('file_url')
      .eq('id', id)
      .single()

    // Delete database record
    const { error } = await supabase
      .from('cvs')
      .delete()
      .eq('id', id)

    if (error) throw error

    // Delete file if exists
    if (cv?.file_url) {
      await deleteFile('cv-files', cv.file_url)
    }

    return true
  },

  // Get CV performance metrics
  async getPerformanceMetrics() {
    const { data: cvs, error } = await supabase
      .from('cvs')
      .select(`
        *,
        applications!inner (
          status
        )
      `)

    if (error) throw error

    return cvs.map(cv => {
      const applications = cv.applications || []
      const interviewCount = applications.filter(app => 
        ['offer_received', 'offer_accepted', 'offer_declined'].includes(app.status)
      ).length

      return {
        ...cv,
        interview_rate: applications.length > 0 
          ? (interviewCount / applications.length) * 100 
          : 0,
        applications_count: applications.length
      }
    })
  }
}
