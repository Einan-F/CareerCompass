import { supabase } from '../supabase'

export const applicationService = {
  // Create new application
  async create(applicationData) {
    const { data: auth } = await supabase.auth.getUser()
    const userId = auth?.user?.id
    const payload = {
      ...applicationData,
      ...(userId && !applicationData.user_id ? { user_id: userId } : {}),
    }
    // Normalize empty UUID-like fields to null to avoid 22P02 errors
    Object.keys(payload).forEach((key) => {
      if (key.endsWith('_id') && payload[key] === '') {
        payload[key] = null
      }
    })

    const { data, error } = await supabase
      .from('applications')
      .insert(payload)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Get all applications
  async getAll() {
    const { data: auth } = await supabase.auth.getUser()
    const userId = auth?.user?.id
    const { data, error } = await supabase
      .from('applications')
      .select(`
        *,
        cv:cvs!cv_version_id (
          id,
          version_name,
          file_url
        )
      `)
      .eq('user_id', userId)
      .order('application_date', { ascending: false })

    if (error) throw error
    return data
  },

  // Get application by id
  async getById(id) {
    const { data, error } = await supabase
      .from('applications')
      .select(`
        *,
        cv:cvs!cv_version_id (
          id,
          version_name,
          file_url
        )
      `)
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  // Update application
  async update(id, updateData) {
    const { data, error } = await supabase
      .from('applications')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Delete application
  async delete(id) {
    const { error } = await supabase
      .from('applications')
      .delete()
      .eq('id', id)

    if (error) throw error
    return true
  },

  // Get analytics data
  async getAnalytics() {
    const { data: applications, error } = await supabase
      .from('applications')
      .select('*')

    if (error) throw error

    return {
      totalApplications: applications.length,
      statusDistribution: applications.reduce((acc, app) => {
        acc[app.status] = (acc[app.status] || 0) + 1
        return acc
      }, {}),
      applicationsBySource: applications.reduce((acc, app) => {
        acc[app.job_source] = (acc[app.job_source] || 0) + 1
        return acc
      }, {}),
      applicationsByMonth: applications.reduce((acc, app) => {
        const month = new Date(app.application_date).toISOString().slice(0, 7)
        acc[month] = (acc[month] || 0) + 1
        return acc
      }, {})
    }
  }
}
