import { supabase } from '../supabase'
import { uploadFile, deleteFile } from '../storageService'

export const cvService = {
  // Create new CV
  async create(cvData) {
    // File URL is already included in cvData after upload
    const { file_url } = cvData;

    const { data, error } = await supabase
      .from('cvs')
      .insert({
        ...cvData,
        user_id: (await supabase.auth.getUser()).data.user.id
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get all CVs
  async getAll() {
    const { data: auth } = await supabase.auth.getUser()
    const userId = auth?.user?.id
    const { data, error } = await supabase
      .from('cvs')
      .select('*')
      .eq('user_id', userId)
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
  async update(id, updateData) {
    // If there's a new file_url, we'll delete the old file after successful update
    if (updateData.file_url) {
      // Get old file URL to delete after successful update
      const { data: oldCv } = await supabase
        .from('cvs')
        .select('file_url')
        .eq('id', id)
        .single();

      const { data, error } = await supabase
        .from('cvs')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Delete old file only if update was successful and there was an old file
      if (oldCv?.file_url && oldCv.file_url !== updateData.file_url) {
        try {
          await deleteFile('cv-files', oldCv.file_url);
        } catch (error) {
          console.error('Failed to delete old CV file:', error);
          // Don't throw here as the update was successful
        }
      }

      return data;
    }

    // Update without new file
    const { data, error } = await supabase
      .from('cvs')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
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
    const { data: auth } = await supabase.auth.getUser()
    const userId = auth?.user?.id
    const { data: cvs, error } = await supabase
      .from('cvs')
      .select(`
        *,
        applications:applications!applications_cv_version_id_fkey(
          status
        )
      `)
      .eq('user_id', userId)
      .eq('is_active', true)

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
