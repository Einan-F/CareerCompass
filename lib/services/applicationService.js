import { supabase } from '../supabase'

export const applicationService = {
  // Create new application
  async create(applicationData) {
    const { data, error } = await supabase
      .from('applications')
      .insert(applicationData)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Get all applications
  async getAll() {
    const { data, error } = await supabase
      .from('applications')
      .select(`
        *,
        cv:cv_version_used (
          version_name,
          file_url
        )
      `)
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
        cvs (
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
